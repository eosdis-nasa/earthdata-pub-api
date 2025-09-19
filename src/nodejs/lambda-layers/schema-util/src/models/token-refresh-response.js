module.exports.model = (path) => ({
  description: 'Response from a token refresh',
  type: 'object',
  properties: {
    token: { type: 'string' },
    user: {
      type: 'object',
      allOf: [{ $ref: `#${path}UserAllFields` }]
    }
  }
});

module.exports.refs = ['UserAllFields'];
