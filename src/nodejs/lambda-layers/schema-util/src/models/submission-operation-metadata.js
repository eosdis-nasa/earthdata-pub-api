module.exports.model = (path) => ({
  description: 'Request body sent to external Submission endpoint.',
  type: 'object',
  properties: {
    id: {
      description: 'UUID of the Submission on which to execute operation',
      $ref: `#${path}UUID`
    },
    metadata: {
      description: 'UMM-C JSON formatted collection level metadata',
      type: 'object'
    }
  }
});

module.exports.refs = ['UUID'];