/**
 * Lambda to update request templates in the api after redeploying the overview,
 * dashboard, and/or forms apps
 * @module ImageTest
 */

const { S3, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const region = process.env.REGION;

const s3 = new S3({ region });

async function handler() {
  const payload = {
    Bucket: process.env.DASHBOARD_BUCKET,
    Key: 'images/app/src/assets/images/nasa_test.jpg'
  };

  const command = new GetObjectCommand(payload);
  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60*60 });
  return signedUrl;
}

module.exports.handler = handler;
