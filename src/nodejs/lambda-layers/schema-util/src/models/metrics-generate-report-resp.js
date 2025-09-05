module.exports.model = (path) => ({
  description: 'Response to metrics generate report',
  type: 'object',
  properties: {
    submission_count: { type: 'number' },
    submissions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { $ref: `#${path}UUID` },
          daac_id: { $ref: `#${path}UUID` },
          created_at: { type: 'string' },
          hidden: { type: 'boolean' },
          workflow_id: { $ref: `#${path}UUID` },
          step_name: { type: 'string' },
          last_change: { type: 'string' },
          accession_rejected: { type: 'boolean' },
          time_to_publish: { type: 'string' }
        }
      }
    },
    avg_time_to_publish: {
      type: 'object',
      properties: {
        daac_id: { $ref: `#${path}UUID` },
        time_to_publish: { type: 'string' }
      }
    },
    user_count: { type: 'number' },
    step_metrics: {
      type: 'object',
      properties: {
        time_for_step: { type: 'string' },
        step_name: { type: 'string' },
        submission_id: { $ref: `#${path}UUID` },
        workflow_id: { $ref: `#${path}UUID` }
      }
    }
  }
});

module.exports.refs = ['UUID'];
