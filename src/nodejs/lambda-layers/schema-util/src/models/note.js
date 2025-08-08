module.exports.model = (path) => ({
  description: 'A note for internal communication.',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    conversation_id: { $ref: `#${path}UUID` },
    sender_edpuser_id: { $ref: `#${path}UUID` },
    text: { type: 'string' },
    created_at: { type: 'string' },
    step_name: { type: 'string' },
    attachments : { 
      type: 'array', 
      items: { type: 'string'}
    },
    daac_id: { $ref: `#${path}UUID` }
  }
});

module.exports.refs = ['UUID'];
