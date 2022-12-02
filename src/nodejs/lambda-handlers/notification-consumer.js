/**
 * Lambda that serves as the core component of the Notification System. This lambda
 * processes incoming SNS messages that are marked as a notification and creates
 * a Note entry and sends an email notification for each recipient based on
 * implicit recipients and subscribers.
 * @module NotificationHandler
 */

const db = require('database-util');

const msg = require('message-util');

const { getTemplate } = require('./notification-consumer/templates.js');

async function sendEmailNotification({ note }) {
  // TODO - Add additional filter for system user messages
  const users = await db.note.getEmails({
    conversationId: note.conversation_id,
    senderId: note.sender_edpuser_id
  });
  const submission = await db.note.getSubmissionByConversationId({
    conversationId: note.conversation_id
  });
  await msg.sendEmail({
    submissionId: submission.id,
    submissionName: submission.form_data ? (submission.form_data.data_product_name || '') : '',
    emails: users.map((user) => user.email),
    body: note.text
  });
}

async function processRecord(record) {
  const { eventMessage } = msg.parseRecord(record);
  if (!(eventMessage.data && eventMessage.data.silent)) {
    const message = getTemplate(eventMessage);
    if (message) {
      const operation = message.conversation_id ? 'reply' : 'sendNote';
      if (!message.user_id) {
        const systemUser = await db.user.findSystemUser();
        message.user_id = systemUser.id;
      }
      if (operation === 'sendNote' && !message.subject) {
        message.subject = 'No Subject';
      }
      const note = await db.note[operation](message);
      // await sendEmailNotification({ note });
    }
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
