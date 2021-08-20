/**
 * Lambda to handle authentication interactions with identity provider.
 * @module Version
 */
const db = require('database-util');

const auth = require('auth-util');

async function handler(event) {
  const {
    code, refresh, logout, state, context
  } = event;
  if (code) {
    const { access, refresh, decoded } = await auth.getToken(event);
    await db.user.loginUser({
      id: decoded.sub, refresh_token: refresh, ...decoded });
    const user = await db.user.findById({ id: decoded.sub });
    return { token: access, user, state };
  }
  if (refresh && context) {
    const { refresh_token: refreshToken } = await db.user.getRefreshToken({
      id: context.user_id });
    const { access, refresh, decoded } = await auth.refreshToken({
      token: refreshToken });
    await db.user.refreshUser({
      id: decoded.sub, refresh_token: refresh, ...decoded });
    const user = await db.user.findById({ id: decoded.sub });
    return { token: access, user };
  }
  if (logout) {
    const { redirect } = await auth.getLogoutUrl(event);
    return { redirect };
  }

  const { redirect } = await auth.getLoginUrl(event);
  return { redirect };
}

module.exports.handler = handler;
