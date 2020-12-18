/**
 * Lambda to handle authentication interactions with identity provider.
 * @module Version
 */
const PgAdapter = require('database-driver');
const AuthUtil = require('auth-util');

async function handler(event) {
  const { code, state, authorization } = event;
  if(code) {
    const { redirect, user } = await AuthUtil.redirectWithToken(event);
    PgAdapter.execute({ resource: 'user', operation: 'loginUser'}, { user });

    return { redirect };
  }
  else {
    const { redirect } = await AuthUtil.redirectGetCode(event);
    return { redirect };
  }
}

module.exports.handler = handler;
