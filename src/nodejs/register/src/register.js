/**
 * Lambda that exposes Register API to AWS API Gateway. This lambda
 * is for uploading a source file for a custom Action and creating an entry
 * in the Action table.
 * @module Register
 * @see module:Actions
 */

const PgAdapter = require('database-driver');

const MessageDriver = require('message-driver');

async function registerAction(event) {
  console.info('Not Implemented', event);
}

async function registerService(event) {
  console.info('Not Implemented', event);
}

async function registerUser(event) {
  console.info('Not Implemented', event);
}

const operations = {
  action: registerAction,
  service: registerService,
  user: registerUser
};

async function handler(event) {
  const user = await PgAdapter.execute(
    { resource: 'user', operation: 'findById' },
    { user: { id: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' } }
  );
  // After integration of auth, user will be pulled from context

  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  console.info(`[USER]\n${JSON.stringify(user)}`);

  // Temporary to prevent lint errors
  console.info(MessageDriver);

  const operation = operations[event.register];
  const data = await operation(event);
  return data;
}

exports.handler = handler;
