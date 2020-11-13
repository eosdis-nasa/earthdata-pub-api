module.exports.model = (path) => ({
  description: 'A group of users with common privileges.',
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
