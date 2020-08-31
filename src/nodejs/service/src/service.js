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

const Crypto = require('crypto');

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

async function resumeMethod(body, submission) {
  // Method for external services to submit result of their actions
  // (e.g. a metadata editor) and return control to the Workflow Handler
  const message = constructMessage(submission, 'resume', true);
  msgDriver.sendSns(message);
  return [true];
}

const methodMap = {
  metadata: metadataMethod,
  resume: resumeMethod
};

async function handler(event, context) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);

  const body = JSON.parse(event.body);
  const [[submission]] = await dbDriver.getItems('submission', body.submission_id);
  const workflow = submission.workflow;
  const steps = workflow.steps;
  const current = submission.step;
  const state = steps[current];
  if (state.type === 'service') {
    const [[submissionSecret]] = await dbDriver.getItems('secret', body.submission_id);
    const [[serviceSecret]] = await dbDriver.getItems('secret', state.service_id);
    const hash = Crypto.createHash('512');
    hash.update(`${submissionSecret}${serviceSecret}`, 'utf-8');
    const token = hash.digest('hex');
    if (token === body.token) {
      const method = event.pathParameters.operation;
      const operation = methodMap[method];
      const [data, err] = await operation(body, submission);
      if (err) {
        console.error(`[ERROR] ${err}`);
      }
    }
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ data, err })
  };
}

exports.handler = handler;
