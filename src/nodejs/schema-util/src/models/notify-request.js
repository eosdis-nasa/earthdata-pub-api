module.exports.model = (path) => {
  return {
    description: 'Request body sent to external notification request handler.',
    type: 'object',
    properties: {
      subject: { type: 'string' },
      text: { type: 'string' },
      to: {
        type: 'object',
        properties: {
          text: { type: 'string' },
          subject: { type: 'string' },
          submission_id: { $ref: `#${path}UUID` },
          user_id: { $ref: `#${path}UUID` },
          group_id: { $ref: `#${path}UUID` }
        }
      }
    }
  }
}

module.exports.refs = ['UUID'];
