/**
 * Lambda that serves as the core component of the Metrics Reporting System.
 * This lambda processes SNS messages published from edpub_topic, parses the
 * incoming message for basic information of the event, then publishes a message
 * to the edpub_metric_topic
 * @module MetricsHandler
 */

const { SNS } = require('aws-sdk');
const { MessageDriver } = require('message-driver');
const ClientConfig = require('./client-config.js');

const msgDriver = new MessageDriver({
  snsClient: new SNS(ClientConfig.sns),
  topicArn: process.env.SNS_TOPIC
});

function handler(event) {
  const record = event.Records[0];

  const subject = record.Sns.Subject ? record.Sns.Subject : '';
  const body = record.Sns.Message ? record.Sns.Message : '';
  const messageAttributes = JSON.stringify(record.Sns.MessageAttributes, null, 4);
  const log = JSON.stringify({
    executions: record.EventSubscriptionArn,
    level: 'info',
    message: `Subject: ${subject}\nBody: ${body}\nMessage Attributes: ${messageAttributes}`,
    sender: record.Sns.TopicArn,
    timestamp: new Date().toISOString()
  }, null, 4);
  return msgDriver.sendSns({ subject: 'Metrics Logging', body: `${log}`, attributes: {} });
}

exports.handler = handler;
