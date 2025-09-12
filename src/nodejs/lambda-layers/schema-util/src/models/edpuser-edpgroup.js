module.exports.model = (path) => ({
  description: 'Response from the edpuser-edpgroup table',
  type: 'object',
  properties: {
    edpuser_id: {
      description: 'UUID of the user',
      $ref: `#${path}UUID`
    },
    edpgroup_id: {
      description: 'UUID of the group',
      $ref: `#${path}UUID`
    }
  }
});

module.exports.refs = ['UUID'];
