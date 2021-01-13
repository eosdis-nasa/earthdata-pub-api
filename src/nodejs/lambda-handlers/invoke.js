/**
 * Lambda that exposes Invoke API to AWS API Gateway. This lambda
 * is used for processing in an incoming external action request and
 * generating an SQS message to invoke the ActionHandler.
 * @module Invoke
 * @see module:ActionHandler
 */

const MessageUtil = require('message-util');

const DatabaseUtil = require('database-util');

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);

  const eventMessage = {
    event_type: 'action_request',
    action_id: event.payload.action_id,
    submission_id: event.payload.submission_id,
    data: event.payload.data,
    user_id: event.context.user_id
  };

  await MessageUtil.sendEvent(eventMessage);

  return { message: 'Action requested' };
}

exports.handler = handler;
