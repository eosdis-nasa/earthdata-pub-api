module.exports.model = (path) => ({ $ref: `#${path}LogEvent` });

module.exports.refs = ['UUID', 'LogEvent'];
