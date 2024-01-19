module.exports.model = (path) => ({
  description: 'A user role describing actions and views available to a user.',
  type: 'object',
  properties: {
    id: {
      $ref: `#${path}UUID`
    },
    short_name: {
      type: 'string'
    },
    long_name: {
      type: 'string'
    },
    description: {
      type: 'string'
    }
  }
});

module.exports.refs = ['UUID'];
