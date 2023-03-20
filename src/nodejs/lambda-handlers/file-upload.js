// const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');
const AWS = require('@aws-sdk');
// const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const ingestBucket = process.env.INGEST_BUCKET;
// const region = process.env.REGION;

async function getPutUrlMethod(event, user) {
  const { file_name: fileName, file_type: fileType, checksum_value: checksumValue } = event;
  const checksumAlgo = 'sha256';
  if (!fileType) return ('invalid file type');
  const s3Client = new AWS.S3({
    signatureVersion: 'v4'
  });
  const params = {
    Bucket: ingestBucket,
    Key: `${user}/${fileName}`,
    ContentType: fileType,
    Metadata: {
      'file-id': fileName,
      checksum: checksumValue,
      'checksum-algorithm': checksumAlgo
    },
    ChecksumSHA256: checksumValue
  };

  const genUrl = s3Client.getSignedUrl('putOb', params, {
    expiresIn: 60,
    unhoistableHeaders: new Set(['x-amz-sdk-checksum-algorithm', 'x-amz-checksum-sha256'])
  });
  return ({ url: genUrl });
}

const operations = {
  getPutUrl: getPutUrlMethod
};

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const user = event.context.user_id;
  const operation = operations[event.operation];
  const data = await operation(event, user);
  return data;
}

exports.handler = handler;
