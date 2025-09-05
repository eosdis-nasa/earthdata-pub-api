module.exports.model = (path) => ({
  description: 'Request body to send to create a user',
  type: 'object',
  properties: {
    email: { type: 'string' },
    name: { type: 'string' },
    username: { type: 'string' },
    role_ids: {
      type: 'array',
      items: { $ref: `#${path}UUID` }
    },
    group_ids: {
      type: 'array',
      items: { $ref: `#${path}UUID` }
    },
    detailed: { type: 'boolean' }
  }
});

module.exports.refs = ['UUID'];
