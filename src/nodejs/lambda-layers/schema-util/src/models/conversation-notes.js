module.exports.model = (path) => ({
  description: 'Response returned from requesting a specific conversation',
  type: 'object',
  properties: {
    id: {
      description: 'UUID for the conversation',
      $ref: `#${path}UUID`
    },
    subject: { type: 'string' },
    participants: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { $ref: `#${path}UUID` },
          name: { type: 'string' },
          email: { type: 'string' }
        }
      }
    },
    edpuser_id: { $ref: `#${path}UUID` },
    created_at: { type: 'string' },
    notes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { $ref: `#${path}UUID` },
          from: {
            type: 'object',
            properties: {
              id: { $ref: `#${path}UUID` },
              name: { type: 'string' },
              email: { type: 'string' }
            }
          },
          sent: { type: 'string' },
          text: { type: 'string' },
          viewers: {
            type: 'object',
            properties: {
              roles: {
                type: 'array',
                items: { type: 'string' }
              },
              users: {
                type: 'array',
                items: { type: 'string' }
              }
            }
          },
          attachments: {
            type: 'array',
            items: { type: 'string' }
          }
        }
      }
    }
  }
});

module.exports.refs = ['UUID'];
