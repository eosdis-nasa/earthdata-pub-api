module.exports.model = (path) => ({
  description: 'Basic information for a DAAC.',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    short_name: { type: 'string' },
    long_name: { type: 'string' },
    url: { type: 'string' },
    description: { type: 'string' }
  }
});

module.exports.refs = ['UUID'];
