/**
 * Lambda that serves as the core component of the Notification System. This lambda
 * processes incoming SNS messages that are marked as a notification and creates
 * a Note entry and sends an email notification for each recipient based on
 * implicit recipients and subscribers.
 * @module NotificationHandler
 */

const DatabaseUtil = require('database-util');

const MessageUtil = require('message-util');

async function direct(eventMessage) {
  const { user_id: senderId, data } = eventMessage;
  const params = {
    note: data,
    user: {
      id : senderId
    }
  }
  const operation = data.conversation_id ? 'reply' : 'sendNote';
  await DatabaseUtil.execute({ resource: 'note', operation }, params);
}


async function processRecord(record) {
  const { eventMessage } = MessageUtil.parseRecord(record);
  if (eventMessage.event_type === 'direct_message') {
    await direct(eventMessage);
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
