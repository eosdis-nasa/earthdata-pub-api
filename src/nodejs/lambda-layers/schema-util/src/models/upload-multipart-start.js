module.exports.model = (path) => ({
    description: 'Request body sent to start a  multipart upload.',
    type: 'object',
    properties: {
        file_name: {
            description: 'Name of the file to which has been uploaded.',
            type: 'string'
        },
        content_type: {
            description: 'Media type describing the nature and format of the file.',
            type: 'string'
        },
        collection_path: {
            description: 'The key prefix used for staging the uploaded file in S3.',
            type: 'string'
        }
    },
    required: [
        'file_name',
        'content_type',
        'collection_path',
    ]
  });