module.exports.model = (path) => ({
  description: 'A user',
  type: 'object',
  properties: {
    id: {
      $ref: `#${path}UUID`
    },
    name: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    refresh_token: {
      type: 'string'
    },
    registered: {
      type: 'string'
    },
    last_login: {
      type: 'string'
    },
    enabled: {
      type: 'boolean',
      description: 'Cognito account Enabled (Active) vs disabled'
    },
    detailed: {
      type: 'boolean'
    }
  }
});

module.exports.refs = ['UUID'];
