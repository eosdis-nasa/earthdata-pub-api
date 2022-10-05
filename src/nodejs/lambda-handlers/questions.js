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

async function deleteInput(params){
  const question = await db.question.findById({id: params.questionId})
  const curInput = question.inputs.map(input => input.control_id)
  const toDelete = curInput.filter(cid => !params.inputs.some(testInput => testInput.control_id === cid))
  console.log(params.inputs.length)
  console.log(toDelete)
  return await db.question.deleteInput({toDelete})
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
    const deletes = await deleteInput(params)
    console.log('did enter')
    const promises = params.inputs.map(async (inputElem) => db.question.updateInput(
      {
        input: inputElem,
        questionId: params.questionId
      }
    ));
    const updates =  Promise.all(promises);
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
