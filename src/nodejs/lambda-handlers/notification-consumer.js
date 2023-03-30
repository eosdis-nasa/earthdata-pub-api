/**
 * Lambda that serves as the core component of the Notification System. This lambda
 * processes incoming SNS messages that are marked as a notification and creates
 * a Note entry and sends an email notification for each recipient based on
 * implicit recipients and subscribers.
 * @module NotificationHandler
 */

const db = require('database-util');

const msg = require('message-util');
const { sendNote } = require('../lambda-layers/database-util/src/query/note.js');

const { getTemplate } = require('./notification-consumer/templates.js');

// TODO- Remove disable once send email enabled
// eslint-disable-next-line
async function sendEmailNotification({ note }) {
  // TODO - Add additional filter for system user messages
  // logic to add DAAC content
  const users = await db.note.getEmails({
    conversationId: note.conversation_id,
    senderId: note.sender_edpuser_id
  });
  const template = event_type === 'direct_message' ? 'direct_message' : 'default';
  const templatePayload = {
    body: note.text
  }
  await msg.sendEmail({
    // TODO - Update the subject
    subject: 'RE: EDPub reply',
    emails: users.map((user) => user.email),
    templatePayload,
    template: template
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
      // TODO- Remove disable once send email enabled
      // eslint-disable-next-line
      const note = await db.note[operation](message);
      // await sendEmailNotification({ note, event_type: eventMessage.event_type });
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
