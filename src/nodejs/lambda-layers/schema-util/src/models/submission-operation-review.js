module.exports.model = (path) => ({
  description: 'Request body sent for review ',
  type: 'object',
  properties: {
    id: {
      description: 'UUID of the Submission on which to execute operation',
      $ref: `#${path}UUID`
    },
    approve: {
      description: 'Boolean value indicating user\'s decision to approve or not',
      type: 'boolean'
    }
  }
});

module.exports.refs = ['UUID'];