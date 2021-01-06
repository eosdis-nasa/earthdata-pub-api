/**
 * Lambda to post metrics from client such as errors
 * @module Data
 */

const MessageDriver = require('message-driver');

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);

  const eventMessage = {
    event_type: 'client_event',
    user_id: event.context.user_id,
    data: event
  };
  MessageDriver.sendEvent(eventMessage);
  return { message: 'Client data posted'};
}

module.exports.handler = handler;
