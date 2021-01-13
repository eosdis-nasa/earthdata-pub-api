module.exports.model = () => ({
  description: "An init step that serves as an entry point to a Workflow. Value for type will always be 'init'.",
  type: 'object',
  properties: {
    type: { type: 'string' },
    next_step: { type: 'string' }
  }
});

module.exports.refs = [];
