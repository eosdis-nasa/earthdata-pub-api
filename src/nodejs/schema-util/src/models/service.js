module.exports.model = (path) => {
  return {
    description: 'An external service connected with the EDPUB API.',
    type: 'object',
    properties: {
      id: { $ref: `#${path}UUID` },
      service_name: { type: 'string' },
      endpoint: { type: 'string' },
      options: { type: 'object' },
      headers: { type: 'object' },
      method: { type: 'string' },
      code: { type: 'number' },
      payload: { type: 'boolean' }
    }
  }
}

module.exports.refs = ['UUID'];
