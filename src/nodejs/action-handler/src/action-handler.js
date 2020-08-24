/**
 * Lambda that serves as the core component of the Action System. This lambda
 * processes incoming SQS messages, executes the requested action, and sends
 * an SNS message to notify of successful completion.
 * @module ActionHandler
 * @see module:Actions
 */

const AWS = require('aws-sdk');

const Schema = require('schema-util');

const { DynamodbDriver } = require('database-driver');

const { MessageDriver } = require('message-driver');

const fs = require('fs');

const ClientConfig = require('./client-config.js');

const s3 = new AWS.S3(ClientConfig.s3);

const dbDriver = new DynamodbDriver(
  new AWS.DynamoDB(ClientConfig.dynamodb),
  AWS.DynamoDB.Converter.marshall,
  AWS.DynamoDB.Converter.unmarshall,
  process.env.TABLE_SUFFIX
);

const msgDriver = new MessageDriver({
  snsClient: new AWS.SNS(ClientConfig.sns),
  topicArn: process.env.SNS_TOPIC
});

const BUCKET = process.env.ACTION_BUCKET;

function constructMessage({ body, attributes }) {
  return {
    body: {
      subject: `Submission ID ${body.input.submission_id}`,
      text: `Action ID ${body.action_id} has completed processing.`
    },
    attributes: {
      action_id: body.action_id,
      submission_id: body.input.submission_id,
      ...(attributes.invoke_type === 'workflow'
        ? { next_step: 'true' } : {})
    }
  };
}

function fetchAction(key, local) {
  return new Promise((resolve) => {
    const params = { Bucket: BUCKET, Key: key };
    const file = fs.createWriteStream(local);
    const stream = s3.getObject(params).createReadStream();
    stream.on('end', resolve);
    stream.pipe(file);
  });
}

async function processRecord(record) {
  const { body, attributes } = msgDriver.parseRecord(record);
  const { action_id: actionId, submission_id: submissionId } = body;
  const [[actionItem]] = await dbDriver.getItems('action', actionId);
  const [[submissionItem]] = await dbDriver.getItems('submission', submissionId);
  const local = `tmp/${Schema.generateId()}`;
  await fetchAction(actionItem.file_key, local);
  // eslint-disable-next-line
  const action = require(local);
  const output = await action.execute(submissionItem, body.input);
  const message = constructMessage({ body, attributes });
  await dbDriver.putItem('submission', submissionItem);
  await msgDriver.sendSqs(message);
  return output;
}

async function handler(event) {
  const promises = event.Records.map((record) => processRecord(record));
  await Promise.all(promises);
  return {
    statusCode: 200
  };
}

exports.handler = handler;
