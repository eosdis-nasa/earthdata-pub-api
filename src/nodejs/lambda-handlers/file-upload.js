const { S3Client, ListObjectsCommand } = require('@aws-sdk/client-s3');
const { createPresignedPost } = require('@aws-sdk/s3-presigned-post');

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

  const Conditions = [
    { 'x-amz-meta-checksumalgorithm': checksumAlgo },
    { 'x-amz-meta-checksumvalue': checksumValue }
  ];

  const resp = await createPresignedPost(s3Client, {
    Bucket: ingestBucket,
    key: `${user}/${fileName}`,
    Conditions,
    Fields: {
      'x-amz-meta-checksumalgorithm': checksumAlgo,
      'x-amz-meta-checksumvalue': checksumValue
    },
    Expires: 60
  });

  return (resp);
}

async function listFilesMethod(event, user) {
  const { submission_id: submissionId } = event;
  const userInfo = await db.user.findById({ id: user });
  const {
    daac_id: daacId,
    contributor_ids: contributorIds
  } = await db.submission.findById({ id: submissionId });
  // eslint-disable-next-line
  if (contributorIds.includes(user)
    || userInfo.user_privileges.includes('ADMIN')
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
    // eslint-disable-next-line
    console.log(response);
    return response;
  }
  return ({ error: 'Not Authorized' });
}

const operations = {
  getPutUrl: getPutUrlMethod,
  listFiles: listFilesMethod
};

async function handler(event) {
  // return { error: 'Not Implemented' };
  /* eslint-disable no-unreachable */
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const user = event.context.user_id;
  const operation = operations[event.operation];
  const data = await operation(event, user);
  return data;
  /* eslint-enable no-unreachable */
}

exports.handler = handler;
