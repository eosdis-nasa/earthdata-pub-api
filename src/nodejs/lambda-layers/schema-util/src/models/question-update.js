module.exports.model = (path) => ({
  description: 'Update a question',
  type: 'object',
  properties: {
    short_name: { type: 'string' },
    version: { type: 'number' },
    long_name: { type: 'string' },
    text: { type: 'string' },
    help: { type: 'string' },
    required: { type: 'boolean' },
    created_at: { type: 'string' },
    daac_ids: {
      type: 'array',
      items: {
        $ref: `#${path}UUID`
      }
    }
  }

});

module.exports.refs = ['UUID'];
