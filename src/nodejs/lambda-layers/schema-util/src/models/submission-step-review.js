module.exports.model = (path) => ({
  description: 'Step review information for a submission',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      step_name: { type: 'string' },
      submission_id: { $ref: `#${path}UUID` },
      edpuser_id: { $ref: `#${path}UUID` },
      user_review_status: { type: 'string', enum: ['rejected', 'approved', 'review_required'] },
      name: { type: 'string' },
      submitted_by: { $ref: `#${path}UUID` }
    }
  }
});

module.exports.refs = ['UUID'];