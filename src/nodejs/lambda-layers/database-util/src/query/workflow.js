const sql = require('./sql-builder.js');

const refs = {
  step_edge_details: {
    type: 'natural_left_join',
    src: sql.select({
      fields: ['*'],
      from: { 
        base: 'step_edge', 
        joins: [{
          type: 'natural_full_outer_join', 
          src: sql.select({
            fields: ['workflow_id', 'next_step_name AS step_name', 'step_name AS prev_step_name'],
            from: { 
              base: 'step_edge'
            },
            alias: 'back_edge'
          })
        }]
      },
      alias: 'step_edge_details'
    })
  },

  step_json : {
    type: 'left_join',
    
  }
}

const findAll = ({ sort, order, per_page, page } = {}) => sql.select({
  fields: ['workflow.*', 'steps'],
  from: { 
    base: 'workflow', 
    joins: [{
      type: 'left_join', 
      src: sql.select({
        fields: [
          'step_edge_details.workflow_id',
          {
            type: 'json_obj_agg',
            keys: [
              'step.step_name',
              {
                type: 'json_obj',
                keys: [
                  ['step_id', 'step.step_id'],
                  ['type', 'step.type'],
                  ['action_id', 'step.action_id'],
                  ['form_id', 'step.form_id'],
                  ['service_id', 'step.service_id'],
                  ['step_status_label', 'step.step_status_label'],
                  ['next_step_name', 'step_edge_details.next_step_name'],
                  ['prev_step_name', 'step_edge_details.prev_step_name'],
                  ['step_message', 'step_edge_details.step_message'],
                  ['prev_step', 'step.data'],
                ],
                strip: true
              }
            ],
            alias: 'steps'
          }
        ],
        from: {
          base: 'step',
          joins: [refs.step_edge_details]
        },
        group: 'step_edge_details.workflow_id',
        alias: 'step_json'
      }),
      on: { left: 'step_json.workflow_id', right: 'workflow.id' }
    }]
  },
  ...(sort ? { sort } : {}),
  ...(order ? { order } : {}),
  ...(per_page ? { limit: per_page } : {}),
  ...(page ? { offset: page } : {})
});

const initialize = () =>`
  INSERT INTO workflow (short_name, version, long_name, description)
  VALUES ({{short_name}}, {{version}}, {{long_name}}, {{description}})
  RETURNING id
`;

const createStep = (params) => sql.insert({
  ...{
    table: `step (${params.step_id ? 'step_id,': ''} step_name, type, action_id, form_id, service_id, step_status_label, data)`,
    values: {
      type: 'values_list',
      items: [
        ...(params.step_id ? ['{{step_id}}'] : []),
        '{{step_name}}', '{{type}}',
        params.action_id? '{{action_id}}':'null',
        params.form_id? '{{form_id}}':'null',
        params.service_id? '{{service_id}}':'null',
        params.step_status_label? '{{step_status_label}}':'null',
        params.data? '{{data}}':'null',
      ]
    }
  },
  ...(params.step_id ? {conflict:{
    constraints: ['step_id'],
    update:{
      type:'update',
      set:[{cmd:'step_name = EXCLUDED.step_name, type = EXCLUDED.type, action_id = EXCLUDED.action_id, form_id = EXCLUDED.form_id, service_id = EXCLUDED.service_id, step_status_label = EXCLUDED.step_status_label, data = EXCLUDED.data'}]
    }
  }} : {}),
  ...{
    returning: ['*']
  }
})

const findById = () => `${findAll()} WHERE workflow.id = {{id}}`;

const clearSteps = () => `DELETE FROM step_edge WHERE step_edge.workflow_id = {{id}}`;

const addStep = (params) => `
  INSERT INTO step_edge (workflow_id, step_name, next_step_name${params.step_message? ', step_message':''})
  VALUES ({{workflow_id}}, {{step_name}}, {{next_step_name}}${params.step_message? ', {{step_message}}':''})
`;

const addClose = () => `
  INSERT INTO step_edge (workflow_id, step_name)
  VALUES ({{workflow_id}}, 'close')
`;

const updateWorkflowMetaData = () =>`
  UPDATE workflow
  SET version = {{version}}, description = {{description}}
  WHERE id = {{id}}
  RETURNING *`;

const deleteWorkflow = () =>`
DELETE FROM workflow WHERE id = {{id}}
`;

const getLongName = () => `
SELECT long_name FROM workflow WHERE id = {{id}}
`;

module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.clearSteps = clearSteps;
module.exports.addStep = addStep;
module.exports.addClose = addClose;
module.exports.updateWorkflowMetaData = updateWorkflowMetaData;
module.exports.initialize = initialize;
module.exports.createStep = createStep;
module.exports.deleteWorkflow = deleteWorkflow;
module.exports.getLongName = getLongName;