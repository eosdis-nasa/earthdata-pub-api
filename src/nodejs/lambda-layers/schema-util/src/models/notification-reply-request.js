module.exports.model = (path) => ({
  description: 'Request body sent to external notification request handler for replying to conversation.',
  type: 'object',
  properties: {
    text: { type: 'string' },
    request_name: { type: 'string' },
    request_id: { $ref: `#${path}UUID` },
    conversation_id: {
      description: 'UUID of Conversation if replying',
      $ref: `#${path}UUID`
    },
    viewer_users: {
      description: 'List of UUIDs of Users to have visibility on the note',
      type: 'array',
      items: { $ref: `#${path}UUID` }
    },
    viewer_roles: {
      description: 'List of UUIDs of Roles to have visibility on the note',
      type: 'array',
      items: { $ref: `#${path}UUID` }
    },
    attachments: {
      description: 'List of files names of attachments uploaded as part of the note',
      type: 'array',
      items: { type: 'string' }
    }
  }
});

module.exports.refs = ['UUID'];
