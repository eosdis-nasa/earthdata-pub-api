/**
 * Lambda that exposes Subscription API to AWS API Gateway. This lambda
 * is creates or removes entries in the Subscription table to allow a user
 * to receive notifications for activity involving a given source.
 * @module Subscription
 * @see module:NotificationHandler
 */

const db = require('database-util');

// const MessageUtil = require('message-util');

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);

  const params = {
    user_id: event.user_id || event.context.user_id,
    ...(event.group_id && { group_id: event.group_id }),
    ...(event.action_id && { action_id: event.action_id, type: 'action' }),
    ...(event.daac_id && { daac_id: event.daac_id, type: 'daac' }),
    ...(event.form_id && { form_id: event.form_id, type: 'form' }),
    ...(event.service_id && { service_id: event.service_id, type: 'service' }),
    ...(event.submission_id && { submission_id: event.submission_id, type: 'submission' }),
    ...(event.workflow_id && { workflow_id: event.workflow_id, type: 'workflow' })
  };
  const response = await db.subscription[event.operation](params);
  return response;
}

exports.handler = handler;
