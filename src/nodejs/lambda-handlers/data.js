/**
 * Lambda that exposes Data API to AWS API Gateway. This lambda
 * is used for fetching and updating user generated versioned databased entries
 * in the following tables:
 * Question, Form, Workflow, Action
 * @module Data
 */

const db = require('database-util');

async function findById({ resource, params }) {
  return db[resource].findById(params);
}

async function findAll({ resource, params }) {
  return db[resource].findAll(params);
}

async function seed() {
  const response = await db.seed();
  return response;
}

const operations = {
  findById,
  findAll,
  seed
};

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);

  const data = await operations[event.operation](event);
  return data;
}

module.exports.handler = handler;
