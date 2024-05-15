module.exports.model = (path) => ({
    description: "A step for creating/removing step review user",
    type: 'object',
    properties: {
        id: { $ref: `#${path}UUID` },
        step_name: { type: 'string' },
    }
  });
  
  module.exports.refs = ['UUID'];
  