module.exports.model = (path) => {
  return {
    description: 'Request body sent to external action request handler.',
    type: 'object',
    properties: {
      submission_id: { $ref: `#${path}UUID` },
      action_id: { $ref: `#${path}UUID` },
      input: { type: 'object' }
    }
  }
}

module.exports.refs = ['UUID'];
