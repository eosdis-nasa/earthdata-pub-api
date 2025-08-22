module.exports.model = (path) => ({
  description: 'Request body sent to create a submission.',
  type: 'object',
  properties: {
    code: {
      description: 'UUID of the Accession Request Code on which your submission will be based',
      $ref: `#${path}UUID`
    },
    formData: {
      type: 'object',
      properties: {
        data_product_name_value: { type: 'string' },
        dar_form_project_name_info: { type: 'string' },
        data_producer_info_name: { type: 'string' },
        dar_form_principal_investigator_fullname: { type: 'string' }
      }
    }
  }
});

module.exports.refs = ['UUID'];
