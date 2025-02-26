/**
 * Lambda Layer to abstract interacting with Cognito IDP
 * @module Version
 */
const jwt = require('jsonwebtoken');
const httpHelper = require('./http-helper.js');

const providerUrl = process.env.AUTH_PROVIDER_URL;
const loginPath = process.env.AUTH_LOGIN_PATH;
const logoutPath = process.env.AUTH_LOGOUT_PATH;
const tokenPath = process.env.AUTH_TOKEN_PATH;
// const userPath = process.env.AUTH_USER_PATH;

const clientRoot = process.env.CLIENT_ROOT_URL;
const clientId = process.env.AUTH_CLIENT_ID;
const clientSecret = process.env.AUTH_CLIENT_SECRET;
const clientPath = process.env.AUTH_CLIENT_PATH;

async function tokenService(data) {
  const tokenRequest = {
    method: 'post',
    endpoint: new URL(tokenPath, providerUrl),
    auth: { type: 'basic', username: clientId, password: clientSecret },
    payload: {
      data,
      type: 'form'
    }
  };
  const tokens = await httpHelper.send(tokenRequest);
  return tokens;
}

async function getToken({ code }) {
  const clientUri = new URL(clientPath, clientRoot);
  const tokens = await tokenService({
    code,
    grant_type: 'authorization_code',
    redirect_uri: clientUri.href
  });
  const decoded = jwt.decode(tokens.id_token);
  const refresh = tokens.refresh_token;
  const access = tokens.access_token;
  return { access, refresh, decoded };
}

async function refreshToken({ token }) {
  const tokens = await tokenService({
    grant_type: 'refresh_token',
    refresh_token: token
  });
  const decoded = jwt.decode(tokens.id_token);
  const refresh = token;
  const access = tokens.access_token;
  return { access, refresh, decoded };
}

async function getLoginUrl({ state }) {
  const clientUri = new URL(clientPath, clientRoot);
  const redirect = new URL(loginPath, providerUrl);
  redirect.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: clientUri.href,
    scope: 'openid aws.cognito.signin.user.admin',
    response_type: 'code',
    state
  });
  return { redirect: redirect.href };
}

async function getLogoutUrl({ host }) {
  const clientUri = new URL(clientPath, host);
  const redirect = new URL(logoutPath, providerUrl);
  redirect.search = new URLSearchParams({
    client_id: clientId,
    logout_uri: clientUri.href
  });
  return { redirect: redirect.href };
}

module.exports.getToken = getToken;
module.exports.refreshToken = refreshToken;
module.exports.getLoginUrl = getLoginUrl;
module.exports.getLogoutUrl = getLogoutUrl;
