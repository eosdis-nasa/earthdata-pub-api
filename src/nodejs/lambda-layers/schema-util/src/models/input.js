module.exports.model = (path) => ({
  description: 'A grouping of inputs related to a form question.',
  type: 'object',
  properties: {
    question_id: { $ref: `#${path}UUID` },
    control_id: { type: 'string' },
    list_order: { type: 'number' },
    label: { type: 'string' },
    type: { type: 'string' },
    enums: {
      type: 'array',
      items: {}
    },
    attributes: { type: 'object' },
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
    },
    required: { type: 'boolean' }
  }

});

module.exports.refs = ['UUID'];
