/**
 * Lambda that exposes Data API to AWS API Gateway. This lambda
 * is used for fetching and updating user generated versioned databased entries
 * in the following tables:
 * Question, Form, Workflow, Action
 * @module Data
 */

const db = require('database-util');
const { CognitoIdentityProvider: CognitoIdentityServiceProvider } = require('@aws-sdk/client-cognito-identity-provider');

const idp = new CognitoIdentityServiceProvider({ region: process.env.REGION });
const userPoolId = process.env.CUP_ID || process.env.USER_POOL_ID;
const dev = process.env.DEVELOPMENT || false;

async function getPrivileges(context) {
  const user = await db.user.findById({ id: context.user_id });
  return user.user_privileges;
}

/**
 * Map Cognito `sub` → Enabled. null when Cognito unavailable (local/dev).
 */
async function listCognitoEnabledBySub() {
  if (dev || !userPoolId) {
    return null;
  }
  const enabledBySub = new Map();
  let paginationToken;
  do {
    const res = await idp.listUsers({
      UserPoolId: userPoolId,
      Limit: 60,
      ...(paginationToken ? { PaginationToken: paginationToken } : {})
    });
    (res.Users || []).forEach((cognitoUser) => {
      const attrs = Object.fromEntries(
        (cognitoUser.Attributes || []).map((a) => [a.Name, a.Value])
      );
      if (attrs.sub) {
        enabledBySub.set(attrs.sub, !!cognitoUser.Enabled);
      }
    });
    paginationToken = res.PaginationToken;
  } while (paginationToken);
  return enabledBySub;
}

async function enrichUsersWithEnabled(users) {
  if (!Array.isArray(users)) {
    return users;
  }
  const enabledBySub = await listCognitoEnabledBySub();
  if (enabledBySub === null) {
    return users.map((u) => ({ ...u, enabled: true }));
  }
  return users.map((u) => ({
    ...u,
    enabled: enabledBySub.has(u.id) ? enabledBySub.get(u.id) : false
  }));
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

  const result = await db[resource].findAll(params);
  if (resource === 'user') {
    return enrichUsersWithEnabled(result);
  }
  return result;
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
