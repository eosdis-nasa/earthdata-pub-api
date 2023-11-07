/**
 * Lambda that processes inbound messages from external integrated services.
 * @module InboundConsumer
 */

const db = require('database-util');

const msg = require('message-util');

async function databaseOperation({ resource, operation, params }) {
  await db[resource][operation](params);
}

async function processRecord(record) {
  const { eventMessage } = msg.parseRecord(record);
  await databaseOperation(eventMessage);
}

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const records = event.Records;
  const promises = records.map((record) => processRecord(record));
  await Promise.all(promises);
  return {
    statusCode: 200
  };
}

exports.handler = handler;
