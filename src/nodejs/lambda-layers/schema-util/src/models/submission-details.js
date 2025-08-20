module.exports.model = (path) => ({
  description: 'Submission  details',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    conversation_id: { $ref: `#${path}UUID` },
    created_at: { type: 'string' },
    hidden: { type: 'boolean' },
    initiator: {
      type: 'object',
      properties: {
        id: { $ref: `#${path}UUID` },
        name: { type: 'string' }
      }
    },
    last_change: { type: 'string' },
    data_producer_name: { type: 'string' },
    data_product_name: { type: 'string' },
    contributors: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { $ref: `#${path}UUID` },
          name: { type: 'string' }
        }
      }
    },
    workflow: {
      type: 'object',
      properties: {
        id: { $ref: `#${path}UUID` },
        name: { type: 'string' },
        steps: { 
          type: 'array', 
          items: { type: 'string' }
        }
      }
    },
    step_data: { 
      type: 'object',
      properties: {
        data: { type: 'object' },
        name: { type: 'string' },
        type: { type: 'string' },
        form_id: { $ref: `#${path}UUID` },
        action_id: { $ref: `#${path}UUID` },
        upload_step_id: { $ref: `#${path}UUID` },
        service_id: { $ref: `#${path}UUID` },
        daac_only: { type: 'boolean' }
      }
    },
    forms: {
      type: 'array',
      items: { type: 'object'}
    },
    codes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          code: { $ref: `#${path}UUID` },
          daac_id: { $ref: `#${path}UUID` },
          short_name: { type: 'string' },
          long_name: { type: 'string' }
        }
      }
    },
    metadata: { type: 'object' }
  }
});

module.exports.refs = ['UUID'];
