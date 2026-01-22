module.exports.model = (path) => ({
  description: 'An archival request submission.',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    name: { type: 'string' },
    initiator: {
      type: 'object',
      properties: {
        id: { $ref: `#${path}UUID` },
        name: { type: 'string' },
        email: { type: 'string' }
      }
    },
    workflow_id: { $ref: `#${path}UUID` },
    hidden: { type: 'boolean' },
    conversation_id: { $ref: `#${path}UUID` },
    workflow_name: { type: 'string' },
    daac_id: { $ref: `#${path}UUID` },
    daac_name: { type: 'string' },
    code: { $ref: `#${path}UUID` },
    assigned_daacs: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          code: { $ref: `#${path}UUID` },
          daac_id: { $ref: `#${path}UUID` },
          daac_name: { type: 'string' }
        }
      }
    },
    step_data: { type: 'object' },
    step_status_label: { type: 'string' },
    step_name: { type: 'string' },
    status: { type: 'string' },
    forms: {
      type: 'array',
      items: { type: 'object' }
    },
    action_data: { type: 'object' },
    form_data: { type: 'object' },
    metadata: { type: 'object' },
    created_at: { type: 'string' },
    last_change: { type: 'string' },
    contributor_ids: {
      type: 'array',
      items: { type: 'string' }
    },
    copy: { type: 'boolean' },
    origin_id: { $ref: `#${path}UUID` }
  }
});

module.exports.refs = ['UUID'];
