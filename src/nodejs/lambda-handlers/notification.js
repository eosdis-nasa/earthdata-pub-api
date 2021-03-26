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

async function syncTicketsFromKayakoToEDPub(params) {
  //This function only syncs the edpub tickets from kayako to edpub not all tickets in Kayako
  const ticketList = await KayakoUtil.getAllEDPubTickets();

  for (const ticket in ticketList['tickets']['ticket']) {
    const ticketInDB = await DatabaseUtil.execute({resource: 'note', operation: 'getConversationByTicketId'},
        {ticket_id: ticketList['tickets']['ticket'][ticket].displayid})
    if (!ticketInDB) {
      const sync_params = {
        subject: ticketList['tickets']['ticket'][ticket].subject,
        user_list: [],
        //TODO- The below parameter needs to run a call to DatabaseUtil.execute to get the db edpuser id provided the kayako user id (ticketList['tickets']['ticket'][ticket].userid)
        user_id: params.context.user_id,
      }
      const newConversation = await DatabaseUtil.execute({ resource: 'note', operation : 'sendNote'}, sync_params);
      //TODO- Need to add link from newly created conversation to kayako ticket with something like the below. Or is this automatic? Check w/ Brian
      // await DatabaseUtil.execute({resource: 'note', operation: 'linkTicketId'}, { note_id: newConversation.id,
      //   post_id: ticketList['tickets']['ticket'][ticket].displayid});
    }
  }
}

async function conversationsMethod(params) {
  await syncTicketsFromKayakoToEDPub(params)
  return await DatabaseUtil.execute({ resource: 'note', operation: 'getConversationList' },
      { user_id: params.context.user_id });
}

async function syncTicketPostsFromKayakoToEDPub(params) {
  //This function only syncs the current ticket's posts from kayako to edpub not all ticket posts in Kayako
  const ticket = await DatabaseUtil.execute({resource: 'note', operation: 'getTicketIdByConversationId'},
      {id: params.conversation_id});
  const postList = await KayakoUtil.getAllPostsForTicket(ticket.ticket_id);
  for (const post in postList['posts']['post']) {
    const postInDB = await DatabaseUtil.execute({resource: 'note', operation: 'getNoteByPostId'}, {
      post_id: postList['posts']['post'][post].id});
    if (!postInDB) {
      const sync_params = {
        conversation_id: params.conversation_id,
        //TODO- The below parameter needs to run a call to DatabaseUtil.execute to get the db edpuser id provided the kayako user id (postList['posts']['post'][post].userid ? userid : staffid)
        user_id: params.context.user_id,
        text: postList['posts']['post'][post].contents
      }
      const newNote = await DatabaseUtil.execute({ resource: 'note', operation : 'reply'}, sync_params);
      //TODO- Need to add link from newly created note to kayako post with something like the below
      // await DatabaseUtil.execute({resource: 'note', operation: 'linkPostId'}, { note_id: newNote.id,
      //   post_id: postList['posts']['post'][post].id});
    }
  }
}

async function conversationMethod(params) {
  await syncTicketPostsFromKayakoToEDPub(params)
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
