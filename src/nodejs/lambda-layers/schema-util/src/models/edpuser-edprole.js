module.exports.model = (path) => ({
  description: 'Response from the edpuser-edprole table',
  type: 'object',
  properties: {
    edpuser_id: {
      description: 'UUID of the user',
      $ref: `#${path}UUID`
    },
    edprole_id: {
      description: 'UUID of the role',
      $ref: `#${path}UUID`
    }
  }
});

module.exports.refs = ['UUID'];
