module.exports.model = (path) => {
  return {
    description: 'An archival request submission.',
    type: 'object',
    properties: {
      id: { $ref: `#${path}UUID` },
      workflow_id: { $ref: `#${path}UUID` },
      workflow_name: { type: 'string' },
      step_name: { type: 'string' },
      step: { type: 'string' },
      form_data: { type: 'object' },
      action_data: { type: 'object' },
      created_at: { type: 'string' },
      last_change: { type: 'string' },
      metadata: { type: 'object' },
      action_data: { type: 'object' },
      form_data: { type: 'object' },
      lock: { type: 'boolean' }
    }
  }
}

module.exports.refs = ['UUID'];
