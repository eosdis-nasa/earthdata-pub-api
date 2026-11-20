/**
 * Lambda to expose models from Schema-Util through a handler.
 * @module Model
 */

const schema = require('schema-util');
const { guard } = require('./error-reference');

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);

  const model = schema.getModel(event.model);
  return model;
}

module.exports.handler = guard(handler);
