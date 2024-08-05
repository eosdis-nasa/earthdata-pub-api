/* ******************************************************************************
*  Lambda for service authentication. Test whether or not service is authorize to
*  modify the desired endpoint based on service id and secret provided.
*
*  Code based from
*  https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html
****************************************************************************** */

const uuid = require('uuid');
const db = require('database-util');

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

const validateAuthentication = async (id, secret, submissionId) => {
  if (!uuid.validate(id)) { return false; }
  const { secret: dbSecret, submission_id: dbSubmissionId } = await db.service.findSecret({ id });
  return (dbSecret === secret && (dbSubmissionId === submissionId));
};

exports.handler = async (event, context, callback) => {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const { headers } = event;
  const auth = (headers.Authorization || headers.authorization || '').split(' ')[1] || '';
  const authStr = Buffer.from(auth, 'base64').toString();
  const splitIndex = authStr.indexOf(':');
  const serviceId = authStr.substring(0, splitIndex);
  const serviceSecret = authStr.substring(splitIndex + 1);
  const submissionId = headers.submissionid || '';

  if (await validateAuthentication(serviceId, serviceSecret, submissionId)) {
    callback(null, generateAllow(`service-authorizer-${serviceId}`, event.methodArn));
  } else {
    callback('Unauthorized');
  }
};
