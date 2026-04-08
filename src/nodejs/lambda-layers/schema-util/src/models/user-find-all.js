module.exports.model = (path) => ({
  description: 'Response from the user findAll query',
  type: 'object',
  allOf: [{ $ref: `#${path}User` }],
  properties: {
    user_groups: {
      type: 'array',
      items: { type: 'string' }
    },
    user_roles: {
      type: 'array',
      items: { type: 'string' }
    }
  }
});

module.exports.refs = ['UUID'];
