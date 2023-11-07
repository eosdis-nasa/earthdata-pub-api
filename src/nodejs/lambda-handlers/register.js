/**
 * Lambda that exposes Register API to AWS API Gateway. This lambda
 * is for uploading a source file for a custom Action and creating an entry
 * in the Action table.
 * @module Register
 * @see module:Actions
 */

const db = require('database-util');

const msg = require('message-util');

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
  console.info(`[EVENT]\n${JSON.stringify(event)}`);

  // Temporary to prevent lint errors
  console.info(msg, db);
  console.info(operations);
  return { message: 'Not implemented.' };
}

exports.handler = handler;
