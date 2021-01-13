module.exports.model = (path) => ({
  description: 'The subscription table schema',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    action_id: { $ref: `#${path}UUID` },
    daac_id: { $ref: `#${path}UUID` },
    submission_id: { $ref: `#${path}UUID` },
    workflow_id: { $ref: `#${path}UUID` }
  }
});

module.exports.refs = ['UUID'];
