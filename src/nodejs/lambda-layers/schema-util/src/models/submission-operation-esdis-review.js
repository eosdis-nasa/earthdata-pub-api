module.exports.model = (path) => ({
  description: 'Request body sent for ESDIS review ',
  type: 'object',
  properties: {
    id: {
      description: 'UUID of the Submission on which to execute operation',
      $ref: `#${path}UUID`
    },
    action: {
      description: 'UUID of Workflow to apply to Submission',
      type: 'string',
      enum: ['approve', 'reject', 'reassign']
    }
  }
});

module.exports.refs = ['UUID'];
