module.exports.model = (path) => ({
  description: 'Request body sent to add users as viewers to a note',
  type: 'object',
  properties: {
    note_id: {
      description: 'UUID of note',
      $ref: `#${path}UUID`
    },
    viewer_ids: {
      description: 'List of UUIDs of Users to have visibility on the note',
      type: 'array',
      items: { $ref: `#${path}UUID` }
    }
  }
});

module.exports.refs = ['UUID'];
