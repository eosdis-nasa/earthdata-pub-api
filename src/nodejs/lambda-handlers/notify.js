/**
 * Lambda that exposes Notify API to AWS API Gateway. This lambda
 * is used for processing in an incoming external notify request and
 * generating an SNS message to invoke the NotificationHandler.
 * @module Notify
 * @see module:NotificationHandler
 */

const MessageUtil = require('message-util');

async function handler(event) {
  const { context, note } = event;
  const { user_id: senderId } = context;

  const message = {
    event_type: 'direct_message',
    user_id: senderId,
    data: note
  };
  await MessageUtil.sendEvent(message);
  return { message: 'Success!' }
}

exports.handler = handler;
