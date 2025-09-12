module.exports.model = (path) => ({
  description: 'Request body to sent to update the name field for a user',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    name: { type: 'string' }
  }
});

module.exports.refs = ['UUID'];
