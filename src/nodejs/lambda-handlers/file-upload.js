const { fromCognitoIdentityPool } = require('@aws-sdk/credential-providers');
const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const db = require('database-util');

const userPoolId = process.env.CUP_ID;
const ingestBucket = process.env.INGEST_BUCKET;
const region = process.env.REGION;

async function getPutUrlMethod(event, user) {
  const approvedUserPrivileges = ['ADMIN'];
  if (user.user_privileges.some((privilege) => approvedUserPrivileges.includes(privilege))) {
    const { file_name: fileName, file_type: fileType/* , checksum_value: checksumValue */ } = event;
    // const checksumAlgo = 'MD5';
    if (!fileType) return ('invalid file type');
    const s3Client = new S3Client({
      region,
      credentials: await fromCognitoIdentityPool({
        identityPoolId: userPoolId,
        userIdentifier: user.id,
        region
      })
    });
    const command = new PutObjectCommand({ Bucket: ingestBucket, Key: `${user.id}/${fileName}`, ContentType: fileType });
    return ({ url: getSignedUrl(s3Client, command, { expiresIn: 60 }) });
  }
  return ({ error: 'error' });
}

const operations = {
  getPutUrl: getPutUrlMethod
};

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const user = await db.user.findById({ id: event.context.user_id });
  const operation = operations[event.operation];
  const data = await operation(event, user);
  return data;
}

exports.handler = handler;
