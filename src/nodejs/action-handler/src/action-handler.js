/**
 * Lambda that serves as the core component of the Action System. This lambda
 * processes incoming SQS messages, executes the requested action, and sends
 * an SNS message to notify of successful completion.
 * @module ActionHandler
 * @see module:Actions
 */

const AWS = require('aws-sdk');

const Schema = require('schema-util');

const MessageDriver = require('message-driver');

const PgAdapter = require('database-driver');

const fs = require('fs');

// function fetchAction(key, local) {
//   return new Promise((resolve) => {
//     const params = { Bucket: BUCKET, Key: key };
//     const file = fs.createWriteStream(local);
//     const stream = s3.getObject(params).createReadStream();
//     stream.on('end', resolve);
//     stream.pipe(file);
//   });
// }

async function processRecord(record) {
  const triggerMessage = MessageDriver.parseRecord(record);
  const { action_id: actionId, submission_id: submissionId, data } = triggerMessage;
  const action = await PgAdapter.execute({ resource: 'action', operation: 'findById' },
    { action: { id: actionId } });
  const submission = await PgAdapter.execute({ resource: 'submission', operation: 'findById' },
    { submission: { id: submissionId } });
  const local = `/tmp/${Schema.generateId()}`;
  fs.writeFileSync(local, action.source);
  //await fetchAction(action.file_key, local);
  // eslint-disable-next-line
  const { execute } = require(local);
  const output = await execute({ submission, data, AWS, PgAdapter, MessageDriver, Schema });
  Object.assign(action, { output });
  await PgAdapter.execute({ resource: 'submission', operation: 'updateActionData' },
    { submission, action });
  const status = await PgAdapter.execute({ resource: 'submission', operation: 'getStatus' },
    { submission });
  const eventMessage = {
    event_type: 'workflow_promote_step',
    submission_id: status.id,
    workflow_id: status.workflow_id,
    step_name: status.step_name
  };
  await MessageDriver.sendEvent(eventMessage);
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
