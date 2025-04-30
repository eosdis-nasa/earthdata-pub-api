module.exports.model = (path) => ({
  description: 'Request body sent to upload',
  type: 'object',
  allOf: [{ $ref: `#${path}Upload` }],
  properties: {
    destination: {
        description: 'Location to upload files for this step',
        type: 'string', 
    }
  },
  required: [
      'submission_id',
      'file_name',
      'file_type',
      'file_category',
      'destination'
  ]
});

module.exports.refs = ['UUID'];