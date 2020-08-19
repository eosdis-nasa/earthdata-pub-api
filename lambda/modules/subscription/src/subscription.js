/**
 * Lambda that exposes Subscription API to AWS API Gateway. This lambda
 * is creates or removes entries in the Subscription table to allow a user
 * to receive notifications for activity involving a given source.
 * @module Subscription
 * @see module:NotificationHandler
 */

const { DynamoDB } = require('aws-sdk');

const { DynamodbDriver } = require('database-driver');

const ClientConfig = require('./client-config.js');

const dbDriver = new DynamodbDriver(
  new DynamoDB(ClientConfig.dynamodb),
  DynamoDB.Converter.marshall,
  DynamoDB.Converter.unmarshall,
  process.env.TABLE_SUFFIX
);

async function getMethod(event, user) {
  return dbDriver.getItems('subscription', user.id);
}

async function postMethod(event, user) {
  const body = JSON.parse(event.body);
  if (body.action === 'subscribe') {
    const item = {
      id: user.id,
      source_id: body.source_id,
      table_name: body.table_name
    };
    return dbDriver.putItem('subscription', item);
  } if (body.action === 'unsubscribe') {
    return dbDriver.deleteItem('subscription', user.id, body.source_id);
  }
  return [false, 'Bad request.'];
}

const methodMap = {
  GET: getMethod,
  POST: postMethod
};

async function handler(event, context) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  console.info(`[USER]\n${JSON.stringify(context.identity)}`);

  // After integration of auth user will be pulled from context
  const user = {
    id: '54ce2972-39a7-49d4-af07-6b014a3bddfe',
    user_name: 'Brian Ellingson',
    email: 'brian.ellingson@uah.edu'
  };
  const method = event.httpMethod;
  const operation = methodMap[method];
  const [data, err] = await operation(event, user);
  if (err) {
    console.error(`[ERROR] ${err}`);
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ data, err })
  };
}

exports.handler = handler;
