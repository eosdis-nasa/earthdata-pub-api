module.exports.model = (path) => ({
  description: 'A template for a form with a collection of sections containing questions.',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    short_name: { type: 'string' },
    version: { type: 'number' },
    long_name: { type: 'string' },
    description: { type: 'string' },
    daac_only: { type: 'boolean' },
    created_at: { type: 'string' }
  }
});

module.exports.refs = ['UUID'];
