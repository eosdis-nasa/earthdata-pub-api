const findAll = 'SELECT workflow.* FROM workflow';
const findAllEx = `
  SELECT
    workflow.*, steps
  FROM workflow
  LEFT JOIN (
    SELECT
      step.workflow_id,
      JSONB_OBJECT_AGG(step.step_name,
      JSONB_STRIP_NULLS(JSONB_BUILD_OBJECT(
      'type', step.type,
      'action_id', step.action_id,
      'form_id', step.form_id,
      'service_id', step.service_id,
      'next_step_name', step_edge.next_step_name,
      'prev_step_name', back_edge.prev_step_name
    ))) steps
    FROM step
    NATURAL LEFT JOIN step_edge
    NATURAL LEFT JOIN (
      SELECT step_edge.workflow_id, step_edge.next_step_name step_name, step_edge.step_name prev_step_name
      FROM step_edge) back_edge
    GROUP BY step.workflow_id) step_json
    ON step_json.workflow_id = workflow.id`;
const findById = `${findAllEx} WHERE workflow.id = {{workflow.id}}`;

module.exports.findAll = findAll;
module.exports.findAllEx = findAllEx;
module.exports.findById = findById;
