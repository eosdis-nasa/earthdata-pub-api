const { fromCognitoIdentityPool } = require("@aws-sdk/credential-providers");
const {PutObjectCommand, S3Client} = require('@aws-sdk/client-s3');

const userPoolId = process.env.CUP_ID;
const ingestBucket = process.env.INJEST_BUCKET

async function getPutUrlMethod(event, user){
    const approvedUserPrivileges = ['ADMIN', 'REQUEST_REMOVEUSER'];
    if (user.user_privileges.some((privilege) => approvedUserPrivileges.includes(privilege))) {
        const s3Client = new S3Client({
            region:"us-west-2",
            credentials: await fromCognitoIdentityPool({
                identityPoolId:userPoolId,
                userIdentifier: user.id,
                region: "us-west-2"
            })
        });
        const command = new PutObjectCommand({Bucket: ingestBucket, Key: `unsanitized/${payload}`});
        return getSignedUrl(s3Client, command, {expiresIn: 60});
    }
}

const operations = {
    getPutUrl : getPutUrlMethod
  };

async function handler(event) {
    console.info(`[EVENT]\n${JSON.stringify(event)}`);
    const user = await db.user.findById({ id: event.context.user_id });
    const operation = operations[event.operation];
    const data = await operation(event, user);
    return data;
}

exports.handler = handler;