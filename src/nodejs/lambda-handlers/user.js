/**
 * Lambda that exposes User API to AWS API Gateway. This lambda
 * is used for handling user management tasks such as assigning or
 * removing groups or roles.
 * @module User
 * @see module:UserHandler
 */

const db = require('database-util');

async function findMethod(params) {
  if (params.id) return db.user.findById(params);
  return db.user.find(params);
}

async function addGroupMethod(params) {
  const response = await db.user.addGroup(params);
  return response;
}

async function removeGroupMethod(params) {
  const response = await db.user.removeGroup(params);
  return response;
}

async function addRoleMethod(params) {
  const response = await db.user.addRole(params);
  return response;
}

async function removeRoleMethod(params) {
  const response = await db.user.removeRole(params);
  return response;
}

const operations = {
  find: findMethod,
  add_group: addGroupMethod,
  remove_group: removeGroupMethod,
  add_role: addRoleMethod,
  remove_role: removeRoleMethod
};

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);

  const operation = operations[event.operation];
  const data = await operation(event);
  return data;
}

exports.handler = handler;
