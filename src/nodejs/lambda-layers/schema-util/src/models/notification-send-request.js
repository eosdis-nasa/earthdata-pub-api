module.exports.model = (path) => ({
  description: 'Request body sent to external notification request handler for starting a new conversation.',
  type: 'object',
  properties: {
    subject: { type: 'string' },
    text: { type: 'string' },
    user_list: {
      description: 'List of UUIDs of Users to notify',
      type: 'array',
      items: { $ref: `#${path}UUID` }
    }
  }
});

module.exports.refs = ['UUID'];
