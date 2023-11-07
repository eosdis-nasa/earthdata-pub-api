module.exports.model = (path) => ({
  description: 'Request body sent to subscribe or unsubscribe to an event.',
  type: 'object',
  properties: {
    operation: { type: 'string', enum: ['subscribe', 'unsubscribe'] },
    user_id: { $ref: `#${path}UUID` },
    group_id: { $ref: `#${path}UUID` },
    action_id: { $ref: `#${path}UUID` },
    daac_id: { $ref: `#${path}UUID` },
    form_id: { $ref: `#${path}UUID` },
    service_id: { $ref: `#${path}UUID` },
    submission_id: { $ref: `#${path}UUID` },
    workflow_id: { $ref: `#${path}UUID` }
  }
});

module.exports.refs = ['UUID'];
