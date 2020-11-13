module.exports.model = (path) => ({
  description: 'A template for a form with a collection of sections containing questions.',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    version: { type: 'number' },
    description: { type: 'string' },
    form_name: { type: 'string' },
    text: { type: 'string' },
    sections: {
      type: 'array',
      items: {
        type: 'object',
        description: 'A group of related questions.',
        properties: {
          heading: { type: 'string' },
          questions: {
            type: 'array',
            items: { $ref: `#${path}Question` }
          }
        }
      }
    }
  }
});

module.exports.refs = ['UUID', 'Question'];
