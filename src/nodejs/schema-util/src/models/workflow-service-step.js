module.exports.model = (path) => {
  return {
    description: "A service step for constructing a Workflow. Value for type will always be 'service'.",
    type: 'object',
    properties: {
      type: { type: 'string' },
      service_id: { $ref: `#${path}UUID` },
      next_step: { type: 'string' },
      prev_step: { type: 'string' }
    }
  }
}

module.exports.refs = ['UUID'];
