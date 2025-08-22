module.exports.model = (path) => ({
  description: 'A step for creating/removing step review user',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    step_name: { type: 'string' },
    user_list: {
      description: 'List of UUIDs of Users to notify',
      type: 'array',
      items: { $ref: `#${path}UUID` }
    }
  }
});

module.exports.refs = ['UUID'];
