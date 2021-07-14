/**
 * Lambda that exposes integrated modules to AWS API Gateway. This lambda
 * will search the database for the requested module, invoke the module if
 * it exists and forward the response back through API Gateway.
 * @module Module
 * @see module:Module
 */

const DatabaseUtil = require('database-util');

const { Lambda } = require('aws-sdk');

const lambda = new Lambda();

const errors = {
  in_module: {
    error: 'An error occured in the requested module.'
  },
  not_found: {
    error: 'The requested module does not have a user interface.'
  },
  no_ui: {
    error: 'There is no such module.'
  }
};

function invokeLambda(functionArn, payload) {
  const params = {
    FunctionName: functionArn,
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify(payload)
  };
  return lambda.invoke(params).promise()
    .then(({ Payload }) => Payload || errors.in_module);
}

async function listMethod() {
  return DatabaseUtil.execute({ resource: 'module', operation: 'findAllWithInterface' }, {});
}

async function interfaceMethod(event) {
  const moduleMeta = await DatabaseUtil.execute({ resource: 'module', operation: 'findByName' },
    { short_name: event.module });
  if (moduleMeta.error) {
    return errors.not_found;
  }
  if (!moduleMeta.has_interface) {
    return errors.no_ui;
  }

  return invokeLambda(moduleMeta.arn, { operation: 'ui' });
}

async function requestMethod(event) {
  const moduleMeta = await DatabaseUtil.execute({ resource: 'module', operation: 'findByName' },
    { short_name: event.module });
  if (moduleMeta.error) {
    return errors.not_found;
  }

  return invokeLambda(moduleMeta.arn, { ...event.payload, user_id: event.context.user_id });
}

const operations = {
  list: listMethod,
  interface: interfaceMethod,
  request: requestMethod
};

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);

  const operation = operations[event.operation];
  const data = await operation(event);
  return data;
}

module.exports.handler = handler;
