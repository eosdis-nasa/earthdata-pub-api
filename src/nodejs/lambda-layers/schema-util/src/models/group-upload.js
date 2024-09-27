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
        file_category: {
            description: 'Category of the file to be uploaded.',
            type: 'string', 
            enum: ['documentation', 'sample']
        },
        prefix: {
            description: 'Name of the group subfolder if applicable',
            type: 'string', 
        }
    },
    required: [
        'file_type',
        'file_category'
    ]
  });
  
  module.exports.refs = ['UUID'];
