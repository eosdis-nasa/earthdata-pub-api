/**
 * Lambda that serves as the core component of the Action System. This lambda
 * processes incoming SQS messages, executes the requested action, and sends
 * an SNS message to notify of successful completion.
 * @module ActionHandler
 * @see module:Actions
 */

const AWS = require('aws-sdk');

const Schema = require('schema-util');

const MessageUtil = require('message-util');

const DatabaseUtil = require('database-util');

const fs = require('fs');

function fetchAction(key, local) {
  return new Promise((resolve) => {
    const params = {
      Bucket: process.env.ACTIONS_BUCKET,
      Key: key
    };
    const file = fs.createWriteStream(local);
    const s3 = new AWS.S3();
    const stream = s3.getObject(params).createReadStream();
    stream.on('end', resolve);
    stream.pipe(file);
  });
}

async function processRecord(record) {
  const { eventMessage } = MessageUtil.parseRecord(record);
  const { action_id: actionId, submission_id: submissionId, data } = eventMessage;
  const action = await DatabaseUtil.execute({ resource: 'action', operation: 'findById' },
    { id: actionId });
  const submission = await DatabaseUtil.execute({ resource: 'submission', operation: 'findById' },
    { id: submissionId });
  const local = `/tmp/${Schema.generateId()}`;
  // fs.writeFileSync(local, action.source);
  // eslint-disable-next-line
  await fetchAction(new Buffer.from(action.source).toString(), local);
  // eslint-disable-next-line
  const { execute } = require(local);
  const output = await execute({
    submission, data, AWS, DatabaseUtil, MessageUtil, Schema
  });
  Object.assign(action, { output });
  await DatabaseUtil.execute({ resource: 'submission', operation: 'updateActionData' },
    { submission, action });
  const status = await DatabaseUtil.execute({ resource: 'submission', operation: 'getStatus' },
    { submission });
  const newEventMessage = {
    event_type: 'workflow_promote_step',
    submission_id: status.id,
    workflow_id: status.workflow_id,
    step_name: status.step_name
  };
  await MessageUtil.sendEvent(newEventMessage);
  fs.unlinkSync(local);
  return output;
}

async function handler(event) {
  // eslint-disable-next-line
  console.log(event);
  const promises = event.Records.map((record) => processRecord(record));
  await Promise.all(promises);
  return {
    statusCode: 200
  };
}

exports.handler = handler;
