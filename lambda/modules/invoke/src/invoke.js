/**
 * Lambda that exposes Invoke API to AWS API Gateway. This lambda
 * is used for processing in an incoming external action request and
 * generating an SQS message to invoke the ActionHandler.
 * @module Invoke
 * @see module:ActionHandler
 */

const { SQS } = require('aws-sdk');

const { MessageDriver } = require('message-driver');

const ClientConfig = require('./client-config.js');

const msgDriver = new MessageDriver({
  sqsClient: new SQS(ClientConfig.sqs),
  queueUrl: process.env.SQS_QUEUE
});

async function handler(event) {
  const message = JSON.parse(event.body);

  // After integration of auth user will be pulled from context
  const user = {
    id: '54ce2972-39a7-49d4-af07-6b014a3bddfe',
    user_name: 'Brian Ellingson',
    email: 'brian.ellingson@uah.edu'
  };

  message.attributes = {
    notification: true,
    invoked_by: user.id,
    invoke_type: 'user'
  };

  const response = await msgDriver.sendSqs(message);
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  };
}

exports.handler = handler;
