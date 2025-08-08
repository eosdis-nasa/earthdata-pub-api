module.exports.model = (path) => ({
  description: 'An external service connected with the EDPUB API.',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    short_name: { type: 'string' },
    long_name: { type: 'string'},
    description: { type: 'string' },
    endpoint: { type: 'string' },
    options: { type: 'object' },
    headers: { type: 'object' },
    method: { type: 'string' },
    code: { type: 'number' },
    payload: { type: 'boolean' }
  }
});

module.exports.refs = ['UUID'];
