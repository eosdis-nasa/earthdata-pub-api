module.exports.model = (path) => ({
  description: 'Response from the conversation_edpuser table',
  type: 'object',
  properties: {
    conversation_id: {
      description: 'UUID for the conversation',
      $ref: `#${path}UUID`
    },
    edpuser_id: {
      description: 'UUID of the user associated with the conversation',
      $ref: `#${path}UUID`
    },
    unread: {
      description: 'Flag indicating the read status of the conversation',
      type: 'boolean'
    }
  }
});

module.exports.refs = ['UUID'];
