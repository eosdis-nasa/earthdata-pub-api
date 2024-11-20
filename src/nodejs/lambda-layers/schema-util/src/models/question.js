module.exports.model = (path) => ({
  description: 'A grouping of related inputs to be displayed on a form',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    short_name: { type: 'string' },
    version: { type: 'number' },
    long_name: { type: 'string'},
    text: { type: 'string' },
    help: { type: 'string' },
    required: { type: 'boolean' },
    created_at: { type: 'string'},
    daac_ids: {
      type: 'array',
        items: {
          $ref: `#${path}UUID`
        }
    }
  }

});

module.exports.refs = ['UUID'];
