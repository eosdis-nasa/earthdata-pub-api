module.exports.model = (path) => ({
  description: 'A grouping of related inputs to be displayed on a form',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    form_id: { $ref: `#${path}UUID` },
    heading: { type: 'string' },
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
    },
    daac_id: { $ref: `#${path}UUID` }
  }
});

module.exports.refs = ['UUID'];
