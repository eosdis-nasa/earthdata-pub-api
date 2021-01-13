/**
 * Lambda to handle authentication interactions with identity provider.
 * @module Version
 */
const DatabaseUtil = require('database-util');
const AuthUtil = require('auth-util');

async function handler(event) {
  const { code, state, authorization } = event;
  if(code) {
    const { redirect, user } = await AuthUtil.redirectWithToken(event);
    DatabaseUtil.execute({ resource: 'user', operation: 'loginUser'}, { user });

    return { redirect };
  }
  else {
    const { redirect } = await AuthUtil.redirectGetCode(event);
    return { redirect };
  }
}

module.exports.handler = handler;
