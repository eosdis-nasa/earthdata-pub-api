module.exports.model = (path) => ({
    description: "Response from the step review table",
    type: 'object',
    properties: {
        step_name: { type: 'string' },
        submission_id: { $ref: `#${path}UUID` },
        edpuser_id: { $ref: `#${path}UUID` },
        user_review_status: { type: 'string' },
        submitted_by: { $ref: `#${path}UUID` },
    }
  });
  
  module.exports.refs = ['UUID'];
