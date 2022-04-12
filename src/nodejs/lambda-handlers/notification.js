/**
 * Lambda that exposes Notify API to AWS API Gateway. This lambda
 * is used for processing in an incoming external notify request and
 * generating an SNS message to invoke the NotificationHandler.
 * @module Notification
 * @see module:NotificationHandler
 */

const msg = require('message-util');
const db = require('database-util');

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

  await msg.sendEvent(message);
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

  await msg.sendEvent(message);
  return { message: 'Successfully sent.' };
}

async function addUserMethod(params) {
  const response = await db.note.addUserToConversation(params);
  return response;
}

async function conversationsMethod(params) {
  const userInfo = await db.user.findById({ id: params.context.user_id });
  if (userInfo.user_privileges.includes('REQUEST_ADMINREAD') || userInfo.user_privileges.includes('ADMIN')
  || userInfo.user_groups.some((group) => group.short_name === 'root_group')) {
    return db.note.getConversationList();
  }
  if (userInfo.user_privileges.includes('REQUEST_DAACREAD')) {
    return db.note.getConversationList({
      user_id: params.context.user_id,
      daac: true
    });
  }
  return db.note.getConversationList({
    user_id: params.context.user_id
  });
}

async function conversationMethod(params) {
  const userInfo = await db.user.findById({ id: params.context.user_id });
  if (userInfo.user_privileges.includes('REQUEST_ADMINREAD') || userInfo.user_privileges.includes('ADMIN')
  || userInfo.user_groups.some((group) => group.short_name === 'root_group')) {
    return db.note.readConversation({
      conversation_id: params.conversation_id
    });
  }
  if (userInfo.user_privileges.includes('REQUEST_DAACREAD')) {
    return db.note.readConversation({
      user_id: params.context.user_id,
      daac: true,
      conversation_id: params.conversation_id
    });
  }
  return db.note.readConversation({
    user_id: params.context.user_id,
    conversation_id: params.conversation_id
  });
}

const operations = {
  send: sendMethod,
  reply: replyMethod,
  add_user: addUserMethod,
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
