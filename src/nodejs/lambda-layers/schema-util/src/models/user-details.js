module.exports.model = (path) => ({
  description: 'A user',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    name: { type: 'string' },
    email: { type: 'string' },
    extension: { type: 'string' },
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