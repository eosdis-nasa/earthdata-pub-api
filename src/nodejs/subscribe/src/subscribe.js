/**
 * Lambda that exposes Subscription API to AWS API Gateway. This lambda
 * is creates or removes entries in the Subscription table to allow a user
 * to receive notifications for activity involving a given source.
 * @module Subscription
 * @see module:NotificationHandler
 */

const PgAdapter = require('database-driver');

const MessageDriver = require('message-driver');

async function subsribe(body, userId) {
  console.info('Not Implemented', body, userId);
}

async function unsubsribe(body, userId) {
  console.info('Not Implemented', body, userId);
}

const operations = {
  subscribe,
  unsubscribe
};

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);

  const operation = operations[event.operation];
  const data = await operation(event, event.context.user_id);
  return data;
}

exports.handler = handler;
