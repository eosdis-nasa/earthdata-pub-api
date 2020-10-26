module.exports.model = (path) => {
  return {
    description: 'A list of questions',
    type: 'array',
    items: { $ref: `#${path}Question` }
  }
}

module.exports.refs = ['UUID', 'Question'];
