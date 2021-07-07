module.exports.model = (path) => ({
  description: 'Request body sent to external notification request handler for replying to conversation.',
  type: 'object',
  properties: {
    text: { type: 'string' },
    conversation_id: {
      description: 'UUID of Conversation if replying',
      $ref: `#${path}UUID`
    }
  }
});

module.exports.refs = ['UUID'];
