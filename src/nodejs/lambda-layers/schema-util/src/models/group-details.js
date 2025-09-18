module.exports.model = (path) => ({
    description: 'Fields for a form with a collection of sections containing questions.',
    type: 'object',
    allOf: [{ $ref: `#${path}Group` }],
    properties: {
      permissions: {
        type: 'array',
        items: {}
      },
      subscriptions: {
        type: 'object',
        properties: {
          daac: {
            type: 'array',
            items: {}
          },
          form: {
            type: 'array',
            items: {}
          },
          action: {
            type: 'array',
            items: {}
          },
          service: {
            type: 'array',
            items: {}
          },
          workflow: {
            type: 'array',
            items: {}
          },
          submission: {
            type: 'array',
            items: {}
          }
        }
      }
    }
    
  });
  
  module.exports.refs = ['UUID', 'Group'];