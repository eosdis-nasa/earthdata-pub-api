module.exports.model = (path) => ({
    description: 'Request body sent to upload',
    type: 'object',
    properties: {

        file_name: {
            description: 'Name of the file to be uploaded.',
            type: 'string'
        },
        file_type: {
            description: 'Mime type of file to be uploaded.',
            type: 'string',
        },
        checksum_value: {
            description: 'Checksum value for the file',
            type: 'string',
        },
        prefix: {
            description: 'Name of the group subfolder if applicable',
            type: 'string', 
        },
        group_id: {
            description: 'UUID of the group the file will be associated with',
            $ref: `#${path}UUID` 
        }
    },
    required: [
        'file_type',
    ]
  });

  module.exports.refs = ['UUID'];