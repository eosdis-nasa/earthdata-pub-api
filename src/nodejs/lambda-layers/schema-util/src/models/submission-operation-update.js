module.exports.model = (path) => ({
    description: 'Request body sent to external Submission endpoint.',
    type: 'object',
    properties: {
      id: {
        description: 'UUID of the Submission on which to execute operation',
        $ref: `#${path}UUID`
      },
      data_product_name: { type: 'string' },
      data_producer_name: { type: 'string' },
    }
  });
  
  module.exports.refs = ['UUID'];
  