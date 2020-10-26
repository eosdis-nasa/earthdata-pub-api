module.exports.model = (path) => {
  return {
    description: 'Request body sent to subscribe or unsubscribe to an event.',
    type: 'object',
    properties: {
      action: { type: 'string', enum: ['subscribe', 'unsubscribe'] },
      event_type: { type: 'string' }
    }
  }
}

module.exports.refs = ['UUID'];
