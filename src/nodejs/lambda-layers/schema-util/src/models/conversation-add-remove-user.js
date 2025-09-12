module.exports.model = (path) => ({
  description: 'Request body sent for adding or removing a user from a conversation',
  type: 'object',
  properties: {
    user_id: {
      description: 'UUID of the user to add/remove from the conversation',
      $ref: `#${path}UUID`
    },
    conversation_id: {
      description: 'UUID for the target conversation',
      $ref: `#${path}UUID`
    }
  }
});

module.exports.refs = ['UUID'];
