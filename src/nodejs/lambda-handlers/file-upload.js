const { createPresignedPost } = require('@aws-sdk/s3-presigned-post');
const { S3Client } = require('@aws-sdk/client-s3');

const db = require('database-util');

const ingestBucket = process.env.INGEST_BUCKET;
const region = process.env.REGION;

async function generateUploadUrl(params) {
  const { key, checksumValue, fileType } = params;
  const checksumAlgo = 'SHA256';
  if (!fileType) return ('invalid file type');
  const s3Client = new S3Client({
    region
  });

  const payload = {
    Bucket: ingestBucket,
    Key: key,
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

async function getPostUrlMethod(event, user) {
  const { file_name: fileName, file_type: fileType, checksum_value: checksumValue } = event;
  const { submission_id: submissionId } = event;
  const userInfo = await db.user.findById({ id: user });
  const groupIds = userInfo.user_groups.map((group) => group.id);

  if (submissionId) {
    const {
      daac_id: daacId,
      contributor_ids: contributorIds
    } = await db.submission.findById({ id: submissionId });
    const userDaacs = (await db.daac.getIds({ group_ids: groupIds }))
      .map((daac) => daac.id);

    if (contributorIds.includes(user)
      || userInfo.user_privileges.includes('ADMIN')
      || userDaacs.includes(daacId)
    ) {
      return generateUploadUrl({
        key: `${daacId}/${submissionId}/${user}/${fileName}`,
        checksumValue,
        fileType
      });
    }
  }
  return generateUploadUrl({
    key: `${user}/${fileName}`,
    checksumValue,
    fileType
  });
}

const operations = {
  getPostUrl: getPostUrlMethod
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
