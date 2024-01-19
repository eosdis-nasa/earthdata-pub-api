const {
  SQS
} = require("@aws-sdk/client-sqs");
const { Consumer } = require('sqs-consumer');
const { inboundConsumer } = require('./handlers.js');

const messageHandler = (message) => {
  const modified = {
    messageId: message.MessageId,
    receiptHandle: message.ReceiptHandle,
    body: message.Body,
    attributes: message.Attributes,
    md5OfBody: message.MD5OfBody
  }
  const records = { Records: [modified] };
  return inboundConsumer(records);
}

const inboundListener = Consumer.create({
  sqs: new SQS({ endpoint: process.env.SNS_ENDPOINT }),
  queueUrl: 'http://goaws:4100/000000000000/edpub_inbound_sqs',
  pollingWaitTimeMs: 15000,
  handleMessage: messageHandler
});

module.exports.inboundListener = inboundListener;
