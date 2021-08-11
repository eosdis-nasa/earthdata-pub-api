/**
 * Lambda that processes inbound messages from external integrated services.
 * @module InboundConsumer
 */

const DatabaseUtil = require('database-util');

const MessageUtil = require('message-util');

async function databaseOperation({ resource, operation, params }) {
  await DatabaseUtil.execute({ resource, operation }, params);
}

async function processRecord(record) {
  const { eventMessage } = MessageUtil.parseRecord(record);
  console.info(eventMessage);
  await databaseOperation(eventMessage);
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
