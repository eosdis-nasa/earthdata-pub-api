module.exports.model = (path) => ({
  description: 'Request body to get a list of users from a list of ids',
  type: 'object',
  properties: {
    ids: {
      type: 'array',
      items: { $ref: `#${path}UUID` }
    }
  }
});

module.exports.refs = ['UUID'];
