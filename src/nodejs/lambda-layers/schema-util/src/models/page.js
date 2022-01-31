module.exports.model = () => ({
  description: 'Page for the overview app.',
  type: 'object',
  properties: {
    page_key: {type: "string"},
    content: {
      type: 'object',
      properties: {
        id: {type: "number"},
        heading: {type: "string"},
        paragraphs: {type: "array", items: {type: "string"}},
        list: {type: "array", items: {type: "string"}}
      }
    }
  }
});

module.exports.refs = [];
