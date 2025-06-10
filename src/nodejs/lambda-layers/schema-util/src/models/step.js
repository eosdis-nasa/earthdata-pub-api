module.exports.model = (path) => ({
    description: 'A step used to describe the transition within workflows of',
    type: 'object',
    properties: {
        step_name: { type: 'string' },
        step_status_label: { type: 'string' },
        type: { type: 'string', enum: ['init', 'action', 'form', 'review', 'service', 'upload', 'close'] },
        action_id: { $ref: `#${path}UUID` },
        form_id: { $ref: `#${path}UUID` },
        service_id: { $ref: `#${path}UUID` },
        data: { type: 'object' }
      }
  });
  
  module.exports.refs = ['UUID'];
  