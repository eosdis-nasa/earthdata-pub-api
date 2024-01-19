module.exports.model = (path) => ({
  description: "An action step for constructing a Workflow. Value for type will always be 'action'.",
  type: 'object',
  properties: {
    type: { type: 'string' },
    action_id: { $ref: `#${path}UUID` },
    data: { type: 'object' },
    next_step: { type: 'string' },
    prev_step: { type: 'string' }
  }
});

module.exports.refs = ['UUID'];
