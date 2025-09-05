module.exports.model = (path) => ({
  description: 'Request body sent to external action request handler.',
  type: 'object',
  properties: {
    submission_id: { $ref: `#${path}UUID` },
    action_id: { $ref: `#${path}UUID` },
    data: { type: 'object' }
  }
});

module.exports.refs = ['UUID'];
