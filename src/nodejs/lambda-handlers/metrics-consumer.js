/**
 * Lambda that serves as the core component of the Metrics Reporting System.
 * This lambda processes SNS messages published from edpub_topic, parses the
 * incoming message for basic information of the event, then publishes a message
 * to the edpub_metric_topic
 * @module MetricsHandler
 */

const DatabaseUtil = require('database-util');

const MessageUtil = require('message-util');

async function processRecord(record) {
  const { eventMessage } = MessageUtil.parseRecord(record);
  console.info(eventMessage);
  await DatabaseUtil.execute({ resource: 'metrics', operation: 'putMetric' },
    { metrics: { event: JSON.stringify(eventMessage) } });
  await MessageUtil.sendMetric(eventMessage);
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
