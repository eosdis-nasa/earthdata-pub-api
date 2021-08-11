/**
 * Lambda that serves as the core component of the Notification System. This lambda
 * processes incoming SNS messages that are marked as a notification and creates
 * a Note entry and sends an email notification for each recipient based on
 * implicit recipients and subscribers.
 * @module NotificationHandler
 */

const DatabaseUtil = require('database-util');

const MessageUtil = require('message-util');

const { getTemplate } = require('./notification-consumer/templates.js');

async function processRecord(record) {
  const { eventMessage } = MessageUtil.parseRecord(record);
  const message = getTemplate(eventMessage);
  if (message) {
    const operation = message.conversation_id ? 'reply' : 'sendNote';
    if (!message.user_id) {
      const systemUser = await DatabaseUtil.execute({ resource: 'user', operation: 'findSystemUser' }, {});
      message.user_id = systemUser.id;
    }
    if (operation === 'sendNote' && !message.subject) {
      message.subject = 'No Subject';
    }
    await DatabaseUtil.execute({ resource: 'note', operation }, message);
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
