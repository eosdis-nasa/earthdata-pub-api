module.exports.model = (path) => ({
    description: "Page for the overview app.",
    type: "object",
    required: ["id", "description", "location"],
    properties: {
      id: { $ref: `#${path}UUID` },
      description: {type: "string"},
      location: {type: "string"}
    }
  });
  module.exports.refs = ['UUID'];