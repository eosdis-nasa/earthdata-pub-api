module.exports.model = () => ({
    description: 'A grouping of inputs related to a form question.',
    type: 'array',
    items: {
        type: 'object',
        properties: {
            type: { type: 'string' },
            id: { type: 'string' },
            label: { type: 'string' },
            required: { type: 'boolean' },
            required_if: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        field: { type: 'string' },
                        value: { type: 'string' },
                        message: { type: 'string' }
                    }
                }
            },
            show_if: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        field: { type: 'string' },
                        value: { type: 'string' },
                        message: { type: 'string' }
                    }
                }
            },
            attributes: { type: 'object' },
            enums: { type: 'array' }
        }
    }

});