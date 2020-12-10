/**
 * Lambda to handle authentication interactions with identity provider.
 * @module Version
 */
const authUtil = require('auth-util');

async function handler(event) {
  const { code, state, authorization } = event;
  if(code) {
    return authUtil.redirectWithToken(event);
  }
  else {
    return authUtil.redirectGetCode(event);
  }
}

module.exports.handler = handler;
