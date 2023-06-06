const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const db = require('database-util');

const ingestBucket = process.env.INGEST_BUCKET;
const region = process.env.REGION;

async function getPutUrlMethod(event, user) {
  const { file_name: fileName, file_type: fileType, checksum_value: checksumValue } = event;
  const checksumAlgo = 'MD5';
  if (!fileType) return ('invalid file type');
  const s3Client = new S3Client({
    region
  });
  const command = new PutObjectCommand({
    Bucket: ingestBucket,
    Key: `${user}/${fileName}`,
    ContentType: fileType,
    Metadata: {
      'file-id': fileName,
      checksum: checksumValue,
      'checksum-algorithm': checksumAlgo
    }
  });

  const genUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 60
  });
  return ({ url: genUrl });
}

async function listFilesMethod(event, user) {
  const { submission_id: submissionId } = event;
  const userInfo = await db.user.findById({ id: user });
  const {daac_id: daacId, contributor_ids: contributorIds} = await db.submission.findById({id: submissionId});
  console.log(userInfo);
  // if(contributorIds.includes(user) ||
  //   userInfo.user_privileges.includes('ADMIN')
  //   ){
  //   const s3Client = new S3Client({region});
  //   const command = new ListObjectsCommand({Bucket: ingestBucket, Prefix: `${daacId}/${submissionId}`});
  //   const rawResponse = await s3Client.send(command); 
  //   const response = rawResponse.Contents.map((item) => {
  //     return {
  //       key: item.key, 
  //       size:item.size, 
  //       last_modified: item.lastModified,
  //       file_name: item.key.split('/').pop(),
  //     };
  //   })
  //   return response;
  // }

}

const operations = {
  getPutUrl: getPutUrlMethod,
  listFiles: listFilesMethod,
};

async function handler(event) {
  //return { error: 'Not Implemented' };
  /* eslint-disable no-unreachable */
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const user = event.context.user_id;
  const operation = operations[event.operation];
  const data = await operation(event, user);
  return data;
  /* eslint-enable no-unreachable */
}

exports.handler = handler;
