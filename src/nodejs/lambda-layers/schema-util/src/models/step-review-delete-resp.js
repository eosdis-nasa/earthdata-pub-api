module.exports.model = (path) => ({
    description: 'Response returned from removing one or more reviewers to a submission step',
    type: 'object',
    allOf: [{ $ref: `#${path}StepReview` }],
    properties:{
      initiator: { $ref: `#${path}UUID` }
    }
  });
  
  module.exports.refs = ['UUID', 'StepReview'];