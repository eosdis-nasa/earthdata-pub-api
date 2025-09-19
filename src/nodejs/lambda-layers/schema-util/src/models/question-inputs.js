module.exports.model = (path) => ({
  description: 'A grouping of related inputs to be displayed on a form',
  type: 'object',
  allOf: [{ $ref: `#${path}Question` }],
  properties: {
    inputs: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          enums: {
            type: 'array',
            items: {}
          },
          label: { type: 'string' },
          show_if: {
            type: 'array',
            items: {}
          },
          required: { type: 'boolean' },
          attributes: { type: 'object' },
          control_id: { type: 'string' },
          list_order: { type: 'number' },
          required_if: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                value: { type: 'string' },
                message: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }
});

module.exports.refs = ['UUID', 'Question'];
