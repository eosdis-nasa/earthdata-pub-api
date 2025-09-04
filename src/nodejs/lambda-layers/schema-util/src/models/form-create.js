module.exports.model = (path) => ({
  description: 'A template for creating a form.',
  type: 'object',
  properties: {
    short_name: { type: 'string' },
    version: { type: 'number' },
    long_name: { type: 'string' },
    description: { type: 'string' },
    daac_only: { type: 'boolean' },
  }
});

module.exports.refs = ['UUID'];