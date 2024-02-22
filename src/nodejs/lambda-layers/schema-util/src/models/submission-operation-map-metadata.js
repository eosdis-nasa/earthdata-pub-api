module.exports.model = (path) => ({
    description: 'Request body sent to external Submission map metadata endpoint.',
    type: 'object',
    properties: {
      id: {
        description: 'UUID of the Submission on which to execute operation',
        $ref: `#${path}UUID`
      },
    }
  });
  
  module.exports.refs = ['UUID'];
  