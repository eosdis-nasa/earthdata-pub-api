/**
 * Lambda that exposes Submission API to AWS API Gateway. This lambda
 * is used for most direct interactions with a Submission including the
 * following operations:
 * initialize, submit, review, lock, unlock, status
 * @module Submission
 */

const { DynamoDB, SNS } = require('aws-sdk');

const { DynamodbDriver } = require('database-driver');

const { MessageDriver } = require('message-driver');

const Schema = require('schema-util');

const ClientConfig = require('./client-config.js');

const dbDriver = new DynamodbDriver(
  new DynamoDB(ClientConfig.dynamodb),
  DynamoDB.Converter.marshall,
  DynamoDB.Converter.unmarshall,
  process.env.TABLE_SUFFIX
);

const msgDriver = new MessageDriver({
  snsClient: new SNS(ClientConfig.sns),
  topicArn: process.env.SNS_TOPIC
});

const messageText = {
  initialize: 'A new submission has been initialized.',
  form: 'A form has been submitted for the submission.',
  review: 'A review was completed for the submission.',
  save: 'Form content has been saved and the submission has been unlocked',
  lock: 'The submission was locked to fill a form.',
  unlock: 'The submission was unlocked.',
  resume: 'The workflow has been resumed by an external service.'
};

function constructMessage(submission, type, nextStep = false) {
  const message = {
    body: {
      subject: `Submission ID ${submission.id}`,
      text: messageText[type]
    },
    attributes: {
      notification: 'true',
      submission_id: submission.id,
      workflow_id: submission.workflow_id,
      ...(nextStep ? { next_step: 'true' } : {})
    }
  };
  return message;
}

async function initializeMethod(body, user) {
  // Initialize a new Submission
  const submission = {
    workflow_id: body.workflow_id,
    workflow: { id: body.workflow_id },
    daac_id: body.daac_id,
    initiator_id: user.id,
    completed: {},
    step: '1',
    lock: false,
    form_data: {},
    action_data: {}
  };
  const metadata = { metadata: {} };
  Schema.attachNewId(submission);
  metadata.id = submission.id;
  const referenceMap = Schema.getForeignObjects('submission', submission);
  await dbDriver.refreshNestedObjects(referenceMap);
  submission.step = 'init';
  const response = await dbDriver.putItem('submission', submission);
  await dbDriver.putItem('metadata', metadata);
  constructMessage(submission, 'initialize');
  return response;
}

async function metadataMethod(body) {
  // Fetch or Insert Metadata for a Submission
  if (body.action === 'insert') {
    const response = await dbDriver.getItems('metadata', body.submission_id);
    return response;
  } else if (body.action === 'fetch') {
    const metadata = {
      id: body.submission_id,
      metadata: body.metadata
    };
    const response = await dbDriver.putItem('metadata', metadata);
    return response;
  }
}

async function statusMethod(body) {
  // Fetch a Submission and its Metadata along with data for its current Workflow step
  const [[submission]] = await dbDriver.getItems('submission', body.submission_id);
  const [[metadata]] = await dbDriver.getItems('metadata', body.submission_id);
  const data = { submission, metadata };
  const { steps } = submission.workflow;
  const current = steps[submission.step];
  if (current.type === 'form') {
    const [[form]] = await dbDriver.getItems('form', current.form_id);
    data.form = form;
  } else if (current.type === 'review') {
    data.review = current.review_data;
    if (current.review_data.type === 'form_data') {
      const [[form]] = await dbDriver.getItems('form', current.review_data.id);
      data.form = form;
    }
  }
  return [data];
}

async function submitMethod(body, user) {
  // Submit a form and resume the Workflow
  const [[submission]] = await dbDriver.getItems('submission', body.submission_id);
  const { steps } = submission.workflow;
  const current = steps[submission.step];
  if (current.type === 'form' && submission.lock === user.id) {
    const data = submission.form_data;
    data[current.form_id] = body;
    submission.lock = false;
    await dbDriver.putItem('submission', submission);
    msgDriver.sendSns(constructMessage(submission, 'submit', true));
  }
}

async function saveMethod(body, user) {
  // Saves an in progress form to finish and submit at a later time
  const [[submission]] = await dbDriver.getItems('submission', body.submission_id);
  const { steps } = submission.workflow;
  const current = steps[submission.step];
  if (current.type === 'form' && submission.lock === user.id) {
    const data = submission.form_data;
    data[current.form_id] = body;
    submission.lock = false;
    await dbDriver.putItem('submission', submission);
    msgDriver.sendSns(constructMessage(submission, 'save'));
  }
}

async function reviewMethod(body) {
  // Similar to submit, but for reviews. In case of rejecting a Submission
  // during review users can send a comment with reason for rejection.
  const [[submission]] = await dbDriver.getItems('submission', body.submission_id);
  if (body.approval) {
    const message = constructMessage(submission, 'review', true);
    await msgDriver.sendSns(message);
    return [true];
  }
}

async function resumeMethod(body) {
  // Method for external services to submit result of their actions
  // (e.g. a metadata editor) and return control to the Workflow Handler
  const [[submission]] = await dbDriver.getItems('submission', body.submission_id);
  const message = constructMessage(submission, 'resume', true);
  await msgDriver.sendSns(message);
  return [true];
}

async function lockMethod(body, user) {
  const [[submission]] = await dbDriver.getItems('submission', body.submission_id);
  submission.lock = user.id;
  const response = await dbDriver.putItem('submission', submission);
  constructMessage(submission, 'lock');
  return response;
}

async function unlockMethod(body) {
  const [[submission]] = await dbDriver.getItems('submission', body.submission_id);
  submission.lock = false;
  const response = await dbDriver.putItem('submission', submission);
  constructMessage(submission, 'unlock');
  return response;
}

const methodMap = {
  initialize: initializeMethod,
  metadata: metadataMethod,
  status: statusMethod,
  submit: submitMethod,
  save: saveMethod,
  review: reviewMethod,
  resume: resumeMethod,
  lock: lockMethod,
  unlock: unlockMethod
};

async function handler(event, context) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  console.info(`[USER]\n${JSON.stringify(context.identity)}`);

  // After integration of auth user will be pulled from context
  const user = {
    id: '54ce2972-39a7-49d4-af07-6b014a3bddfe',
    user_name: 'Brian Ellingson',
    email: 'brian.ellingson@uah.edu'
  };

  const body = JSON.parse(event.body);
  const method = event.pathParameters.operation;
  const operation = methodMap[method];
  const [data, err] = await operation(body, user);
  if (err) {
    console.error(`[ERROR] ${err}`);
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ data, err })
  };
}

exports.handler = handler;
