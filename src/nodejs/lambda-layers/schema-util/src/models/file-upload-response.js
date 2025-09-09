module.exports.model = () => ({
  description: 'Response from a file upload endpoint',
  type: 'object',
  properties: {
    url: { type: 'string' },
    fields: { type: 'object' }
  }
});

module.exports.refs = ['UUID'];
