module.exports.model = (path) => ({
  description: 'A grouping of related inputs to be displayed on a form',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    version: { type: 'number' },
    question_name: { type: 'string' },
    title: { type: 'string' },
    text: { type: 'string' },
    help: { type: 'string' },
    inputs: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          id: { type: 'string' },
          label: { type: 'string' },
          required: { type: 'boolean' },
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
          attributes: { type: 'object' },
          enums: { type: 'array' }
        }
      }
    }
  }
});

module.exports.refs = ['UUID'];
