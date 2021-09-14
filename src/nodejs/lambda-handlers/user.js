/**
 * Lambda that exposes User API to AWS API Gateway. This lambda
 * is used for handling user management tasks such as assigning or
 * removing groups or roles.
 * @module User
 * @see module:UserHandler
 */

const db = require('database-util');
const { CognitoIdentityServiceProvider } = require('aws-sdk');

const idp = new CognitoIdentityServiceProvider({ region: process.env.REGION });
const userPoolId = process.env.CUP_ID;
const dev = process.env.DEVELOPMENT || false;

async function createCognitoUser({ username, name, email }) {
  if (dev) {
    return { username, name, email };
  }
  const params = {
    UserPoolId: userPoolId,
    Username: username,
    DesiredDeliveryMediums: ['EMAIL'],
    ForceAliasCreation: false,
    UserAttributes: [
      { Name: 'name', Value: name },
      { Name: 'email', Value: email },
      { Name: 'email_verified', Value: 'true' }
    ]
  };
  try {
    const { User: userData } = await idp.adminCreateUser(params).promise();
    const user = userData.Attributes.reduce((acc, attribute) => {
      const key = { [attribute.Name]: attribute.Value };
      Object.assign(acc, key);
      return acc;
    }, { username: userData.Username });
    return user;
  } catch (e) {
    return { error: e.message };
  }
}

async function createMethod(params, privileges) {
  if (privileges.includes('ADMIN')
    || privileges.includes('USER_CREATE')) {
    const newUser = await createCognitoUser(params);
    const user = await db.user.loginUser(newUser);
    if (params.user_roles && params.user_roles.length > 0) {
      await db.user.addRoles({ ...user, user_roles: params.user_roles });
    }
    if (params.user_groups && params.user_groups.length > 0) {
      await db.user.addGroups({ ...user, user_groups: params.user_groups });
    }
    return user;
  }
  return { error: 'No privilege' };
}

async function findMethod(params, privileges) {
  if (privileges.includes('ADMIN')
    || privileges.includes('USER_READ')) {
    if (params.id) return db.user.findById(params);
    return db.user.find(params);
  }
  return { error: 'No privilege' };
}

async function addGroupMethod(params, privileges) {
  if (privileges.includes('ADMIN')
    || privileges.includes('USER_ADDGROUP')) {
    const response = await db.user.addGroup(params);
    return response;
  }
  return { error: 'No privilege' };
}

async function removeGroupMethod(params, privileges) {
  if (privileges.includes('ADMIN')
    || privileges.includes('USER_REMOVEGROUP')) {
    const response = await db.user.removeGroup(params);
    return response;
  }
  return { error: 'No privilege' };
}

async function addRoleMethod(params, privileges) {
  if (privileges.includes('ADMIN')
    || privileges.includes('USER_ADDROLE')) {
    const response = await db.user.addRole(params);
    return response;
  }
  return { error: 'No privilege' };
}

async function removeRoleMethod(params, privileges) {
  if (privileges.includes('ADMIN')
    || privileges.includes('USER_REMOVEROLE')) {
    const response = await db.user.removeRole(params);
    return response;
  }
  return { error: 'No privilege' };
}

const operations = {
  create: createMethod,
  find: findMethod,
  add_group: addGroupMethod,
  remove_group: removeGroupMethod,
  add_role: addRoleMethod,
  remove_role: removeRoleMethod
};

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const user = await db.user.findById({ id: event.context.user_id });
  const operation = operations[event.operation];
  const data = await operation(event, user.user_privileges);
  return data;
}

exports.handler = handler;
