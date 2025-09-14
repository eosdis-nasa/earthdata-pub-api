module.exports.model = (path) => ({
  description: 'Fields for a form with a collection of sections containing questions.',
  type: 'object',
  allOf: [{ $ref: `#${path}Role` }],
  properties: {
    role_privileges: {
      type: 'array',
      items: { type: 'string' }
    }
  }

});

module.exports.refs = ['UUID', 'Role'];
