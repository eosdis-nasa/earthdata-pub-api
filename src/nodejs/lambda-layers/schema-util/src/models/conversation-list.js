module.exports.model = (path) => ({
  description: 'Response returned from requesting a list of conversations',
  type: 'array',
  items: {
    type: 'object',
    allOf: [{ $ref: `#${path}Conversation` }],
    properties: {
      unread: {
        description: 'Flag indicating the read status of the conversation',
        type: 'boolean'
      }
    }
  }
});

module.exports.refs = ['UUID', 'Conversation'];
