const { createPresignedPost } = require('@aws-sdk/s3-presigned-post');
const { S3Client } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

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

async function getDownloadUrlMethod(event, user) {
  const { key } = event;
  const s3Client = new S3Client({
    region
  });

  const payload = {
    Bucket: ingestBucket,
    key: Key,
  }
  const command  = new GetObjectCommand(payload);
  return getSignedUrl(s3Client, command, { expiresIn: 60 });
}

const operations = {
  getPutUrl: getPutUrlMethod,
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
