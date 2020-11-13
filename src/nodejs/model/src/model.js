/**
 * Lambda to expose models from Schema-Util through a handler.
 * @module Model
 */

const PgAdapter = require('database-driver');

const Schema = require('schema-util');

async function handler(event) {
  const user = await PgAdapter.execute(
    { resource: 'user', operation: 'findById' },
    { user: { id: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' } }
  );
  // After integration of auth, user will be pulled from context

  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  console.info(`[USER]\n${JSON.stringify(user)}`);

  const model = Schema.getModel(event.model);
  return model;
}

module.exports.handler = handler;
