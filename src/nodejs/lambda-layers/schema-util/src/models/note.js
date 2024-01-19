module.exports.model = (path) => ({
  description: 'A note for internal communication.',
  type: 'object',
  properties: {
    id: { $ref: `#${path}UUID` },
    recipient_id: { $ref: `#${path}UUID` },
    source_id: { $ref: `#${path}UUID` },
    source_type: { type: 'string' },
    subject: { type: 'string' },
    text: { type: 'string' },
    timestamp: { type: 'string' }
  }
});

module.exports.refs = ['UUID'];
