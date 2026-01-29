module.exports.model = (path) => ({
  description: 'Request body sent to generate a form upload key',
  type: 'object',
  properties: {

    submission_id: {
      description: 'UUID of the Submission the file will be associated with',
      $ref: `#${path}UUID`
    },
    file_name: {
      description: 'Name of the file to be uploaded.',
      type: 'string'
    },
    file_type: {
      description: 'Mime type of file to be uploaded.',
      type: 'string'
    },
    checksum_value: {
      description: 'Checksum value for the file',
      type: 'string'
    },
    file_category: {
      description: 'Category of the file to be uploaded.',
      type: 'string',
      enum: ['documentation', 'sample']
    }
  },
  required: [
    'file_name',
    'file_type',
    'file_category'
  ]
});

module.exports.refs = ['UUID'];
