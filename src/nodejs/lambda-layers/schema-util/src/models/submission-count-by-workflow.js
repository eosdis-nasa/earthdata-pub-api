module.exports.model = () => ({
  description: 'Submission count by workflow ID',
  type: 'object',
  properties: {
    submission_count: { type: 'string' }
  }
});

module.exports.refs = ['UUID'];
