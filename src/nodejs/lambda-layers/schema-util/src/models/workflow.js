module.exports.model = (path) => ({
  description: 'A series of steps for processing a Submission',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    short_name: { type: 'string' },
    version: { type: 'number' },
    long_name: { type: 'string' },
    description: { type: 'string' },
    created_at: { type: 'string' }
  }
});

module.exports.refs = ['UUID'];
