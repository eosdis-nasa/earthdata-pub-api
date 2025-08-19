module.exports.model = (path) => ({
  description: 'Request body sent for removing a contributor from a submission',
  type: 'object',
  properties: {
    id: {
      description: 'UUID of the Submission on which to execute operation',
      $ref: `#${path}UUID`
    },
    contributor_id: {
      description: 'UUID for the contributor to be removed from the submission',
      $ref: `#${path}UUID`
    }
  }
});

module.exports.refs = ['UUID'];