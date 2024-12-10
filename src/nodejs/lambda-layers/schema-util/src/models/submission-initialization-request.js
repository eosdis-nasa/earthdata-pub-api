module.exports.model = (path) => ({
  description: 'Request body sent to create a submission.',
  type: 'object',
  properties: {
    name: {
      description: 'Name for the submission',
      type: 'string'
    },
    code: {
      description: 'UUID of the Accession Request Code on which your submission will be based',
      $ref: `#${path}UUID`
    }
  }
});

module.exports.refs = ['UUID'];