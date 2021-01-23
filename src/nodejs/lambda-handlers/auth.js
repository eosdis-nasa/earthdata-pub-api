/**
 * Lambda to handle authentication interactions with identity provider.
 * @module Version
 */
const DatabaseUtil = require('database-util');

const AuthUtil = require('auth-util');

async function handler(event) {
  const { code, logout, state } = event;
  if (code) {
    const { token, user } = await AuthUtil.getToken(event);
    await DatabaseUtil.execute({ resource: 'user', operation: 'loginUser'}, { user });
    return { token, state };
  }
  else if (logout) {
    const { redirect } = await AuthUtil.getLogoutUrl(event);
    return { redirect };
  }
  else {
    const { redirect } = await AuthUtil.getLoginUrl(event);
    return { redirect };
  }
}

module.exports.handler = handler;
