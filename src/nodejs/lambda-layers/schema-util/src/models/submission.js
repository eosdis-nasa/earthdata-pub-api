module.exports.model = (path) => ({
  description: 'An archival request submission.',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    conversation_id: { $ref: `#${path}UUID` },
    workflow_id: { $ref: `#${path}UUID` },
    workflow_name: { type: 'string' },
    daac_id: { type: 'string' },
    step_name: { type: 'string' },
    step: { type: 'string' },
    created_at: { type: 'string' },
    last_change: { type: 'string' },
    metadata: { type: 'object' },
    action_data: { type: 'object' },
    form_data: { type: 'object' },
    lock: { type: 'boolean' }
  }
});

module.exports.refs = ['UUID'];
