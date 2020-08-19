/**
 * Lambda that exposes Register API to AWS API Gateway. This lambda
 * is for uploading a source file for a custom Action and creating an entry
 * in the Action table.
 * @module Register
 * @see module:Actions
 */

const { DynamoDB } = require('aws-sdk');

const DatabaseDriver = require('database-driver').DynamodbDriver;

const ClientConfig = require('./client-config.js');

const dbDriver = new DatabaseDriver(
  new AWS.DynamoDB(ClientConfig.dynamodb),
  AWS.DynamoDB.Converter.marshall,
  AWS.DynamoDB.Converter.unmarshall,
  process.env.TABLE_SUFFIX
);

async function handler(event, context) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  console.info(`[USER]\n${JSON.stringify(context.identity)}`);

  // After integration of auth user will be pulled from context
  const user = {
    id: '54ce2972-39a7-49d4-af07-6b014a3bddfe',
    user_name: 'Brian Ellingson',
    email: 'brian.ellingson@uah.edu'
  };
  let data;
  let err;

  console.info(dbDriver, user);

  if (err) {
    console.error(`[ERROR] ${err}`);
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ data, err })
  };
}

exports.handler = handler;
