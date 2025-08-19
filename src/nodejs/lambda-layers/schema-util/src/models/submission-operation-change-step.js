module.exports.model = (path) => ({
  description: 'Request body sent for changing the current workflow step of a submission',
  type: 'object',
  properties: {
    id: {
      description: 'UUID of the Submission on which to execute operation',
      $ref: `#${path}UUID`
    },
    step_name: {
      description: 'Name of the workflow step to change to',
      type: 'string'
    }
  }
});

module.exports.refs = ['UUID'];