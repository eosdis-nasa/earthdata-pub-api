/**
 * Lambda that exposes Data API to AWS API Gateway. This lambda
 * is used for fetching and updating user generated versioned databased entries
 * in the following tables:
 * Question, Form, Workflow, Action
 * @module Data
 */

const PgAdapter = require('database-driver');

async function findById(event) {
  const query = {
    resource: event.resource,
    operation: event.operation
  };
  const { id } = event.params.path;
  const params = {
    [event.resource]: { id }
  };
  return PgAdapter.execute(query, params);
}

async function findAll(event) {
  const query = {
    resource: event.resource,
    operation: event.operation
  };
  const params = {};
  if (event.params) {
    if (event.params.query) {
      if (event.params.query.sort) {
        params.sort = event.params.query.sort;
        params.order = event.params.query.order || 'ASC';
      }
      if (event.params.query.per_page) {
        params.limit = event.params.query.per_page;
        params.offset = (event.params.query.page || 0) * params.limit;
      }
    }
  }
  return PgAdapter.execute(query, params);
}

async function putItem(event) {
  console.info('Not Implemented', event);
  return {};
}

const operations = {
  findById,
  findAll,
  putItem
};

async function handler(event) {
  const user = await PgAdapter.execute(
    { resource: 'user', operation: 'findById' },
    { user: { id: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' } }
  );
  // After integration of auth, user will be pulled from context

  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  console.info(`[USER]\n${JSON.stringify(user)}`);

  const operation = operations[event.operation];
  const data = await operation(event);
  return data;
}

module.exports.handler = handler;
