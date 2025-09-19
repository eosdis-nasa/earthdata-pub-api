module.exports.model = (path) => ({
  description: 'Response from the upload_step table',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    step_name: { type: 'string' },
    upload_destination: { type: 'string' },
    category_type: { type: 'string' },
    help_text: { type: 'string' }
  }
});

module.exports.refs = ['UUID'];
