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
async function sendEmailNotification({ note, email_payload }) {
  // TODO - Add additional filter for system user messages
  // logic to add DAAC content
  // eslint-disable-next-line
  const users = await db.note.getEmails({
    conversationId: note.conversation_id,
    senderId: note.sender_edpuser_id
  });

  // Disabled until ready for uat Testing
  // await msg.sendEmail(users, email_payload);
}

async function processRecord(record) {
  const { eventMessage } = msg.parseRecord(record);
  if (!(eventMessage.data && eventMessage.data.silent)) {
    const message = await getTemplate(eventMessage);
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
      if (eventMessage.event_type !== 'direct_message' && process.env.AWS_EXECUTION_ENV) {
        const emailPayload = await getEmailTemplate(eventMessage, message);
        await sendEmailNotification({ note, email_payload: emailPayload });
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
