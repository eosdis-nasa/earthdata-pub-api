module.exports.model = (path) => ({
  description: 'A series of steps for processing a Submission',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    version: { type: 'number' },
    workflow_name: { type: 'string' },
    description: { type: 'string' },
    created_at: { type: 'string' },
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

module.exports.refs = ['UUID', 'WorkflowFormStep', 'WorkflowInitStep', 'WorkflowCloseStep', 'WorkflowActionStep', 'WorkflowReviewStep', 'WorkflowServiceStep'];
