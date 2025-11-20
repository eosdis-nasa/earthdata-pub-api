module.exports.model = (path) => ({
  description: 'Request body to send to create temp upload file',
  type: 'object',
  properties: {
    fileId: { $ref: `#${path}UUID` },
    submissionId: { $ref: `#${path}UUID` }
  }
});

module.exports.refs = ['UUID'];
