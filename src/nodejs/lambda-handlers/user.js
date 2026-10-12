/**
 * Lambda that exposes User API to AWS API Gateway. This lambda
 * is used for handling user management tasks such as assigning or
 * removing groups or roles.
 * @module User
 * @see module:UserHandler
 */

const db = require('database-util');
// const msg = require('message-util');
const { CognitoIdentityProvider: CognitoIdentityServiceProvider } = require('@aws-sdk/client-cognito-identity-provider');

const idp = new CognitoIdentityServiceProvider({ region: process.env.REGION });
const userPoolId = process.env.CUP_ID || process.env.USER_POOL_ID;
const dev = process.env.DEVELOPMENT || false;

/**
 * Map Cognito `sub` → Enabled. Returns null when Cognito is unavailable (local/dev)
 * so callers can default to Active.
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

async function getCognitoEnabledForUser(userId) {
  if (dev || !userPoolId) {
    return true;
  }
  try {
    const res = await idp.listUsers({
      UserPoolId: userPoolId,
      Filter: `sub = "${userId}"`,
      Limit: 1
    });
    if (res.Users && res.Users[0]) {
      return !!res.Users[0].Enabled;
    }
    return false;
  } catch (err) {
    console.error('Failed to read Cognito Enabled for user', userId, err.message);
    return null;
  }
}

function withEnabled(user, enabled) {
  // Only enrich plain user objects (skip strings/arrays from older callers/tests)
  if (!user || user.error || typeof user !== 'object' || Array.isArray(user)) {
    return user;
  }
  return { ...user, enabled };
}

async function createCognitoUser({
  sub, username, name, email
}) {
  if (dev) {
    return {
      username, name, email, ...(sub ? { sub } : {})
    };
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
    const { User: userData } = await idp.adminCreateUser(params);
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
  if (privileges.includes('ADMIN')) {
    const { email, detailed } = params;
    const { email: emailUsed } = await db.user.findByEmail({ email });
    if (emailUsed === email) { return { error: 'Duplicate email' }; }

    const newUser = await createCognitoUser(params);
    let user = await db.user.loginUser(newUser);
    if (Array.isArray(params.role_ids)) {
      params.role_ids.forEach(async (roleId) => {
        await db.user.addRole({ ...user, role_id: roleId });
      });
    }

    if (Array.isArray(params.group_ids)) {
      params.group_ids.forEach(async (groupId) => {
        await db.user.addGroup({ ...user, group_id: groupId });
      });
    }

    if (detailed) {
      user = await db.user.setDetail({ ...user, detailed });
    }

    return user;
  }
  return { error: 'No privilege' };
}

async function updateUsername(params) {
  const { name, id } = params;
  const resp = await db.user.updateUsername({ name, id });
  return resp;
}

async function findMethod(params, privileges) {
  if (privileges.includes('ADMIN')
    || privileges.includes('USER_READ')) {
    if (params.id) {
      const user = await db.user.findById(params);
      return withEnabled(user, await getCognitoEnabledForUser(params.id));
    }
    const users = await db.user.find(params);
    const enabledBySub = await listCognitoEnabledBySub();
    if (!Array.isArray(users)) {
      return users;
    }
    if (enabledBySub === null) {
      return users.map((u) => withEnabled(u, true));
    }
    return users.map((u) => withEnabled(
      u,
      enabledBySub.has(u.id) ? enabledBySub.get(u.id) : false
    ));
  }
  return { error: 'No privilege' };
}

async function findAllMethod(event, privileges) {
  const { params } = event;
  if (privileges.includes('ADMIN') || privileges.includes('USER_READ')) {
    if (params && params.id) {
      const user = await db.user.findById(params);
      return withEnabled(user, await getCognitoEnabledForUser(params.id));
    }
    const users = await db.user.findAll(params || {});
    const enabledBySub = await listCognitoEnabledBySub();
    if (!Array.isArray(users)) {
      return users;
    }
    if (enabledBySub === null) {
      return users.map((u) => withEnabled(u, true));
    }
    return users.map((u) => withEnabled(
      u,
      enabledBySub.has(u.id) ? enabledBySub.get(u.id) : false
    ));
  }
  return { error: 'No privilege' };
}

async function findByIdMethod(event, privileges) {
  const { params, context } = event;
  if (privileges.includes('ADMIN')
    || privileges.includes('USER_READ')
    || params.id === context.user_id) {
    const user = await db.user.findById(params);
    return withEnabled(user, await getCognitoEnabledForUser(params.id));
  }
  return { error: 'No privilege' };
}

async function groupConditional(id, userPrivileges, groupId, privilege) {
  if (userPrivileges.includes('ADMIN')) { return true; }
  const { user_groups: userGroups } = await db.user.findById({ id });
  const groupIds = userGroups.map((group) => group.id);
  return userPrivileges.includes(privilege) && groupIds.includes(groupId);
}

async function addGroupMethod(params, privileges) {
  if (await groupConditional(params.context.user_id, privileges, params.group_id, 'USER_ADDGROUP')) {
    const response = await db.user.addGroup(params);
    return response;
  }
  return { error: 'No privilege' };
}

async function removeGroupMethod(params, privileges) {
  if (await groupConditional(params.context.user_id, privileges, params.group_id, 'USER_REMOVEGROUP')) {
    const response = await db.user.removeGroup(params);
    return response;
  }
  return { error: 'No privilege' };
}

async function roleConditional(userPrivileges, roleId, privilege) {
  if (userPrivileges.includes('ADMIN')) { return true; }
  const { id } = await db.role.findByName({ short_name: 'admin' });
  return userPrivileges.includes(privilege) && roleId !== id;
}

async function addRoleMethod(params, privileges) {
  if (await roleConditional(privileges, params.role_id, 'USER_ADDROLE')) {
    const response = await db.user.addRole(params);
    return response;
  }
  return { error: 'No privilege' };
}

async function removeRoleMethod(params, privileges) {
  if (await roleConditional(privileges, params.role_id, 'USER_REMOVEROLE')) {
    const response = await db.user.removeRole(params);
    return response;
  }
  return { error: 'No privilege' };
}

async function getUsersMethod(params) {
  const { ids } = params;
  const resp = await db.user.getUsers({ ids });
  return (resp);
}

async function getDetailedUsersMethod(event, privileges) {
  const { params } = event;
  if (privileges.includes('ADMIN') || privileges.includes('USER_READ')) {
    const response = await db.user.getDetailedUsers(params);
    if (params.role_id || params.group_id) {
      let filteredResponse = response;

      if (params.role_id) {
        const roleResponse = await db.role.findById({ id: params.role_id });
        filteredResponse = response.filter(
          (user) => user.user_roles.includes(roleResponse.long_name)
        );
      }

      if (params.group_id) {
        const groupResponse = await db.group.findById({ id: params.group_id });
        filteredResponse = filteredResponse.filter(
          (user) => user.user_groups.includes(groupResponse.long_name)
        );
      }

      return filteredResponse;
    }

    return response;
  }
  return { error: 'No privilege' };
}

const operations = {
  create: createMethod,
  find: findMethod,
  findAll: findAllMethod,
  findById: findByIdMethod,
  add_group: addGroupMethod,
  remove_group: removeGroupMethod,
  add_role: addRoleMethod,
  remove_role: removeRoleMethod,
  get_users: getUsersMethod,
  update_username: updateUsername,
  getDetailedUsers: getDetailedUsersMethod
};

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const user = await db.user.findById({ id: event.context.user_id });
  const operation = operations[event.operation];
  const data = await operation(event, user.user_privileges);
  return data;
}

exports.handler = handler;
