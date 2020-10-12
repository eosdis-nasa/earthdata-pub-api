/**
 * Lambda that exposes Data API to AWS API Gateway. This lambda
 * is used for fetching and updating user generated versioned databased entries
 * in the following tables:
 * Question, Form, Workflow, Action
 * @module Data
 */

const { PgAdapter, ErrorMessage } = require('database-driver');

const Schema = require('schema-util');

const ClientConfig = require('./client-config.js');

function marshalQueryParams(params) {
  return Object.entries(params).reduce((acc, [key, value]) => {
    const multiKey = key.split('.');
    PgAdapter.setNested(acc, multiKey, value);
    return acc;
  }, {});
}

async function findById(event) {
  const query = {
    resource: event.resource,
    operation: event.operation
  }
  const { id } = event.params.path;
  const params = {
    [event.resource]: { id: event.params.path.id }
  }
  return await PgAdapter.execute(query, params);
}

async function findAll(event) {
  const query = {
    resource: event.resource,
    operation: event.operation
  }
  const params = {}
  return await PgAdapter.execute(query, params);
}

async function putItem(event) {}

const operations = {
  findById: findById,
  findAll: findAll,
  putItem: putItem
};

async function handler(event) {
  const user = PgAdapter.execute(
    { table: 'user', operation:'findById' },
    { user: { id: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' }});
  // After integration of auth, user will be pulled from context

  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  console.info(`[USER]\n${JSON.stringify(user)}`);

  const operation = operations[event.operation];
  const data = await operation(event);
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
}

module.exports.handler = handler;
