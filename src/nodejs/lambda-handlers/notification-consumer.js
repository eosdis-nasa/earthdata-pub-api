/**
 * Lambda that serves as the core component of the Notification System. This lambda
 * processes incoming SNS messages that are marked as a notification and creates
 * a Note entry and sends an email notification for each recipient based on
 * implicit recipients and subscribers.
 * @module NotificationHandler
 */

const db = require('database-util');

const msg = require('message-util');

const { getTemplate, getEmailTemplate } = require('./notification-consumer/templates.js');

// eslint-disable-next-line
async function sendEmailNotification({ note, emailPayload }) {
  console.log('sendEmailNotification', note, emailPayload)
  // TODO - Add additional filter for system user messages
  // logic to add DAAC content
  // eslint-disable-next-line
  const users = await db.note.getEmails({
    conversationId: note.conversation_id,
    senderId: note.sender_edpuser_id
  });
  console.log('users in sendEmailNotification', users)
  // Disabled until ready for uat Testing
  await msg.sendEmail(users, emailPayload);
}

async function processRecord(record) {
  const { eventMessage } = msg.parseRecord(record);
  console.log('processRecord', record, eventMessage)
  if (!(eventMessage.data && eventMessage.data.silent)) {
    const message = await getTemplate(eventMessage);
    console.log('processRecord message from getTemplate', message)
    if (message) {
      const operation = message.conversation_id ? 'reply' : 'sendNote';
      console.log('processRecord operation', operation)
      if (!message.user_id) {
        const systemUser = await db.user.findSystemUser();
        message.user_id = systemUser.id;
        console.log('processRecord if no user id', message)
      }
      if (operation === 'sendNote' && !message.subject) {
        message.subject = 'No Subject';
      }
      const note = await db.note[operation](message);
      console.log('processRecord note', note)
      // if (eventMessage.event_type !== 'direct_message' && process.env.AWS_EXECUTION_ENV) {
      if (eventMessage.event_type !== 'direct_message') {
        const emailPayload = await getEmailTemplate(eventMessage, message);
        console.log('processRecord emailPayload and process.env', emailPayload, process.env)
        await sendEmailNotification({ note, emailPayload });
      }
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
