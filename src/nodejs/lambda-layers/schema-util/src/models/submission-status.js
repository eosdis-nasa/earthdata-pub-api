module.exports.model = (path) => ({
  description: 'Submission status information',
  type: 'object',
  properties: {
    conversation_id: { $ref: `#${path}UUID` },
    daac_id: { $ref: `#${path}UUID` },
    id: { $ref: `#${path}UUID` },
    workflow_id: { $ref: `#${path}UUID` },
    step_name: { type: 'string' },
    last_change: { type: 'string' },
    step: { 
      type: 'object',
      properties: {
        name: { type: 'string' },
        type: { type: 'string' },
        step_message: { type: 'string' }
      }
    },
    workflows: {
      type: 'array',
      items: { 
        type: 'object', 
        properties: {
          start_time: { type: 'string' },
          workflow_id: { $ref: `#${path}UUID` }
        }
      }
    }
  }
});

module.exports.refs = ['UUID'];
