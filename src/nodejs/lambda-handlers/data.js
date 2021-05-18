/**
 * Lambda that exposes Data API to AWS API Gateway. This lambda
 * is used for fetching and updating user generated versioned databased entries
 * in the following tables:
 * Question, Form, Workflow, Action
 * @module Data
 */

const DatabaseUtil = require('database-util');

async function findById(event) {
  const query = {
    resource: event.resource,
    operation: event.operation
  };
  const { id } = event.params;
  const params = {
    [event.resource]: { id }
  };
  return DatabaseUtil.execute(query, params);
}

async function findAll({ resource, operation, params }) {
  return DatabaseUtil.execute({ resource, operation }, params);
}

async function putItem(event) {
  console.info('Not Implemented', event);
  return {};
}

async function seed() {
  const response = await DatabaseUtil.seed();
  return response;
}

const operations = {
  findById,
  findAll,
  putItem,
  seed
};

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);

  const data = await operations[event.operation](event);
  return data;
}

module.exports.handler = handler;
