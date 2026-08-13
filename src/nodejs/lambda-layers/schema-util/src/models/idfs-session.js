module.exports.model = () => ({
  description: 'Lightweight IDFS/OIDC session validity check response.',
  type: 'object',
  properties: {
    ok: {
      description: 'True when the request passed the OIDC/IDFS authorizer.',
      type: 'boolean'
    }
  },
  required: ['ok']
});

module.exports.refs = [];
