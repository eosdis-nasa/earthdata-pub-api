module.exports.model = (path) => ({
  description: 'Request body sent to external notification request handler for replying to conversation.',
  type: 'object',
  properties: {
    text: { type: 'string' },
    conversation_id: {
      description: 'UUID of Conversation if replying',
      $ref: `#${path}UUID`
    },
    viewer_users:  {
      description: 'List of UUIDs of Users to have visibility on the note',
      type: 'array',
      items: { $ref: `#${path}UUID` }
    },
    viewer_roles:  {
      description: 'List of UUIDs of Roles to have visibility on the note',
      type: 'array',
      items: { $ref: `#${path}UUID` }
    }
  }
});

module.exports.refs = ['UUID'];
