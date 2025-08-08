module.exports.model = (path) => ({
  description: 'Basic information for a DAAC.',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    short_name: { type: 'string' },
    long_name: { type: 'string' },
    url: { type: 'string' },
    description: { type: 'string' },
    discipline: { type: 'string' },
    workflow_id: { $ref: `#${path}UUID` },
    edpgroup_id: { $ref: `#${path}UUID` },
    hidden: { type: 'boolean' }
  }
});

module.exports.refs = ['UUID'];
