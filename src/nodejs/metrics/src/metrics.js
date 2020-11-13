/**
 * Lambda to post metrics from client such as errors
 * @module Data
 */

const MessageDriver = require('message-driver');

async function handler(event) {
  const user = await PgAdapter.execute(
    { resource: 'user', operation: 'findById' },
    { user: { id: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' } }
  );
  // After integration of auth, user will be pulled from context

  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  console.info(`[USER]\n${JSON.stringify(user)}`);

  const eventMessage = {
    event_type: 'client_event',
    user_id: user.id,
    data: event
  };
  MessageDriver.sendEvent(eventMessage);
  return { message: 'Client data posted'};
}

module.exports.handler = handler;
