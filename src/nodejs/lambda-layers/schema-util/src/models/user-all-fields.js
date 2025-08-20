module.exports.model = (path) => ({
  description: 'A user',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    name: { type: 'string' },
    email: { type: 'string' },
    registered: { type: 'string' },
    last_login: { type: 'string' },
    user_groups: {
      type: 'array',
      items: { $ref: `#${path}Group` }
    }, 
    user_roles: {
      type: 'array',
      items: { $ref: `#${path}Role` }
    }, 
    permissions: {
      type: 'array',
      items: { type: 'string' }
    }, 
    user_privileges: {
      type: 'array',
      items: { type: 'string' }
    },
    subscriptions: { type: 'object' },
    detailed: { type: 'boolean' }
  }
});

module.exports.refs = ['UUID'];
