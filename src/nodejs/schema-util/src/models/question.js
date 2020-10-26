module.exports.model = (path) => {
  return {
    description: 'A grouping of related inputs to be displayed on a form',
    type: 'object',
    properties: {
      id: { $ref: `#${path}UUID` },
      version: { type: 'number' },
      question_name: { type: 'string' },
      title: { type: 'string' },
      text: { type: 'string' },
      help: { type: 'string' },
      inputs: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string' },
            id: { type: 'string' },
            label: { type: 'string' },
            required: { type: 'boolean' },
            attributes: { type: 'object' },
            enums: { type: 'array' }
          }
        }
      }
    }
  }
}

module.exports.refs = ['UUID'];
