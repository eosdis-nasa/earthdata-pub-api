/**
 * Lambda that exposes integrated modules to AWS API Gateway. This lambda
 * will search the database for the requested module, invoke the module if
 * it exists and forward the response back through API Gateway.
 * @module Module
 * @see module:Module
 */

const AWS = require('aws-sdk');

const DatabaseUtil = require('database-util');

const MessageUtil = require('message-util');

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const { moduleName: module } = event;
  const lambda = await DatabaseUtil.execute({ resource: 'module', operation: 'findByName' },
    { short_name: moduleName });
  const params = {
    FunctionName: lambda.arn,
    InvocationType: 'RequestResponse',
    Payload: { ...event.payload, user_id: event.context.user_id }
  }
  const response = await lambda.invoke(params).promise();
  return response.Payload;
}

module.exports.handler = handler;
