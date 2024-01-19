module.exports.model = (path) => ({
  description: 'A user',
  type: 'object',
  properties: {
    id: {
      $ref: `#${path}UUID`
    },
    user_name: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    roles: {
      type: 'array',
      items: { $ref: `#${path}Role` }
    },
    groups: {
      type: 'array',
      items: { $ref: `#${path}Group` }
    }
  }
});

module.exports.refs = ['UUID'];
