module.exports.model = (path) => ({
    description: 'Request body sent to remove a user as a viewer of a note',
    type: 'object',
    properties: {
      note_id: {
        description: 'UUID of note',
        $ref: `#${path}UUID`
      },
      viewer_id:  {
        description: 'List of UUIDs of Users to have visability on the note',
        $ref: `#${path}UUID`
      }
    }
  });
  
  module.exports.refs = ['UUID'];