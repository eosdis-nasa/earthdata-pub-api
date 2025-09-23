module.exports.model = (path) => ({
  description: 'Request body sent to attachment upload',
  type: 'object',
  properties: {
    conversation_id: {
      description: 'UUID of the conversation the file will be associated with',
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
    }
  }
});

module.exports.refs = ['UUID'];
