module.exports.model = (path) => ({
  description: 'Code Validation results',
  type: 'object',
  properties: {
    is_valid: { type: 'boolean' },
    submission_id: { $ref: `#${path}UUID` },
    daac_id: { $ref: `#${path}UUID` }
  }
});

module.exports.refs = ['UUID'];
