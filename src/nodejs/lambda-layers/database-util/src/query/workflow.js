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
          'type', step.type,
          'action_id', step.action_id,
          'form_id', step.form_id,
          'service_id', step.service_id,
          'next_step_name', step_edge_details.next_step_name,
          'prev_step_name', step_edge_details.prev_step_name
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
const findById = () => `${findAll()} WHERE workflow.id = {{id}}`;

module.exports.findAll = findAll;
module.exports.findById = findById;
