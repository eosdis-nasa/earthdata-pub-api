module.exports.model = (path) => ({
  description: 'Response returned from adding one or more reviewers to a submission step',
  type: 'object',
  allOf: [{ $ref: `#${path}StepReview` }],
  properties: {
    form_id: { $ref: `#${path}UUID` }
  }
});

module.exports.refs = ['UUID', 'StepReview'];
