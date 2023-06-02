const {  S3Client } = require('@aws-sdk/client-s3');
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

const ingestBucket = process.env.INGEST_BUCKET;
const region = process.env.REGION;

async function getPutUrlMethod(event, user) {
  const { file_name: fileName, file_type: fileType, checksum_value: checksumValue } = event;
  const checksumAlgo = 'SHA256';
  if (!fileType) return ('invalid file type');
  const s3Client = new S3Client({
    region
  });

  Conditions = [
    { 'x-amz-meta-checksumalgorithm': checksumAlgo },
    { 'x-amz-meta-checksumvalue': checksumValue}
  ];

  const resp =  await createPresignedPost(s3Client, {
    Bucket: ingestBucket,
    key: fileName,
    Conditions,
    Fields: {
      'x-amz-meta-checksumalgorithm': checksumAlgo,
      'x-amz-meta-checksumvalue': checksumValue
    },
    Expires: 60
  });

  return (resp);
}

const operations = {
  getPutUrl: getPutUrlMethod
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
