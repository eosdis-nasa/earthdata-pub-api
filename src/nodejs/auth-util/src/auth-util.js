/**
 * Lambda Layer to abstract interacting with Cognito IDP
 * @module Version
 */
const httpHelper = require('./http-helper.js');
const jwt = require('jsonwebtoken');

const providerUrl = process.env.AUTH_PROVIDER_URL;
const loginPath = process.env.AUTH_LOGIN_PATH;
const authorizePath = process.env.AUTH_AUTHORIZE_PATH;
const tokenPath = process.env.AUTH_TOKEN_PATH;
const userPath = process.env.AUTH_USER_PATH;

const clientId = process.env.AUTH_CLIENT_ID;
const clientSecret = process.env.AUTH_CLIENT_SECRET;
const callbackUrl = process.env.AUTH_CALLBACK_URL;
const stateUrl = process.env.AUTH_STATE_URL;


async function redirectWithToken({ code, refresh, state }) {
    const tokenRequest = {
      method: 'post',
      endpoint: new URL(tokenPath, providerUrl),
      auth: { type: 'basic', username: clientId, password: clientSecret },
      payload: {
        type: 'form',
        data: {
          redirect_uri: callbackUrl,
          ...(code ? { code, grant_type: 'authorization_code' } : {}),
          ...(refresh ? { refresh_token: refresh, grant_type: 'refresh_token' } : {})
        }
      }
    }
    const { id_token: idToken,
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: expires,
            token_type: type } = await httpHelper.send(tokenRequest);
    const user = jwt.decode(idToken);
    user.id = user.sub;
    const redirect = new URL(state || stateUrl);
    redirect.searchParams.set('token', idToken);
    return { redirect: redirect.href, user };
  }

async function redirectGetCode({ code, refresh, state }) {
  const redirect = new URL(loginPath, providerUrl);
  redirect.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    scope: 'openid',
    response_type: 'code',
    ...(state ? { state } : {})
  });
  return { redirect: redirect.href };
}

module.exports.redirectWithToken = redirectWithToken;
module.exports.redirectGetCode = redirectGetCode;
