module.exports.model = () => ({
  description: 'Response with the pre0signed url',
  type: 'object',
  properties: {
    presigned_url: { type: 'string' }
  }
});

module.exports.refs = ['UUID'];
