module.exports.model = (path) => ({
  description: "Page for the overview app.",
  type: "object",
  required: ["page_key", "page_id", "content"],
  properties: {
    page_key: {type: "string"},
    page_id: { $ref: `#${path}UUID` },
    page: {type: "string"},
    location: {type: "string"},
    content: {
      type: "object",
      required: ["id", "heading"],
      properties: {
        id: {type: "number"},
        heading: {type: "string"},
        paragraphs: {
          type: "array", items: {
            type: "object",
            properties: {
              text: { type: 'string' },
              list: {type: "array", items: {type: "string"}},
              note: {type: "string"},
              image: {type: "string"},
              image_alt_text: {type: "string"},
              icon: {type: "string"},
              heading: { type: 'string' },
              caption: {type: "string"},
              button: { type: 'string' },
              box_list: {
                type: "array", items: {
                  type: "object",
                  required: ["text"],
                  properties: {
                    heading: { type: 'string' },
                    text: { type: 'string' },
                    icon: { type: 'string' },
                    box_link: { type: 'string' }
                  }
                }
              },
              info_bubble: {
                type: "array", items: {
                  type: "object",
                  required: ["text","linked_cls"],
                  properties: {
                    linked_cls:  { type: 'string' },
                    heading: { type: 'string' },
                    text: { type: 'string' },
                    icon: { type: 'string' },
                    link: { type: 'string' }
                  }
                }
              },
              step: {
                type: "array", items: {
                  type: "object",
                  required: ["number","text"],
                  properties: {
                    number: {type: "number"},
                    heading: { type: 'string' },
                    text: { type: 'string' },
                    icon: { type: 'string' },
                    icon_text: { type: 'string' },
                    button: { type: 'string' },
                    image: {type: "string"},
                    image_alt_text: {type: "string"},
                    tip: {type: "string"},
                    accordian: {type: "string"}
                  }
                }
              },
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
                  heading: {type: "array", items: {type: "string"}},
                  caption: {type: "string"}
                }
              }
            }
          }
        },
        list: {type: "array", items: {type: "string"}},
        image: {type: "string"},
        image_alt_text: {type: "string"},
        icon: {type: "string"},
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
            heading: {type: "array", items: {type: "string"}},
            caption: {type: "string"}
          }
        },
        box_list: {
          type: "array", items: {
            type: "object",
            required: ["text"],
            properties: {
              heading: { type: 'string' },
              text: { type: 'string' },
              icon: { type: 'string' },
              box_link: { type: 'string' }
            }
          }
        }
      }
    }
  }
});

module.exports.refs = ['UUID'];