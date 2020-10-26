module.exports.model = (path) => {
  return { $ref: `#${path}LogEvent` }
}

module.exports.refs = ['UUID', 'LogEvent'];
