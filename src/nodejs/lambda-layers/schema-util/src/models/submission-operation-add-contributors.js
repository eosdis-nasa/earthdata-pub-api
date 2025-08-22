module.exports.model = (path) => ({
  description: 'Request body sent for adding contributors to a submission',
  type: 'object',
  properties: {
    id: {
      description: 'UUID of the Submission on which to execute operation',
      $ref: `#${path}UUID`
    },
    contributor_ids: {
      description: 'List of UUIDs for the contributors to add to the submission',
      type: 'array',
      items: { $ref: `#${path}UUID` }
    }
  }
});

module.exports.refs = ['UUID'];
