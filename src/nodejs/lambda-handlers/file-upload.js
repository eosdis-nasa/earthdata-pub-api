const { createPresignedPost } = require('@aws-sdk/s3-presigned-post');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { S3Client, ListObjectsCommand, GetObjectCommand } = require('@aws-sdk/client-s3');

const db = require('database-util');

const ingestBucket = process.env.INGEST_BUCKET;
const region = process.env.REGION;

async function getPutUrlMethod(event, user) {
  const { file_name: fileName, file_type: fileType, checksum_value: checksumValue } = event;
  const checksumAlgo = 'SHA256';
  if (!fileType) return ('invalid file type');
  const s3Client = new S3Client({
    region
  });

  const payload = {
    Bucket: ingestBucket,
    Key: `${user}/${fileName}`,
    Conditions: [
      { 'x-amz-meta-checksumalgorithm': checksumAlgo },
      { 'x-amz-meta-checksumvalue': checksumValue }
    ],
    Fields: {
      'x-amz-meta-checksumalgorithm': checksumAlgo,
      'x-amz-meta-checksumvalue': checksumValue
    },
    Expires: 60
  };

  const resp = await createPresignedPost(s3Client, payload);
  return (resp);
}

async function listFilesMethod(event, user) {
  const { submission_id: submissionId } = event;
  const userInfo = await db.user.findById({ id: user });
  const groupIds = userInfo.user_groups.map((group) => group.id);
  const userDaacs = (await db.daac.getIds({ group_ids: groupIds }))
    .map((daac) => daac.id);
  const {
    daac_id: daacId,
    contributor_ids: contributorIds
  } = await db.submission.findById({ id: submissionId });
  if (contributorIds.includes(user)
    || userInfo.user_privileges.includes('ADMIN')
    || userDaacs.includes(daacId)
  ) {
    const s3Client = new S3Client({ region });
    const command = new ListObjectsCommand({ Bucket: ingestBucket, Prefix: `${daacId}/${submissionId}` });
    const rawResponse = await s3Client.send(command);
    const response = rawResponse.Contents.map((item) => ({
      key: item.Key,
      size: item.Size,
      last_modified: item.LastModified,
      file_name: item.Key.split('/').pop()
    }));
    return response;
  }
  return ({ error: 'Not Authorized' });
}

async function getDownloadUrlMethod(event, user) {
  console.log(event);
  const { key } = event;
  const s3Client = new S3Client({
    region
  });

  const submissionId = key.split('/')[1];
  const userInfo = await db.user.findById({ id: user });
  const groupIds = userInfo.user_groups.map((group) => group.id);
  const userDaacs = (await db.daac.getIds({ group_ids: groupIds }))
    .map((daac) => daac.id);
  const {
    daac_id: daacId,
    contributor_ids: contributorIds
  } = await db.submission.findById({ id: submissionId });

  if (contributorIds.includes(user)
    || userInfo.user_privileges.includes('ADMIN')
    || userDaacs.includes(daacId)
  ){
    const payload = {
      Bucket: ingestBucket,
      Key: key,
    }
    try{
      const command  = new GetObjectCommand(payload);
      return getSignedUrl(s3Client, command, { expiresIn: 60 });
    } catch (err) {
      console.log(err);
      return ({ error: 'Failed to upload' });
    }
    
  }
  return ({ error: 'Not Authorized' });
}

const operations = {
  getPutUrl: getPutUrlMethod,
  listFiles: listFilesMethod,
  getDownloadUrl: getDownloadUrlMethod
};

async function handler(event) {
  return { error: 'Not Implemented' };
  /* eslint-disable no-unreachable */
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const user = event.context.user_id;
  const operation = operations[event.operation];
  const data = await operation(event, user);
  return data;
  /* eslint-enable no-unreachable */
}

exports.handler = handler;
