module.exports.model = (path) => ({
  description: 'Fields for adding a new question to the database',
  type: 'object',
  allOf: [{ $ref: `#${path}Question` }],
  properties: {
    section_question: {
      type: 'object',
      properties: {
        section_id: { $ref: `#${path}UUID` },
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
        },
        show_if: {
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
      },
      required: [
        'section_id',
        'list_order'
      ]
    }
  },
  required: [
    'short_name',
    'long_name',
    'text',
    'help',
    'section_question'
  ]
});

module.exports.refs = ['UUID'];
