module.exports.model = (path) => ({
  description: 'Request response from getting a list of users',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: { $ref: `#${path}UUID` },
      name: { type: 'string' }
    }

  }
});

module.exports.refs = ['UUID'];
