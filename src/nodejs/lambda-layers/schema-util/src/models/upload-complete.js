module.exports.model = (path) => ({
  description: 'Request body sent to complete a single or multipart upload.',
  type: 'object',
  properties: {
    file_name: {
      description: 'Name of the file to which has been uploaded.',
      type: 'string'
    },
    checksum_value: {
      description: 'Checksum value of the file which was uploaded.',
      type: 'string'
    },
    file_size_bytes: {
      description: 'Size of the file uploaded in bytes.',
      type: 'number'
    },
    collection_path: {
      description: 'The key prefix used for staging the uploaded file in S3.',
      type: 'string'
    },
    file_id: {
      description: 'The UUID assigned as the CUE identifier for the file when the upload was originally prepared.',
      $ref: `#${path}UUID`
    },
    upload_id: {
      description: 'The identifier assigned to a multipart upload by AWS S3.',
      type: 'string'
    },
    etags: {
      description: 'An array of objects describing the various parts of an upload. If only one etag is present, the API assumes this was a single part upload.',
      type: 'array',
      minProperties: 1,
      items: {
        type: 'object',
        properties: {
          PartNumber: {
            description: 'The part number assigned to this multi-part upload part by AWS S3. If a single part upload, this value is not used by the API.',
            type: 'number'
          },
          ETag: {
            description: 'The etag value assigned to this multi-part upload part by AWS S3. If a single part upload, the single part upload should be added here as the first and only entry'
          }
        },
        required: ['PartNumber', 'Etag']
      }
    },
    content_type: {
      description: 'Media type describing the nature and format of the file.',
      type: 'string'
    }
  },
  required: [
    'file_id',
    'etags',
    'file_name',
    'collection_path',
    'content_type',
    'checksum',
    'file_size_bytes'
  ]
});

module.exports.refs = ['UUID'];
