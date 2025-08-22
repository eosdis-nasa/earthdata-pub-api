module.exports.model = (path) => ({
  description: 'Request body sent to copy a submission',
  type: 'object',
  properties: {
    id: {
      description: 'UUID of the Submission to copy',
      $ref: `#${path}UUID`
    },
    copy_context: {
      description: 'Description of the copy context',
      type: 'string'
    },
    copy_filter: {
      description: 'List of fields to use in the copy process',
      type: 'array',
      items: { type: 'string' }
    },
    action_copy: {
      description: 'Boolean indicating whether or not to copy the action data',
      type: 'boolean'
    }
  }
});

module.exports.refs = ['UUID'];
