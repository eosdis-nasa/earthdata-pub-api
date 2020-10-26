module.exports.model = (path) => {
  return {
    description: 'A list of events as retrieved from the database.',
    type: 'array',
    items: { $ref: `#${path}LogEvent` }
  }
}

module.exports.refs = ['UUID', 'LogEvent'];
