module.exports.model = (path) => ({
  description: 'A series of steps for processing a Submission',
  type: 'object',
  properties: {
    short_name: { type: 'string' },
    version: { type: 'number' },
    long_name: { type: 'string' },
    description: { type: 'string' },
    steps: {
      type: 'object',
      additionalProperties: {
        anyOf: [
          { $ref: `#${path}WorkflowActionStep` },
          { $ref: `#${path}WorkflowFormStep` },
          { $ref: `#${path}WorkflowReviewStep` },
          { $ref: `#${path}WorkflowServiceStep` }
        ]
      }
    }
  }
});

module.exports.refs = ['UUID'];