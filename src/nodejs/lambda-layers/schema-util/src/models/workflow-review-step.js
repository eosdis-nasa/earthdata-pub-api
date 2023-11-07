module.exports.model = () => ({
  description: "A review step for constructing a Workflow. Value for type will always be 'review'.",
  type: 'object',
  properties: {
    type: { type: 'string' },
    data: { type: 'object' },
    next_step: { type: 'string' },
    prev_step: { type: 'string' }
  }
});

module.exports.refs = [];
