/**
 * Lambda that serves as the core component of the Action System. This lambda
 * processes incoming SQS messages, executes the requested action, and sends
 * an SNS message to notify of successful completion.
 * @module ActionHandler
 * @see module:Actions
 */

const fs = require('fs');
const { Readable } = require('node:stream');

const Schema = require('schema-util');
const MessageUtil = require('message-util');
const DatabaseUtil = require('database-util');

const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');

async function fetchAction(key, local) {
  const s3 = new S3Client();
  try {
    const data = await s3.send(
      new GetObjectCommand({
        Bucket: process.env.ACTIONS_BUCKET,
        Key: key
      })
    );

    return new Promise((resolve, reject) => {
      const body = data.Body;
      if (body instanceof Readable) {
        const writeStream = fs.createWriteStream(local);
        body
          .pipe(writeStream)
          .on('error', (err) => reject(err))
          .on('close', () => resolve(null));
      } else {
        reject(new Error('Body is not a readable stream'));
      }
    });
  } catch (err) {
    console.error(`Error fetching action ${key}:`, err);
    return { error: 'Error fetching action' };
  }
}

async function processRecord(record) {
  const { eventMessage } = MessageUtil.parseRecord(record);
  const { action_id: actionId, submission_id: submissionId, data } = eventMessage;
  const action = await DatabaseUtil.execute({ resource: 'action', operation: 'findById' },
    { id: actionId });
  const submission = await DatabaseUtil.execute({ resource: 'submission', operation: 'findById' },
    { id: submissionId, user_id: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' });
  const local = `/tmp/${Schema.generateId()}`;
  // fs.writeFileSync(local, action.source);
  // eslint-disable-next-line
  await fetchAction(new Buffer.from(action.source).toString(), local);
  // eslint-disable-next-line
  const { execute } = require(local);
  const output = await execute({
    submission, data, DatabaseUtil, MessageUtil, Schema
  });
  Object.assign(action, { output });
  await DatabaseUtil.execute({ resource: 'submission', operation: 'updateActionData' },
    { id: submissionId, action_id: actionId, data: action });
  const status = await DatabaseUtil.execute({ resource: 'submission', operation: 'findById' },
    { id: submissionId, user_id: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' });
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
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const promises = event.Records.map((record) => processRecord(record));
  await Promise.all(promises);
  return {
    statusCode: 200
  };
}

exports.handler = handler;
