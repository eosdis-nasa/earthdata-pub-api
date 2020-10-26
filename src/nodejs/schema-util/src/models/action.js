module.exports.model = (path) => {
  return {
    description: 'An action that can be invoked by a workflow or externally.',
    type: 'object',
    properties: {
      id: { $ref: `#${path}UUID` },
      action_name: { type: 'string' },
      version: { type: 'number' },
      description: { type: 'string' },
      file_key: { type: 'string' },
      input_schema: { type: 'object' }
    }
  }
}

module.exports.refs = ['UUID'];
