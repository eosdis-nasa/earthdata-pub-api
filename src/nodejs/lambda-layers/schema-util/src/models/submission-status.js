module.exports.model = (path) => ({
  description: 'Information returned from the submission_status table',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    workflow_id: { $ref: `#${path}UUID` },
    step_name: { type: 'string' },
    last_change: { type: 'string' }
  }
});

module.exports.refs = ['UUID'];
