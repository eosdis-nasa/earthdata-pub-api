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
    }
  }
});

module.exports.refs = ['UUID'];
