module.exports.model = (path) => ({
  description: 'Request body sent to an endpoint.',
  type: 'object',
  properties: {
    id: {
      description: 'UUID of the entity on which to execute operation',
      $ref: `#${path}UUID`
    }
  }
});

module.exports.refs = ['UUID'];
