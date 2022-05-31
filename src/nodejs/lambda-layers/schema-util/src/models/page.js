module.exports.model = () => ({
  description: "Page for the overview app.",
  type: "object",
  required: ["page_key", "content"],
  properties: {
    page_key: {type: "string"},
    content: {
      type: "object",
      required: ["id", "heading"],
      properties: {
        id: {type: "number"},
        heading: {type: "string"},
        paragraphs: {type: "array", items: {type: "string"}},
        list: {type: "array", items: {type: "string"}},
        table: {
          type: "object",
          properties: {
            rows: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  number: {type: "number"},
                  columns: {type: "array", items: {type: "string"}}
                }
              }
            },
            header: {type: "array", items: {type: "string"}},
            caption: {type: "string"}
          }
        }
      }
    }
  }
});

module.exports.refs = [];
