module.exports.model = (path) => ({
  description: 'Request body sent to external Submission endpoint.',
  type: 'object',
  properties: {
    id: {
      description: 'UUID of the Submission on which to execute operation',
      $ref: `#${path}UUID`
    },
    daac_id: {
      description: 'UUID of DAAC to assign to Submission',
      $ref: `#${path}UUID`
    },
    form_id: {
      description: 'UUID of Form being saved or submitted',
      $ref: `#${path}UUID`
    },
    data: {
      description: 'A JSON formatted form data to save or submit, should not contain nested objects',
      type: 'object'
    }
  }
});

module.exports.refs = ['UUID'];