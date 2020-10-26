module.exports.model = (path) => {
  return {
    description: 'A group of users with common privileges.',
    type: 'object',
    properties: {
      id: {
        $ref: `#${path}UUID`
      },
      group_name: {
        type: 'string'
      }
    }
  }
}

module.exports.refs = ['UUID'];
