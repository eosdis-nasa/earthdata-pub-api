/**
 * Lambda that exposes Notify API to AWS API Gateway.  This lambda
 * is used for processing questions and performing user permissions.
 * @module questions
 */

const db = require('database-util');

const editPerms = { roles: ['admin'] };
const readPerms = { roles: ['admin', 'staff', 'manager', 'observer'] };

async function hasPerms(uid, perms) {
  const userInfo = await db.user.findById({ id: uid });
  if (userInfo.user_roles.some((role) => perms.roles.includes(role.short_name))) {
    return true;
  }
  return false;
}

async function findAllMethod({ params, context }) {
  return await hasPerms(context.user_id, readPerms) ? db.question.findAll(params) : {};
}

async function findByNameMethod({ params }) {
  return await hasPerms(context.user_id, readPerms) ? db.question.findByName(params) : {};
}

async function findByIdMethod({ params }) {
  return await hasPerms(context.user_id, readPerms) ? db.question.findById(params) : {};
}

async function updateMethod({ params }) {
  return await hasPerms(context.user_id, editPerms) ? db.question.update(params) : {};
}

async function addMethod({ params }) {
  return await hasPerms(context.user_id, editPerms) ? db.question.add(params) : {};
}

async function updateInputsMethod({ params }) {
  if (await hasPerms(params.context.user_id, editPerms)) {
    const promises = params.inputs.map(async (inputElem) => db.question.updateInput(
      {
        input: inputElem,
        questionId: params.questionId
      }
    ));
    return Promise.all(promises);
  }
  return {};
}

const operations = {
  findAll: findAllMethod,
  findByName: findByNameMethod,
  findById: findByIdMethod,
  updateInputs: updateInputsMethod,
  add: addMethod,
  update: updateMethod
};

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);

  const operation = operations[event.operation];
  const data = await operation(event);
  return data;
}

exports.handler = handler;
