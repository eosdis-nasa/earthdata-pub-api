module.exports.model = (path) => ({
  description: 'A series of steps for processing a Submission',
  type: 'object',
  allOf: [{ $ref: `#${path}Workflow` }],
  properties: {
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

module.exports.refs = ['UUID', 'Workflow', 'WorkflowFormStep', 'WorkflowInitStep', 'WorkflowCloseStep', 'WorkflowActionStep', 'WorkflowReviewStep', 'WorkflowServiceStep'];
