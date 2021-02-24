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
  return DatabaseUtil.execute(query, params);
}

async function putItem(event) {
  console.info('Not Implemented', event);
  return {};
}

async function seed(event) {
  let response = await DatabaseUtil.seed();
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
