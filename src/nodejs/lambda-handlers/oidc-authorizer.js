/*
* OIDC Authorizer lambda used to validate token against authentication provider
*
* Implementation based on
* https://github.com/aws-samples/lambda-authorizer-oidc-adapter/blob/main/resources/lambda/lambda-auth.js
*
*/

const providerUrl = process.env.AUTH_PROVIDER_URL;
const introspectionPath = process.env.AUTH_INTROSPECT_PATH;

const clientId = process.env.AUTH_CLIENT_ID;
const clientSecret = process.env.AUTH_CLIENT_SECRET;

function encodeBase64(data) {
  return Buffer.from(data).toString('base64');
}

const validateAuthentication = async (token) => {
  const basicAuth = encodeBase64(`${clientId}:${clientSecret}`);
  const response = await fetch(`${providerUrl}${introspectionPath}`, {
    method: 'POST',
    headers: { Authorization: `Basic ${basicAuth}` },
    body: new URLSearchParams({ token })
  });
  const responseText = await response.text();
  try {
    return JSON.parse(responseText);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`Invalid JSON response: ${responseText}`);
    return { active: false };
  }
};

const generatePolicy = (principalId, effect, resource) => {
  // Required output:
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17'; // default version
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke'; // default action
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

const generateAllow = (principalId, resource) => generatePolicy(principalId, 'Allow', resource);

exports.handler = async (event, context, callback) => {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const { headers } = event;
  const accessToken = (headers.Authorization || headers.authorization || '').split(' ')[1] || '';

  const userInfo = await validateAuthentication(accessToken);

  if (userInfo.active) {
    callback(null, generateAllow('oidc-authorizer', event.methodArn));
  } else {
    callback('Unauthorized');
  }
};
