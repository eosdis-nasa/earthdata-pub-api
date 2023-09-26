import {
    CognitoIdentityProviderClient,
    AssociateSoftwareTokenCommand,
    VerifySoftwareTokenCommand,
    AdminSetUserMFAPreferenceCommand
} from '@aws-sdk/client-cognito-identity-provider'

const userPoolId = process.env.CUP_ID;

async function getUser(idp, accessToken){
    const command = new GetUserCommand({
        AccessToken: accessToken
    })
    const resp = await idp.send(command)
    return resp.Username
}

async function associateTokenMethod(event){

    const {access_token:accessToken} = event
    let resp
    
    try{
        const idp = new CognitoIdentityProviderClient()
        const command = new AssociateSoftwareTokenCommand({
            AccessToken:accessToken
        })
        resp = await idp.send(command)
    } catch(e){
        console.error(e)
        return{error:'Failed to associate token'}
    }
    return resp

}

async function verifyTokenMethod(event){
    const {
        tops_token: topsToken,
        access_token: accessToken
    } = event
    let resp

    try{
        const idp = new CognitoIdentityProviderClient()
        const command = new VerifySoftwareTokenCommand({
            AccessToken: accessToken,
            UserCode: topsToken
        })
        resp = new idp.send(command)
    }catch(e){
        console.error(e)
        return{error:'Failed to verify token'}
    }

    return resp
}

async function setMFAPreferenceMethod (event){
    const {access_token: accessToken} = event
    const idp = new CognitoIdentityProviderClient()
    const username = await getUser(idp, accessToken)
    const payload = {
        SoftwareTokenMfaSettings:{
            Enabled: true,
            PreferredMfa: true
        },
        Username: username,
        UserPoolId: userPoolId
    }
    const command = new AdminSetUserMFAPreferenceCommand(payload)
    const resp = await idp.send(command)
    return resp
}

const operations = {
    associateToken, associateTokenMethod,
    verifyToken, verifyTokenMethod,
    setMFAPreference, setMFAPreferenceMethod
  };

async function handler(event) {
    console.info(`[EVENT]\n${JSON.stringify(event)}`);
    const user = event.context.user_id;
    const operation = operations[event.operation];
    const data = await operation(event, user);
    return data;
  }
  
  exports.handler = handler;