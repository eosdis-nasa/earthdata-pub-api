module.exports.model = () => ({
  description: 'Page content for the overview app.',
  type: 'object',
  properties: {
    page_key: { type: "string" },
    id: { type: "number" },
    heading: { type: "string" },
    paragraphs: { type: "array", items: { type: "string" } },
    list: { type: "array", items: { type: "string" } }
  }
});

module.exports.refs = [];
