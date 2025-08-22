module.exports.model = (path) => ({
    description: 'Fields for a form with a collection of sections containing questions.',
    type: 'object',
    allOf: [{ $ref: `#${path}Form` }],
    properties: {
      form_id: { $ref: `#${path}UUID` },
      sections: {
        type: 'array',
        items: {
          type: 'object',
          description: 'A group of related questions.',
          properties: {
            daac_id: { $ref: `#${path}UUID` },
            heading: { type: 'string' },
            show_if: {
              type: 'array',
              items: { type: 'object' }
            },
            questions: {
              type: 'array',
              items: { 
                description: 'A grouping of related inputs to be displayed on a form',
                type: 'object',
                properties: {
                  help: { type: 'string' },
                  text: { type: 'string' },
                  inputs: { 
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                          type: { type: 'string' },
                          enums: {
                             type: 'array',
                             items: {
                              oneOf: [
                                { type: 'string' },
                                { type: 'object' },
                              ]
                             }
                            },
                          label: { type: 'string' },
                          show_if: {
                              type: 'array',
                              items: { type: 'object' }
                          },
                          required: { type: 'boolean' },
                          attributes: { type: 'object' },
                          control_id: { type: 'string' },
                          list_order: { type: 'number' },
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
                      }
                    }
                  },
                  show_if: {
                    type: 'array',
                    items: { type: 'object' }
                  },
                  version: { type: 'number' },
                  daac_ids: {
                    type: 'array',
                      items: {
                        $ref: `#${path}UUID`
                      }
                  },
                  required: { type: 'boolean' },
                  long_name: { type: 'string'},
                  short_name: { type: 'string' },
                  required_if: {
                    type: 'array',
                    items: { type: 'object' }
                  }
                }
              }
            },
            required_if: {
              type: 'array',
              items: { type: 'object' }
            }
          }
        }
      }
    }
    
  });
  
  module.exports.refs = ['UUID', 'Form'];
