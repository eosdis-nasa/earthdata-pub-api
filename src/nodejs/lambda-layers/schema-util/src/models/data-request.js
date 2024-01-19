module.exports.model = (path) => ({
  description: 'Request body sent to data endpoint.',
  oneOf: [
    { $ref: `#${path}Form` },
    { $ref: `#${path}Question` },
    { $ref: `#${path}Workflow` }
  ]
});

module.exports.refs = [
  'Form',
  'Question',
  'Workflow',
  'UUID',
  'WorkflowFormStep',
  'WorkflowInitStep',
  'WorkflowCloseStep',
  'WorkflowActionStep',
  'WorkflowReviewStep',
  'WorkflowServiceStep'];
