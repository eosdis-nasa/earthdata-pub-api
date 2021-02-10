module.exports.model = (path) => ({
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
        user_list: {
          description: 'List of UUIDs of Users to notify',
          type: 'array',
          items: { $ref: `#${path}UUID` }
        },
        conversation_id: {
          description: 'UUID of Conversation if replying',
          $ref: `#${path}UUID`
        }
      }
    }
  }
});

module.exports.refs = ['UUID'];
