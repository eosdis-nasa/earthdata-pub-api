module.exports.model = (path) => ({
    description: 'Response to metrics get dacs',
    type: 'object',
    properties:{
        daac_count: { type: 'number' },
        daacs: {
            type: 'array',
            items:{
                type: 'object',
                properties:{
                    id: {
                        $ref: `#${path}UUID`
                    },
                    short_name: {
                        type: "string"
                    },
                    long_name: {
                        type: "string"
                    },
                    url: {
                        type: "string"
                    },
                    description: {
                        type: "string"
                    },
                    discipline: {
                        type: "string"
                    },
                    workflow_id: {
                        $ref: `#${path}UUID`
                    },
                    edpgroup_id: {
                        $ref: `#${path}UUID`
                    },
                    hidden: {
                        type: "boolean"
                    }
                }
            }
        }
    }
});

module.exports.refs = ['UUID'];