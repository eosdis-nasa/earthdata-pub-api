module.exports.model = () => ({
  description: 'Counts by event type',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      event_type: { type: 'string' },
      count: { type: 'number' }
    }
  }
});

module.exports.refs = ['UUID'];
