module.exports.model = (path) => ({
  description: 'An individual permission to an entity.',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    action_id: { $ref: `#${path}UUID` },
    daac_id: { $ref: `#${path}UUID` },
    form_id: { $ref: `#${path}UUID` },
    question_id: { $ref: `#${path}UUID` },
    submission_id: { $ref: `#${path}UUID` },
    workflow_id: { $ref: `#${path}UUID` }
  }
});

module.exports.refs = ['UUID'];
