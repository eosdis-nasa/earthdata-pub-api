module.exports.model = (path) => ({
  description: "Paragraph for the overview app.",
  type: "object",
  required: ["paragraph_key", "page_id", "content"],
  properties: {
    page_id: { $ref: `#${path}UUID` },
    paragraph_key: {type: "string"},
    content: {
      type: "object",
      required: ["id", "heading"],
      properties: {
        id: {type: "number"},
        heading: {type: "string"},
        paragraphs: {
          type: "array", items: {
            type: "object",
            required: ["text"],
            properties: {
              text: { type: 'string' },
              list: {type: "array", items: {type: "string"}},
              image: {type: "string"},
              header: {type: "array", items: {type: "string"}},
              caption: {type: "string"},
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
        },
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
        },
        image: {type: "string"}
      }
    }
  }
});

module.exports.refs = ['UUID'];