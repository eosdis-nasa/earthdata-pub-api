/**
 * Lambda that serves as the core component of the Workflow System. This lambda
 * processes incoming SNS messages, progresses the specified Submission to the
 * next step in its Workflow, and sends an SNS notification, and if needed an
 * SQS message to invoke an Action.
 * an SNS message to notify of successful completion.
 * @module WorkflowHandler
 * @see module:ActionHandler
 */

const { DynamoDB, SNS, SQS } = require('aws-sdk');

const { DynamodbDriver } = require('database-driver');

const { MessageDriver } = require('message-driver');

const HttpHelper = require('./http-helper.js');

const ClientConfig = require('./client-config.js');

const dbDriver = new DynamodbDriver(
  new DynamoDB(ClientConfig.dynamodb),
  DynamoDB.Converter.marshall,
  DynamoDB.Converter.unmarshall,
  process.env.TABLE_SUFFIX
);

const msgDriver = new MessageDriver({
  snsClient: new SNS(ClientConfig.sns),
  topicArn: process.env.SNS_TOPIC,
  sqsClient: new SQS(ClientConfig.sqs),
  queueUrl: process.env.SQS_QUEUE
});

function constructSnsMessage(submission) {
  const { id, step, workflow } = submission;
  const snsMessage = {
    body: {
      subject: `Submission ID ${id}`,
      text: `Submission ID ${id} has progressed to the next stage of processing.`
    },
    attributes: {
      notification: 'true',
      submission_id: id,
      invoked_by: workflow.id,
      invoke_type: 'workflow'
    }
  };
  if (step === 'done') {
    snsMessage.body.text += ' The submission has finished being processed by the workflow.';
  } else {
    const state = workflow.steps[step].type;
    if (state === 'form') {
      snsMessage.body.text += ' The next step is filling a form.';
    } else if (state === 'review') {
      snsMessage.body.text += ' The next step is a review.';
    } else if (state === 'service') {
      snsMessage.body.text += ' The next step is using an external service.';
    }
  }
  return snsMessage;
}

function constructSqsMessage(submission) {
  const { id, step, workflow } = submission;
  // eslint-disable-next-line
  const body = (({ action_id, input, ...toss }) => ({ action_id, input }))(workflow[step]);
  const sqsMessage = {
    body,
    attributes: {
      invoked_by: workflow.id,
      invoke_type: 'workflow',
      submission_id: id,
      workflow_id: workflow.id
    }
  };
  return sqsMessage;
}

async function callService(submission, metadata, secret) {
  const { workflow, step } = submission;
  const serviceStep = workflow[step];
  const [[service]] = await dbDriver.getItems('service', serviceStep.service_id);
  if (service.payload) {
    service.payload = { submission, metadata, secret };
  }
  await HttpHelper.send(service);
}

async function processRecord(record) {
  const { attributes } = msgDriver.parseRecord(record);
  const [[submission]] = await dbDriver.getItems('submission', attributes.submission_id);
  const [[metadata]] = await dbDriver.getItems('metadata', attribute.submission_id);
  const { workflow, completed } = submission;
  const steps = workflow.steps;
  const current = submission.step;
  const next = current === 'init' ? workflow.entry : steps[current].next_step || 'done';
  submission.step = next;
  completed[current] = true;
  submission.lock = false;
  await dbDriver.putItem('submission', submission);
  const snsMessage = constructSnsMessage(submission);
  await msgDriver.sendSns(snsMessage);
  if (next !== 'done') {
    const step = workflow[next];
    if (step.type === 'action') {
      const sqsMessage = constructSqsMessage(submission);
      await msgDriver.sendSqs(sqsMessage);
    } else if (step.type === 'service') {
      const secret = Schema.generateId();
      await dbDriver.putItem('secret', { id: submission.id, secret });
      await callService(submission, metadata, secret);
    }
  }
}

async function handler(event) {
  const records = event.Records;
  const promises = records.map((record) => processRecord(record));
  await Promise.all(promises);
  return {
    statusCode: 200
  };
}

exports.handler = handler;
