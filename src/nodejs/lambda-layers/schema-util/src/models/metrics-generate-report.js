module.exports.model = (path) => ({
    description: 'Optional date range for filtering metrics',
    type: 'object',
    properties: {
        start_date: { type: 'string' },
        end_date: { type: 'string' },
        daac_id: { $ref: `#${path}UUID` },
        workflow_id: { $ref: `#${path}UUID` },
        submission_id: { $ref: `#${path}UUID` },
        role_id: { type: 'string' },
        privilege: { type: 'string' },
        metric: { 
            type: 'array',
            items: { type: 'string' }
         },
        state: { type: 'string' },
        accession_rejected: { type: 'boolean' }
    }
});

module.exports.refs = ['UUID'];
