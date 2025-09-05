module.exports.model = (path) => ({
  description: 'Response from the conversation table',
  type: 'object',
  properties: {
    id: {
      description: 'UUID for the conversation',
      $ref: `#${path}UUID`
    },
    subject: { type: 'string' },
    created_at: { type: 'string' },
    last_change: { type: 'string' }
  }
});

module.exports.refs = ['UUID'];
