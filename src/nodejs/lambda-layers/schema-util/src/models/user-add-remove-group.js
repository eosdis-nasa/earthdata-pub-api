module.exports.model = (path) => ({
  description: 'Request body to send to add or remove a user group',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    group_id: { $ref: `#${path}UUID` }
  }
});

module.exports.refs = ['UUID'];
