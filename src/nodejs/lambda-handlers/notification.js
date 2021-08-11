/**
 * Lambda that exposes Notify API to AWS API Gateway. This lambda
 * is used for processing in an incoming external notify request and
 * generating an SNS message to invoke the NotificationHandler.
 * @module Notification
 * @see module:NotificationHandler
 */

const MessageUtil = require('message-util');
const DatabaseUtil = require('database-util');

async function sendMethod(params) {
  const message = {
    event_type: 'direct_message',
    data: {
      subject: params.subject && params.subject !== ''
        ? params.subject : 'No Subject',
      text: params.text,
      user_list: params.user_list
    },
    user_id: params.context.user_id
  };

  await MessageUtil.sendEvent(message);
  return { message: 'Successfully sent.' };
}

async function replyMethod(params) {
  const message = {
    event_type: 'direct_message',
    data: {
      conversation_id: params.conversation_id,
      text: params.text
    },
    user_id: params.context.user_id
  };

  await MessageUtil.sendEvent(message);
  return { message: 'Successfully sent.' };
}

async function addUsersMethod(params) {
  const response = await DatabaseUtil.execute({ resource: 'note', operation: 'addUsersToConversation' },
    { conversation_id: params.conversation_id, user_list: params.user_list });
  return response;
}

async function conversationsMethod(params) {
  const note = await DatabaseUtil.execute({ resource: 'note', operation: 'getConversationList' },
    { user_id: params.context.user_id });
  return note;
}

async function conversationMethod(params) {
  const conversation = await DatabaseUtil.execute({ resource: 'note', operation: 'readConversation' },
    { user_id: params.context.user_id, conversation_id: params.conversation_id });
  return conversation;
}

const operations = {
  send: sendMethod,
  reply: replyMethod,
  add_users: addUsersMethod,
  conversations: conversationsMethod,
  conversation: conversationMethod
};

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);

  const operation = operations[event.operation];
  const data = await operation(event);
  return data;
}

exports.handler = handler;
