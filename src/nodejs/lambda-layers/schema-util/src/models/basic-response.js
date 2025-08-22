module.exports.model = () => ({
  description: 'General response object',
  type: 'object',
  properties: {
    message: {
      description: 'Message indicating status',
      type: 'string'
    },
    error: {
      description: 'Message describing the error encountered',
      type: 'string'
    },

  }
});