module.exports.model = (path) => ({
  description: 'Assign one or more DAACs to a submission',
  type: 'object',
  properties: {
    id: {
      description: 'UUID of the Submission to assign DAACS',
      $ref: `#${path}UUID`
    },
    daacs: {
      description: 'List of UUIDs of DAACs to assign',
      type: 'array',
      items: { $ref: `#${path}UUID` }
    },
    requires_review: {
      description: 'Whether or not the submission requires additional review by the chosen DAAC',
      type: 'boolean'
    }
  }
});

module.exports.refs = ['UUID'];
