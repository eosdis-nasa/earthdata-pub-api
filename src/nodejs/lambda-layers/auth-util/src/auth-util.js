/**
 * Lambda Layer to abstract interacting with Cognito IDP
 * @module Version
 */
const httpHelper = require('./http-helper.js');
const jwt = require('jsonwebtoken');

const providerUrl = process.env.AUTH_PROVIDER_URL;
const loginPath = process.env.AUTH_LOGIN_PATH;
const logoutPath = process.env.AUTH_LOGOUT_PATH;
const tokenPath = process.env.AUTH_TOKEN_PATH;
const userPath = process.env.AUTH_USER_PATH;

const clientId = process.env.AUTH_CLIENT_ID;
const clientSecret = process.env.AUTH_CLIENT_SECRET;
const clientUrl = process.env.AUTH_CLIENT_URL;

function getStateUrl(state) {
  try {
    const url = new URL(state);
    return url;
  }
  catch(e) {
    return new URL(clientUrl);
  }
}

async function tokenService(data) {
  const tokenRequest = {
    method: 'post',
    endpoint: new URL(tokenPath, providerUrl),
    auth: { type: 'basic', username: clientId, password: clientSecret },
    payload: {
      data,
      type: 'form'
    }
  }
  const tokens = await httpHelper.send(tokenRequest);
  return tokens
}

async function getToken({ code }) {
  const tokens = await tokenService({
    code,
    grant_type: 'authorization_code',
    redirect_uri: clientUrl
  });
  const user = jwt.decode(tokens.id_token);
  user.id = user.sub;
  user.refresh_token = tokens.refresh_token;
  return { token: tokens.access_token, user };
}

async function refreshToken({ refreshToken }) {
  const tokens = await tokenService({
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  });
  const user = jwt.decode(tokens.id_token);
  user.id = user.sub;
  user.refresh_token = tokens.refresh_token;
  return { token: tokens.access_token, user };
}

async function getLoginUrl({ state }) {
  const redirect = new URL(loginPath, providerUrl);
  redirect.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: clientUrl,
    scope: 'openid',
    response_type: 'code',
    state
  });
  return { redirect: redirect.href };
}

async function getLogoutUrl() {
  const redirect = new URL(logoutPath, proverUrl);
  redirect.search = new URLSearchParams({
    client_id: clientId,
    logout_uri: clientUrl
  })
  return { redirect: redirect.href }
}

module.exports.getToken = getToken;
module.exports.refreshToken = refreshToken;
module.exports.getLoginUrl = getLoginUrl;
module.exports.getLogoutUrl = getLogoutUrl;
