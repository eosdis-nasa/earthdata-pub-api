module.exports.model = (path) => ({
  description: 'Response from the user findAll query',
  type: 'object',
  allOf: [{ $ref: `#${path}User` }],
  properties: {
    group_ids: {
      type: 'array',
      items: {
        $ref: `#${path}UUID`
      }
    },
    role_ids: {
      type: 'array',
      items: {
        $ref: `#${path}UUID`
      }
    }
  }
});

module.exports.refs = ['UUID'];
