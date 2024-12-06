const { S3, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const region = process.env.REGION;

const s3 = new S3({ region });

async function handler() {
  try {
    const payload = {
      Bucket: process.env.DASHBOARD_BUCKET,
      Key: 'images/app/src/assets/images/nasa_test.jpg'
    };

    const command = new GetObjectCommand(payload);

    // Generate the signed URL
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 60 });

    // Return the signed URL wrapped in a JSON object
    return {
      status: 'success',
      url: signedUrl
    };
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return {
      status: 'error',
      message: 'Failed to generate signed URL',
      error: error.message
    };
  }
}

module.exports.handler = handler;
