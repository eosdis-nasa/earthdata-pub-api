/**
 * Lambda to handle authentication interactions with identity provider.
 * @module Version
 */
const db = require('database-util');

const auth = require('auth-util');

const {
  CognitoIdentityProviderClient,
  AssociateSoftwareTokenCommand,
  GetUserCommand
} = require('@aws-sdk/client-cognito-identity-provider');

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  if (event.code) {
    const { access, refresh, decoded } = await auth.getToken(event);
    await db.user.loginUser({ ...decoded, refresh_token: refresh });
    const user = await db.user.findById({ id: decoded.sub });
    if (process.env.AUTH_PROVIDER_URL === 'http://localhost:8080') return { token: access, state: event.state, user };
    const userResp = { ...user, ...{ issuer: process.env.AUTH_PROVIDER_URL, username: decoded['cognito:username'] } };
    const idp = new CognitoIdentityProviderClient();
    const getUserCommand = new GetUserCommand({
      AccessToken: access
    });
    let resp = { token: access, state: event.state, user: userResp };
    if (!('UserMFASettingList' in await idp.send(getUserCommand))) {
      const AssociateTokenCommand = new AssociateSoftwareTokenCommand({
        AccessToken: access
      });
      const { SecretCode } = await idp.send(AssociateTokenCommand);
      resp = { ...resp, ...{ mfaSecretCode: SecretCode } };
    }
    return resp;
  }
  if (event.refresh && event.context) {
    const { refresh_token: refreshToken } = await db.user.getRefreshToken(
      { id: event.context.user_id }
    );
    const { access, refresh, decoded } = await auth.refreshToken({ token: refreshToken });
    await db.user.refreshUser({ ...decoded, refresh_token: refresh });
    const user = await db.user.findById({ id: decoded.sub });
    return { token: access, user };
  }
  if (event.logout) {
    const { redirect } = await auth.getLogoutUrl(event);
    return { redirect };
  }

  const { redirect } = await auth.getLoginUrl(event);
  return { redirect };
}

module.exports.handler = handler;
