import { S3 } from '@aws-sdk/client-s3'; // Using ES Modules syntax

// Initialize S3 client
const s3 = new S3({
  region: 'us-west-2', // Replace with your region
});

export const handler = async (event) => {
  try {
    // Define the S3 bucket name and the file key (exact file path)
    const bucketName = 'earthdatapub-dashboard-sit';  
    const fileKey = 'images/app/src/assets/images/nasa_test.jpg';  // Full file path
    
    // Get the object from S3
    const params = {
      Bucket: bucketName,
      Key: fileKey,  // Full file key (path)
    };

    // Fetch the file from S3
    const file = await s3.getObject(params);

    // Log basic details about the file (excluding the content)
    console.log("File retrieved successfully from S3:");
    console.log(`File: ${fileKey}`);
    console.log(`Content Type: ${file.ContentType}`);
    console.log(`Content Length: ${file.ContentLength} bytes`);

    // Optionally, log a small part of the file content for debugging (not the entire file)
    // Do not log large binary content, it's better to log small metadata.
    console.log(`File Content Preview (first 100 bytes):`, file.Body.slice(0, 100).toString('utf-8'));

    // Return the file content as base64 (or you could return it directly as an image in your response)
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'File fetched successfully.',
        fileContent: file.Body.toString('base64'), // Base64 encoded content
      }),
    };
  } catch (error) {
    console.error("Error fetching file from S3", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch the file from S3.', details: error.message }),
    };
  }
};
