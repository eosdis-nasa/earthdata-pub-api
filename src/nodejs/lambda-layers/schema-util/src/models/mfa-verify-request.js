module.exports.model = () => ({
  description: 'request body sent to verify an MFA token',
  type: 'object',
  properties: {
    tops_token: { type: 'string' },
    auth_token: { type: 'string' }
  }
});

module.exports.refs = ['UUID'];
