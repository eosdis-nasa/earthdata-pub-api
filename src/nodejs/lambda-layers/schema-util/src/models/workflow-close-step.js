module.exports.model = (path) => ({
  description: "A close step that signifies the end of a Workflow and a Submission being in a ready state for launching another Workflow. Value for type will always be 'close'.",
  type: 'object',
  properties: {
    type: { type: 'string' },
    service_id: { $ref: `#${path}UUID` },
    prev_step: { type: 'string' }
  }
});

module.exports.refs = ['UUID'];
