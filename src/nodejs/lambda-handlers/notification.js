/**
 * Lambda that exposes Notify API to AWS API Gateway. This lambda
 * is used for processing in an incoming external notify request and
 * generating an SNS message to invoke the NotificationHandler.
 * @module Notification
 * @see module:NotificationHandler
 */

const MessageUtil = require('message-util');
const DatabaseUtil = require('database-util');
const KayakoUtil = require('kayako-util');

async function sendMethod(params) {
  const message = {
    event_type: 'direct_message',
    data: {
      subject: params.subject,
      text: params.text,
      user_list: params.user_list
    },
    user_id: params.context.user_id
  };

  await MessageUtil.sendEvent(message);
  return { message: 'Successfully sent.' }
}

async function replyMethod(params) {
  const message = {
    event_type: 'direct_message',
    data: {
      conversation_id: params.id,
      text: params.text
    },
    user_id: params.context.user_id
  };

  await MessageUtil.sendEvent(message);
  return { message: 'Successfully sent.' }
}

async function syncTicketsFromKayakoToEDPub() {
  // This function only syncs the edpub tickets from kayako to edpub not all tickets in Kayako
  // Consideration should be made as to whether this should be limited to only sync current user's
  // tickets instead of all
  const ticketList = await KayakoUtil.getAllEDPubTickets();
  for (const ticketValue in Object.values(ticketList.tickets.ticket)) {
    const ticketInDB = await DatabaseUtil.execute({resource: 'note', operation: 'getConversationByTicketId'},
        {ticket_id: ticketValue.displayId});
    if ('error' in ticketInDB) {
      const userId = await DatabaseUtil.execute({resource: 'user', operations: 'getEDPUserIdByKayakoId'},
          { kayako_id: ticketValue.userid});
      const syncParams = {
        subject: ticketValue.subject,
        user_list: [],
        user_id: userId
      };
      const newConversation = await DatabaseUtil.execute({ resource: 'note', operation : 'syncConversation'}, syncParams);
      await DatabaseUtil.execute({resource: 'note', operation: 'linkTicketId'}, { note_id: newConversation.id,
        post_id: ticketValue.displayid});
    }
  }
}

async function conversationsMethod(params) {
  await syncTicketsFromKayakoToEDPub();
  return await DatabaseUtil.execute({ resource: 'note', operation: 'getConversationList' },
      { user_id: params.context.user_id });
}

async function syncTicketPostsFromKayakoToEDPub(params) {
  // This function only syncs the current ticket's posts from kayako to edpub not all ticket posts in Kayako
  const ticketId = await DatabaseUtil.execute({resource: 'note', operation: 'getTicketIdByConversationId'},
      {id: params.conversation_id});
  const postList = await KayakoUtil.getAllPostsForTicket(ticketId);
  for (const postValue in Object.values(postList['posts']['post'])) {
    // have to use bracket notation vs dot notation for postList or .post references external module
    const postInDB = await DatabaseUtil.execute({resource: 'note', operation: 'getNoteByPostId'}, {
      post_id: postValue.id});
    if ("error" in postInDB) {
      const userId = await DatabaseUtil.execute({resource: 'user', operations: 'getEDPUserIdByKayakoId'},
          { kayako_id: postInDB.userid});
      const syncParams = {
        conversation_id: params.conversation_id,
        user_id: userId,
        text: postInDB.contents
      };
      const newNote = await DatabaseUtil.execute({ resource: 'note', operation : 'reply'}, syncParams);
      await DatabaseUtil.execute({resource: 'note', operation: 'linkPostId'}, { note_id: newNote.id,
        post_id: postInDB.id});
    }
  }
}

async function conversationMethod(params) {
  await syncTicketPostsFromKayakoToEDPub(params);
  return await DatabaseUtil.execute({ resource: 'note', operation: 'readConversation' },
      { user_id: params.context.user_id, conversation_id: params.conversation_id });
}

const operations = {
  send: sendMethod,
  reply: replyMethod,
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
