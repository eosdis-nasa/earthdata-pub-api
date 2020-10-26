module.exports.model = (path) => {
  return {
    description: 'Univerally Unique Identifier',
    type: 'string',
    pattern: '^[a-f|0-9]{8}-[a-f|0-9]{4}-4[a-f|0-9]{3}-[89ab][a-f|0-9]{3}-[a-f|0-9]{12}$'
  }
}

module.exports.refs = [];
