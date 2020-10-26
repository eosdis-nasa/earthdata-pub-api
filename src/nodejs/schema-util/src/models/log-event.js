module.exports.model = (path) => {
  return {
    description: 'An individual event.',
    type: 'object',
    properties: {
      id: { $ref: `#${path}UUID`},
      event_type: { type: 'object' },
      event_data: { type: 'object' }
    }
  }
}

module.exports.refs = ['UUID'];
