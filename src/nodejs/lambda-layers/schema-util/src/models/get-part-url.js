module.exports.model = (path) => ({
  description: 'Request body for Getting Presigned URL and Upload for Each Part',
  type: 'object',
  properties: {
    file_id: { $ref: `#${path}UUID` },
    part_number: { type: 'integer' },
    upload_id: { $ref: `#${path}UUID` }
  }
});

module.exports.refs = ['UUID'];
