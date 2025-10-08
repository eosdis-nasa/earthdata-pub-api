module.exports.model = () => ({
  description: '',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      key: { type: 'string' },
      size: { type: 'number' },
      lastModified: { type: 'string' },
      file_name: { type: 'string' },
      category: { type: 'string' },
      sha256Checksum: { type: 'string' }
    }
  }
});

module.exports.refs = ['UUID'];
