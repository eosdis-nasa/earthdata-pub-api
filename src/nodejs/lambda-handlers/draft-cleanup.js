const { S3Client, PutBucketLifecycleConfigurationCommand } = require('@aws-sdk/client-s3');

const ingestBucket = process.env.INGEST_BUCKET;
const region = process.env.REGION;
const s3Client = new S3Client({ region });

// Define the bucket name and lifecycle configuration
const lifecycleConfiguration = {
  Rules: [
    {
      ID: 'CleanupDrafts',
      Filter: {
        Prefix: 'drafts/'
      },
      Status: 'Enabled',
      Expiration: {
        Days: 7
      }
    }
  ]
};

// Function to set the lifecycle policy
async function setLifecyclePolicy() {
  try {
    const command = new PutBucketLifecycleConfigurationCommand({
      Bucket: ingestBucket,
      LifecycleConfiguration: { Rules: lifecycleConfiguration.Rules }
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('Error setting lifecycle policy:', error);
  }
}

async function handler() {
  await setLifecyclePolicy();
  return { statusCode: 200 };
}

module.exports.handler = handler;
