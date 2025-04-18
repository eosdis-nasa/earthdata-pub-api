const {
  CognitoIdentityProviderClient,
  AssociateSoftwareTokenCommand,
  VerifySoftwareTokenCommand,
  AdminSetUserMFAPreferenceCommand,
  GetUserCommand
} = require('@aws-sdk/client-cognito-identity-provider');

const userPoolId = process.env.CUP_ID;

async function getUser(idp, accessToken) {
  const command = new GetUserCommand({
    AccessToken: accessToken
  });
  const resp = await idp.send(command);
  const respPayload = {
    username: resp.Username,
    id: resp.UserAttributes.find((attr) => attr.Name === 'sub').Value
  };
  return respPayload;
}

async function associateTokenMethod(event) {
  const { auth_token: accessToken } = event.body;
  let resp;

  try {
    const idp = new CognitoIdentityProviderClient();
    const command = new AssociateSoftwareTokenCommand({
      AccessToken: accessToken
    });
    resp = await idp.send(command);
  } catch (e) {
    console.error(e);
    return { error: 'Failed to associate token' };
  }
  return resp;
}

async function setMFAPreferenceMethod(event) {
  const { access_token: accessToken } = event;
  const idp = new CognitoIdentityProviderClient();
  const user = await getUser(idp, accessToken);
  const payload = {
    SoftwareTokenMfaSettings: {
      Enabled: true,
      PreferredMfa: true
    },
    Username: user.username,
    UserPoolId: userPoolId
  };
  const command = new AdminSetUserMFAPreferenceCommand(payload);
  const resp = await idp.send(command);
  return resp;
}

async function verifyTokenMethod(event) {
  const {
    tops_token: topsToken,
    auth_token: accessToken
  } = event.body;
  let resp;

  try {
    const idp = new CognitoIdentityProviderClient();
    const command = new VerifySoftwareTokenCommand({
      AccessToken: accessToken,
      UserCode: topsToken
    });
    resp = await idp.send(command);
  } catch (e) {
    console.error(e);
    return { error: 'Failed to verify token' };
  }
  await setMFAPreferenceMethod({ access_token: accessToken });
  return resp;
}

const operations = {
  associateToken: associateTokenMethod,
  verifyToken: verifyTokenMethod,
  setMFAPreference: setMFAPreferenceMethod
};

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const user = event.context.user_id;
  const operation = operations[event.operation];
  const data = await operation(event, user);
  return data;
}

exports.handler = handler;
