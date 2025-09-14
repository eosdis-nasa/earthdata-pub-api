module.exports.model = () => ({
  description: 'A template for updating a form',
  type: 'object',
  properties: {
    short_name: { type: 'string' },
    version: { type: 'number' },
    long_name: { type: 'string' },
    description: { type: 'string' },
    daac_only: { type: 'boolean' },
    original_shortname: { type: 'string' },
    original_version: { type: 'number' }
  }
});

module.exports.refs = ['UUID'];
