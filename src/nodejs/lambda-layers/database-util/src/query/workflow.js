const sql = require('./sql-builder.js');

const findAll = () => `
  SELECT
    workflow.*, steps
  FROM workflow
  LEFT JOIN (
    SELECT
    step_edge_details.workflow_id,
      JSONB_OBJECT_AGG( step.step_name,
        JSONB_STRIP_NULLS(JSONB_BUILD_OBJECT(
          'step_id', step.step_id,
          'type', step.type,
          'action_id', step.action_id,
          'form_id', step.form_id,
          'service_id', step.service_id,
          'next_step_name', step_edge_details.next_step_name,
          'prev_step_name', step_edge_details.prev_step_name,
          'prev_step', step.data
      ))) steps
    FROM step
    NATURAL LEFT JOIN (
      SELECT  *
      FROM step_edge
      NATURAL FULL OUTER JOIN (
        SELECT workflow_id, next_step_name step_name, step_name prev_step_name
        FROM step_edge
      ) back_edge
    ) step_edge_details
    group by step_edge_details.workflow_id
  ) step_json ON step_json.workflow_id = workflow.id
`;

const initialize = () =>`
  INSERT INTO workflow (short_name, version, long_name, description)
  VALUES ({{short_name}}, {{version}}, {{long_name}}, {{description}})
  RETURNING id
`;

const createStep = (params) => sql.insert({
  table: 'step (step_name, type, action_id, form_id, service_id, data)',
  values: {
    type: 'values_list',
    items: [
      '{{step_name}}', '{{type}}', 
      params.action_id? '{{action_id}}':'null',
      params.form_id? '{{form_id}}':'null',
      params.service_id? '{{service_id}}':'null',
      params.data? '{{data}}':'null'
    ]
  },
  conflict:{
    constraints: ['step_name'],
    update:{
      type:'update',
      set:[{cmd:'type = EXCLUDED.type, action_id = EXCLUDED.action_id, form_id = EXCLUDED.form_id, service_id = EXCLUDED.service_id, data = EXCLUDED.data'}]
    }
  }
})

const findById = () => `${findAll()} WHERE workflow.id = {{id}}`;

const clearSteps = () => `DELETE FROM step_edge WHERE step_edge.workflow_id = {{id}}`;

const addStep = () => `
  INSERT INTO step_edge (workflow_id, step_name, next_step_name)
  VALUES ({{workflow_id}}, {{step_name}}, {{next_step_name}})
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

module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.clearSteps = clearSteps;
module.exports.addStep = addStep;
module.exports.addClose = addClose;
module.exports.updateWorkflowMetaData = updateWorkflowMetaData;
module.exports.initialize = initialize;
module.exports.createStep = createStep;
module.exports.deleteWorkflow = deleteWorkflow;
