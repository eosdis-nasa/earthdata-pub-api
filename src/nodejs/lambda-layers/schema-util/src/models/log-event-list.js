module.exports.model = (path) => ({
  description: 'A list of events as retrieved from the database.',
  type: 'array',
  items: { $ref: `#${path}LogEvent` }
});

module.exports.refs = ['UUID', 'LogEvent'];
