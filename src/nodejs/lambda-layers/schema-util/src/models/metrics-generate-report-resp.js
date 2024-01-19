module.exports.model = (path) => ({
    description: 'Response to metrics generate report',
    type: 'object',
    properties: {
        published: { type: 'number' },
        submissions : {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                id: { $ref: `#${path}UUID` },
                name: { type: 'string' },
                initiator_edpuser_id: { $ref: `#${path}UUID` },
                daac_id: { $ref: `#${path}UUID` },
                conversation_id: { $ref: `#${path}UUID` },
                contributor_ids: {
                    type: 'array',
                    items: { $ref: `#${path}UUID` }
                },
                created_at: { type: 'string' },
                hidden: { type: 'boolean' },
                workflow_id: { $ref: `#${path}UUID` },
                step_name: { type: 'string' },
                last_change: { type: 'string' },
                time_to_publish:{
                        type: 'object',
                        properties: {
                            days: { type: 'number' },
                            hours: { type: 'number' },
                            minutes: { type: 'number' },
                            seconds: { type: 'number' }
                        }
                    },
                }
            }
        }
    }
});

module.exports.refs = ['UUID'];