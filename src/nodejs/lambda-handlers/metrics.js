/**
 * Lambda to post metrics from client such as errors
 * @module Data
 */

const DatabaseUtil = require('database-util');

const MessageUtil = require('message-util');

async function search({ filter, context }) {
  if (filter.count) {
    const response = await DatabaseUtil.execute({ resource: 'metrics', operation: 'metricsStats' }, {});
    return response;
  } else {

  }
}

async function put({ payload, context }) {
  const eventMessage = {
    event_type: 'client_event',
    user_id: context.user_id,
    ...(payload.action_id && { action_id: payload.action_id }),
    ...(payload.conversation_id && { conversation_id: payload.conversation_id }),
    ...(payload.daac_id && { daac_id: payload.daac_id }),
    ...(payload.form_id && { form_id: payload.form_id }),
    ...(payload.group_id && { group_id: payload.group_id }),
    ...(payload.question_id && { question_id: payload.question_id }),
    ...(payload.role_id && { role_id: payload.role_id }),
    ...(payload.service_id && { service_id: payload.service_id }),
    ...(payload.submission_id && { submission_id: payload.submission_id }),
    ...(payload.workflow_id && { workflow_id: payload.workflow_id }),
    ...(payload.data && { data: payload.data })
  };
  await MessageUtil.sendEvent(eventMessage);
  return { message: 'Success!'};
}

const operations = {
  search,
  put
}

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const { operation } = event;
  const data = await operations[operation](event);
  return data;
}

module.exports.handler = handler;
