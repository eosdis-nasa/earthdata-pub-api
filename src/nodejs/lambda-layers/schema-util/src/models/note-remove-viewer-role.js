module.exports.model = (path) => ({
  description: 'Request body sent to remove a role as a viewers of a note',
  type: 'object',
  properties: {
    note_id: {
      description: 'UUID of note',
      $ref: `#${path}UUID`
    },
    viewer_role: {
      description: 'UUID of role to remove from the visability for the note',
      $ref: `#${path}UUID`
    }
  }
});

module.exports.refs = ['UUID'];
