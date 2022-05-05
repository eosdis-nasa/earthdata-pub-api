/*******************************************************************************
* Lambda for service authentication. Test whether or not service is authorize to 
* modify the desired endpoint based on service id and secret provided.
*
* Code based from
* https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html
*******************************************************************************/

const uuid = require('uuid');
const db = require('database-util');

var generatePolicy = function(principalId, effect, resource) {
    // Required output:
    var authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17'; // default version
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; // default action
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    return authResponse;
};
     
var generateAllow = function(principalId, resource) {
    return generatePolicy(principalId, 'Allow', resource);
};

var validateAuthentication = async function(id, secret) {
    if (!uuid.validate(id)) {return false;}
    const db_secret = await db.service.findSecret(id);
    return db_secret === secret;
};

exports.handler = function(event, context, callback) {        
    console.log('Received event:', JSON.stringify(event, null, 2));

    var headers = event.headers;
    const serviceId = headers.serviceId || headers.serviceid || '';
    const serviceSecret = headers.serviceSecret || headers.servicesecret || '';
     
    if (validateAuthentication(serviceId, serviceSecret)) {
        callback(null, generateAllow('me', event.methodArn));
    }  else {
        callback("Unauthorized");
    }
};