module.exports.model = () => ({
  description: 'Temp upload file response',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      file_id: { type: 'string' },
      submission_id: { type: 'string' },
      file_name: { type: 'string' },
      category: { type: 'string' },
      size: { type: 'number' },
      lastmodified: { type: 'string' },
      status: { type: 'string' }
    }
  }
});

module.exports.refs = ['UUID'];