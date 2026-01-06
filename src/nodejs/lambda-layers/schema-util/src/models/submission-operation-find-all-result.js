module.exports.model = (path) => ({
  description: 'Submission information as returned from the submission table',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    name: { type: 'string' },
    conversation_id: { $ref: `#${path}UUID` },
    workflow_id: { $ref: `#${path}UUID` },
    workflow_name: { type: 'string' },
    daac_name: { type: 'string' },
    step_name: { type: 'string' },
    status: { type: 'string' },
    created_at: { type: 'string' },
    last_change: { type: 'string' },
    hidden: { type: 'boolean' },
    contributor_ids: {
      type: 'array',
      items: { $ref: `#${path}UUID` }
    }
  }
});

module.exports.refs = ['UUID'];
