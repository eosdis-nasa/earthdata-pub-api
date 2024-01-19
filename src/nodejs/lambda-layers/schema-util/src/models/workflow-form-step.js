module.exports.model = (path) => ({
  description: "A form step for constructing a Workflow. Value for type will always be 'form'.",
  type: 'object',
  properties: {
    type: { type: 'string' },
    form_id: { $ref: `#${path}UUID` },
    next_step: { type: 'string' },
    prev_step: { type: 'string' }
  }
});

module.exports.refs = ['UUID'];
