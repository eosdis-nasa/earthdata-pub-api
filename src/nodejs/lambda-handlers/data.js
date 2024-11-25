/**
 * Lambda that exposes Data API to AWS API Gateway. This lambda
 * is used for fetching and updating user generated versioned databased entries
 * in the following tables:
 * Question, Form, Workflow, Action
 * @module Data
 */

const db = require('database-util');

const msg = require('message-util');

async function getPrivileges(context) {
  const user = await db.user.findById({ id: context.user_id });
  return user.user_privileges;
}

async function findById({resource, params, context}) {
  // Handle items that require daac privileges
  const privileges = await getPrivileges(context);
  if (privileges.includes('ADMIN') || privileges.includes('DAAC_READ')) {
    params.privileged_user = true;
  }

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

async function onboardDaac({ id, context }) {
  const privileges = await getPrivileges(context);
  if (!privileges.includes('ADMIN')) {
    return ({ error: 'Not Authorized' });
  }
  const response = await db.daac.onboard({ id });
  await msg.sendEvent({
    daac_name: response.short_name,
    event_type: 'daac_onboard'
  });
  return response;
}

async function offboardDaac({ id, context }) {
  const privileges = await getPrivileges(context);
  if (!privileges.includes('ADMIN')) {
    return ({ error: 'Not Authorized' });
  }
  const response = await db.daac.offboard({ id });
  await msg.sendEvent({
    daac_name: response.short_name,
    event_type: 'daac_offboard'
  });
  return response;
}

const operations = {
  findById,
  findAll,
  seed,
  update,
  add,
  updateInputs,
  onboardDaac,
  offboardDaac
};

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);

  const data = await operations[event.operation](event);
  return data;
}

module.exports.handler = handler;
