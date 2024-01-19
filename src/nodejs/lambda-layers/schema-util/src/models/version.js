module.exports.model = (path) => ({
  description: 'An object containing versioning information of the API.',
  type: 'object',
  properties: {
    response_version: { type: 'string' },
    api_version: { type: 'string' }
  }
});

module.exports.refs = [];
