/**
 * Lambda that exposes Data API to AWS API Gateway. This lambda
 * is used for fetching and updating user generated versioned databased entries
 * in the following tables:
 * Question, Form, Workflow, Action
 * @module Data
 */

const db = require('database-util');

async function getPrivileges(context) {
  const user = await db.user.findById({ id: context.user_id });
  return user.user_privileges;
}

async function findById({ resource, params, context }) {
  // Handle items that require daac privileges
  const privileges = await getPrivileges(context);
  if (privileges.includes('ADMIN') || privileges.includes('DAAC_READ')) {
    params.privileged_user = true;
  }
  params.user_id = context.user_id;

  return db[resource].findById(params);
}

async function findAll({ resource, params, context }) {
  const privileges = await getPrivileges(context);
  if (privileges.includes('ADMIN') || privileges.includes('DAAC_READ')) {
    params.privileged_user = true;
  }

  return db[resource].findAll(params);
}

async function seed() {
  const response = await db.seed();
  return response;
}

async function update({ resource, params }) {
  return db[resource].update(params);
}

async function add({ resource, params }) {
  return db[resource].add(params);
}

async function updateInputs({ resource, params }) {
  const promises = params.inputs.map(async (inputElem) => db[resource].updateInput(
    {
      input: inputElem,
      questionId: params.questionId
    }
  ));
  return Promise.all(promises);
}

const operations = {
  findById,
  findAll,
  seed,
  update,
  add,
  updateInputs
};

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);

  const data = await operations[event.operation](event);
  return data;
}

module.exports.handler = handler;
