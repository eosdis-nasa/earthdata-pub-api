import { S3 } from '@aws-sdk/client-s3'; // Using ES Modules syntax

// Initialize S3 client
const s3 = new S3({
  region: 'us-west-2'
});

export default async function handler() {
  try {
    const bucketName = 'earthdatapub-dashboard-sit';
    const fileKey = 'images/app/src/assets/images/nasa_test.jpg';

    const params = {
      Bucket: bucketName,
      Key: fileKey
    };

    const file = await s3.getObject(params);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'File fetched successfully.',
        fileContent: file.Body.toString('base64') // Base64 encoded content
      })
    };
  } catch (error) {
    console.error('Error fetching file from S3', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch the file from S3.', details: error.message })
    };
  }
}
