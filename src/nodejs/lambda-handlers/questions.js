/**
 * Lambda that exposes Notify API to AWS API Gateway.  This lambda
 * is used for processing questions and performing user permissions.
 * @module questions
 */

const db = require('database-util');

const editPerms = { roles: ['ADMIN'] };
const readPerms = { roles: ['ADMIN', 'QUESTION_READ'] };

async function hasPerms(uid, perms) {
  const userInfo = await db.user.findById({ id: uid });
  if (userInfo.user_privilages.some((privilage) => perms.privilages.includes(privilage))) {
    return true;
  }
  return false;
}

async function deleteInput(params) {
  const question = await db.question.findById({ id: params.questionId });

  const toDelete = [];
  for (let i = 0; i < params.inputs.length; i += 1) {
    params.inputs[i].list_order = i;
    question.inputs.forEach((quesInput) => {
      // eslint-disable-next-line
      quesInput.control_id !== params.inputs[i].control_id ? toDelete.push(quesInput.control_id) : '';
    });
  }
  return db.question.deleteInput({ toDelete });
}

async function findAllMethod({ params, context }) {
  return await hasPerms(context.user_id, readPerms) ? db.question.findAll(params) : {};
}

async function findByNameMethod({ params, context }) {
  return await hasPerms(context.user_id, readPerms) ? db.question.findByName(params) : {};
}

async function findByIdMethod({ params, context }) {
  return await hasPerms(context.user_id, readPerms) ? db.question.findById(params) : {};
}

async function updateMethod({ params, context }) {
  return await hasPerms(context.user_id, editPerms) ? db.question.update(params) : {};
}

async function addMethod({ params, context }) {
  return await hasPerms(context.user_id, editPerms) ? db.question.add(params) : {};
}

async function updateInputsMethod({ params, context }) {
  if (await hasPerms(context.user_id, editPerms)) {
    await deleteInput(params);
    const promises = params.inputs.map(async (inputElem) => db.question.updateInput(
      {
        input: inputElem,
        questionId: params.questionId
      }
    ));
    Promise.all(promises);
    return (db.question.findById(params));
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
