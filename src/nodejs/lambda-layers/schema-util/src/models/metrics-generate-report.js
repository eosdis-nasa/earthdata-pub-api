module.exports.model = (path) => ({
    description: 'Optional date range for filtering metrics',
    type: 'object',
    properties: {
        start_date: { type: 'string' },
        end_date: { type: 'string' }
    }
});

module.exports.refs = [];