module.exports.model = (path) => ({
  description: 'Submission information as returned from the submission table',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    name: { type: 'string' },
    initiator_edpuser_id: { $ref: `#${path}UUID` },
    daac_id: { $ref: `#${path}UUID` },
    conversation_id: { $ref: `#${path}UUID` },
    contributor_ids: {
      type: 'array',
      items: { $ref: `#${path}UUID` }
    },
    created_at: { type: 'string' },
    data_producer_name: { type: 'string' },
    hidden: { type: 'boolean' }
  }
});

module.exports.refs = ['UUID'];
