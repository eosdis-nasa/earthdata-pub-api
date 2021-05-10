/**
 * Lambda to handle authentication interactions with identity provider.
 * @module Version
 */
const DatabaseUtil = require('database-util');

const AuthUtil = require('auth-util');

async function handler(event) {
  const {
    code, refresh, logout, state, context
  } = event;
  if (code) {
    const { token, user } = await AuthUtil.getToken(event);
    await DatabaseUtil.execute({ resource: 'user', operation: 'loginUser' },
      { user });
    return { token, state };
  }
  if (refresh && context) {
    const { refresh_token: refreshToken } = await DatabaseUtil.execute({ resource: 'user', operation: 'getRefreshToken' },
      { user: { id: context.user_id } });
    const { token, user } = await AuthUtil.refreshToken({ refreshToken });
    await DatabaseUtil.execute({ resource: 'user', operation: 'refreshUser' },
      { user });
    return { token };
  }
  if (logout) {
    const { redirect } = await AuthUtil.getLogoutUrl(event);
    return { redirect };
  }

  const { redirect } = await AuthUtil.getLoginUrl(event);
  return { redirect };
}

module.exports.handler = handler;
