/**
 * Lambda that exposes Notify API to AWS API Gateway. This lambda
 * is used for processing in an incoming external notify request and
 * generating an SNS message to invoke the NotificationHandler.
 * @module Notify
 * @see module:NotificationHandler
 */

const { DynamoDB, SNS } = require('aws-sdk');

const { MessageDriver } = require('message-driver');

const { DynamodbDriver } = require('database-driver');

const ClientConfig = require('./client-config.js');

const msgDriver = new MessageDriver({
  snsClient: new SNS(ClientConfig.sns),
  topicArn: process.env.SNS_TOPIC
});

const dbDriver = new DynamodbDriver(
  new DynamoDB(ClientConfig.dynamodb),
  DynamoDB.Converter.marshall,
  DynamoDB.Converter.unmarshall,
  process.env.TABLE_SUFFIX
);

async function handler(event) {
  // After integration of auth user will be pulled from context
  const user = {
    id: '54ce2972-39a7-49d4-af07-6b014a3bddfe',
    user_name: 'Brian Ellingson',
    email: 'brian.ellingson@uah.edu'
  };
  console.info(dbDriver);

  const message = {
    body: event.body,
    attributes: {
      notification: 'true',
      invoked_by: user.id,
      invoke_type: 'user'
    }
  };

  const response = await msgDriver.sendSns(message);
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  };
}

exports.handler = handler;
