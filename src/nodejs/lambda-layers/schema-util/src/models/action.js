module.exports.model = (path) => ({
  description: 'An action that can be invoked by a workflow or externally.',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    short_name: { type: 'string' },
    version: { type: 'number' },
    long_name: { type: 'string' },
    description: { type: 'string' },
    source: { type: 'object' },
    created_at: { type: 'string' }
  }
});

module.exports.refs = ['UUID'];
