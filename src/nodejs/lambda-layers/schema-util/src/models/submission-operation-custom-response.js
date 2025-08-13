module.exports.model = (path) => ({
  description: 'Response from an active/inactive submission query.',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    name: { type: 'string' },
    data_producer_name: { type: 'string' },
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
    step_data: { type: 'object' },
    step_status_label: { type: 'string' },
    step_name: { type: 'string' },
    status: { type: 'string' },
    created_at: { type: 'string' },
    last_change: { type: 'string' },
    lock: { type: 'boolean' },
    contributor_ids: {
      type: 'array',
      items: { type: 'string' }
    },
    copy: { type: 'boolean' },
    origin_id: { $ref: `#${path}UUID` }
  }
});

module.exports.refs = ['UUID'];