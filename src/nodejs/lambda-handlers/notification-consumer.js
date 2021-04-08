/**
 * Lambda that serves as the core component of the Notification System. This lambda
 * processes incoming SNS messages that are marked as a notification and creates
 * a Note entry and sends an email notification for each recipient based on
 * implicit recipients and subscribers.
 * @module NotificationHandler
 */

const DatabaseUtil = require('database-util');

const MessageUtil = require('message-util');

const KayakoUtil = require('kayako-util');

const syncFlag = process.env.KAYAKO_SYNC_FLAG ? process.env.KAYAKO_SYNC_FLAG : false;

const textTemplates = {
  submission_initialized: ({ submission_id }) => `A new request has been initialized with ID ${submission_id}.`
};

const subjectTemplates = {
  submission_initialized: ({ submission_id }) => `Submission ID ${submission_id}`
};

async function syncToKayako(params) {
  const userInfo = await DatabaseUtil.execute({ resource: 'user', operation: 'findById' }, { user: { id: params.user_id } });
  const kayakoUserId = await DatabaseUtil.execute({ resource: 'user', operation: 'getKayakoIdByEDPUserId' },
      { id: params.user_id });
  if (params.conversation_id) {
    const ticketId = await DatabaseUtil.execute({ resource: 'note', operation: 'getTicketIdByConversationId' },
        { id: params.conversation_id });
    await KayakoUtil.createPost({
      ticketid: ticketId,
      contents: params.text,
      userid: kayakoUserId
    });
  } else {
    await KayakoUtil.createTicket({
      subject: params.subject,
      fullname: userInfo.name,
      email: userInfo.email,
      contents: params.text,
      departmentid: '52',
      ticketstatusid: '1',
      ticketpriorityid: '1',
      tickettypeid: '1',
      userid: kayakoUserId
    });
  }
}

async function directMessage(eventMessage) {
  const { user_id: senderId, data } = eventMessage;
  const params = {
    user_id: senderId,
    ...data
  }
  const operation = data.conversation_id ? 'reply' : 'sendNote';
  await DatabaseUtil.execute({ resource: 'note', operation }, params);
  if (syncFlag) {
    await syncToKayako(params);
  }
}

async function submissionInitialized(eventMessage) {
  const params = {
    user_id: eventMessage.user_id,
    subject: subjectTemplates.submission_initialized(eventMessage),
    text: textTemplates.submission_initialized(eventMessage),
    user_list: []
  };
  const newNote = await DatabaseUtil.execute({ resource: 'note', operation: 'sendNote' }, params);
  if (syncFlag) {
    await syncToKayako(params);
  }

  const test = await DatabaseUtil.execute({ resource: 'submission', operation: 'updateConversation' },
      {
        id: eventMessage.submission_id,
        conversation_id: newNote.conversation_id
      }
  );
  console.log(test);
}

const operations = {
  direct_message: directMessage,
  submission_initialized: submissionInitialized,
}

async function processRecord(record) {
  const { eventMessage } = MessageUtil.parseRecord(record);
  if (operations[eventMessage.event_type]) {
    await operations[eventMessage.event_type](eventMessage);
  }
}

async function handler(event) {
  const records = event.Records;
  const promises = records.map((record) => processRecord(record));
  await Promise.all(promises);
  return {
    statusCode: 200
  };
}

exports.handler = handler;
