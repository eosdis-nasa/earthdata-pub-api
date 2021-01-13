/**
 * Lambda that exposes Subscription API to AWS API Gateway. This lambda
 * is creates or removes entries in the Subscription table to allow a user
 * to receive notifications for activity involving a given source.
 * @module Subscription
 * @see module:NotificationHandler
 */

const DatabaseUtil = require('database-util');

const MessageUtil = require('message-util');

async function subscribeMethod(body, userId) {
  console.info('Not Implemented', body, userId);
}

async function unsubscribeMethod(body, userId) {
  console.info('Not Implemented', body, userId);
}

const operations = {
  subscribe: subscribeMethod,
  unsubscribe: unsubscribeMethod
};

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);

  const operation = operations[event.operation];
  const data = await operation(event, event.context.user_id);
  return data;
}

exports.handler = handler;
