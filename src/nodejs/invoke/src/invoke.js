/**
 * Lambda that exposes Invoke API to AWS API Gateway. This lambda
 * is used for processing in an incoming external action request and
 * generating an SQS message to invoke the ActionHandler.
 * @module Invoke
 * @see module:ActionHandler
 */

const MessageDriver = require('message-driver');

const PgAdapter = require('database-driver');

async function handler(event) {
  const user = await PgAdapter.execute(
    { resource: 'user', operation: 'findById' },
    { user: { id: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' } }
  );
  // After integration of auth, user will be pulled from context

  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  console.info(`[USER]\n${JSON.stringify(user)}`);

  const eventMessage = {
    event_type: 'action_request',
    action_id: event.payload.action_id,
    submission_id: event.payload.submission_id,
    data: event.payload.data
  };

  await MessageDriver.sendEvent(eventMessage);

  return { message: 'Action requested' };
}

exports.handler = handler;
