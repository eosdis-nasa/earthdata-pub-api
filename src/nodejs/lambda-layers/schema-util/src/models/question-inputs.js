module.exports.model = (path) => ({
    description: 'A grouping of related inputs to be displayed on a form',
    type: 'object',
    allOf: [{ $ref: `#${path}Question` }],
    properties:{
      inputs: {
        allOf: [{ $ref: `#${path}Input` }]
      }
    }
  });
  
  module.exports.refs = ['UUID', 'Input', 'Question'];
  