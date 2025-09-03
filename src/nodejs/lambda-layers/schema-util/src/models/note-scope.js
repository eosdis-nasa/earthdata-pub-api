module.exports.model = (path) => ({
  description: 'Schema representing the note_scope table',
  type: 'object',
  properties: {
    note_id: {
      description: 'UUID of the Note',
      $ref: `#${path}UUID`
    },
    user_ids: {
      description: 'List of UUIDs of Users to have visibility on the note',
      type: 'array',
      items: { $ref: `#${path}UUID` }
    },
    edprole_ids: {
      description: 'List of UUIDs of Roles to have visibility on the note',
      type: 'array',
      items: { $ref: `#${path}UUID` }
    }
  }
});

module.exports.refs = ['UUID'];
