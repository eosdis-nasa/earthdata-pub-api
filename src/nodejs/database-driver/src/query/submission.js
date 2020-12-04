const findAll = `
SELECT
  submission.id,
  submission_status.workflow_id,
  workflow.workflow_name,
  step.step_name,
  step.step_type,
  step.status_message,
  submission.created_at,
  submission_status.last_change,
    (EXISTS(SELECT edpuser_id FROM submission_lock WHERE submission_lock.id = submission.id)) "lock" FROM submission
NATURAL JOIN submission_status
NATURAL JOIN (
  SELECT
    workflow_id,
    step_name,
    type step_type,
    (CASE
    WHEN type = 'init' THEN 'Initialized'
      WHEN type = 'form' THEN 'Pending Form Submittal'
    WHEN type = 'review' THEN 'Pending Review'
    WHEN type = 'service' THEN 'Pending Service Completion'
    WHEN type = 'action' THEN 'Processing Action'
    WHEN type = 'close' THEN 'Ready'
  END) status_message
  FROM step) step
LEFT JOIN workflow ON workflow.id = submission_status.workflow_id`;

const findShortById = `
SELECT submission.*
FROM submission
WHERE submission.id = {{submission.id}}`;

const findById = `
SELECT
  submission.id,
  submission_status.workflow_id,
  workflow.workflow_name,
  step.step_name,
  step.status,
  COALESCE(submission_action_data.action_data, '{}'::JSONB) action_data,
  COALESCE(submission_form_data.form_data, '{}'::JSONB) form_data,
  submission_metadata.metadata,
  submission.created_at,
  submission_status.last_change,
    (EXISTS(SELECT edpuser_id FROM submission_lock WHERE submission_lock.id = submission.id)) "lock" FROM submission
NATURAL JOIN submission_status
NATURAL JOIN submission_metadata
NATURAL LEFT JOIN (
  SELECT
  submission_action_data.id,
  COALESCE(JSONB_OBJECT_AGG(submission_action_data.action_id, data), '{}'::JSONB) action_data
  FROM submission_action_data
  GROUP BY submission_action_data.id) submission_action_data
NATURAL LEFT JOIN (
  SELECT
  submission_form_data.id,
  COALESCE(JSONB_OBJECT_AGG(submission_form_data.form_id, data), '{}'::JSONB) form_data
  FROM submission_form_data
  GROUP BY submission_form_data.id) submission_form_data
NATURAL JOIN (
  SELECT
    workflow_id,
    step_name,
    (CASE
    WHEN type = 'init' THEN 'Initialized'
    WHEN type = 'form' THEN 'Pending Form Submittal'
    WHEN type = 'review' THEN 'Pending Review'
    WHEN type = 'service' THEN 'Pending Service Completion'
    WHEN type = 'action' THEN 'Processing Action'
    WHEN type = 'close' THEN 'Ready'
  END) status
  FROM step) step
LEFT JOIN workflow ON workflow.id = submission_status.workflow_id
WHERE submission.id = {{submission.id}}`;

const initialize = `
INSERT INTO submission(initiator_edpuser_id)
VALUES ({{user.id}})
RETURNING *`;

const getMetadata = `
SELECT submission_metadata.*
FROM submission_metadata
WHERE submission_metadata.id = {{submission.id}}`;

const updateMetadata = `
UPDATE submission_metadata
SET metadata = {{submission.metadata}}::JSONB
WHERE id = {{submission.id}}`;

const getFormData = `
SELECT
submission_form_data.id,
COALESCE(JSONB_OBJECT_AGG(submission_form_data.form_id, data), '{}'::JSONB) form_data
FROM submission_form_data
GROUP BY submission_form_data.id
WHERE submission_form_data.id = {{submission.id}}`;

const updateFormData = `
INSERT INTO submission_form_data(id, form_id, data) VALUES
({{submission.id}}, {{form.id}}, {{form.data}}::JSONB)
ON CONFLICT (id, form_id) DO UPDATE SET
data = EXCLUDED.data
RETURNING *`;

const getActionData = `
SELECT
submission_form_data.id,
COALESCE(JSONB_OBJECT_AGG(submission_form_data.form_id, data), '{}'::JSONB) form_data
FROM submission_form_data
GROUP BY submission_form_data.id
WHERE submission_action_data.id = {{submission.id}}`;

const updateActionData = `
INSERT INTO submission_action_data(id, action_id, data) VALUES
({{submission.id}}, {{action.id}}, {{action.data}}::JSONB)
ON CONFLICT (id, action_id) DO UPDATE SET
data = EXCLUDED.data
RETURNING *`;

const getState = `
SELECT submission_status.*, step.*, workflows
FROM submission_status
NATURAL JOIN step
NATURAL JOIN (
  SELECT
    submission_workflow.id,
    JSONB_OBJECT_AGG(submission_workflow.workflow_id,
      JSONB_STRIP_NULLS(JSONB_BUILD_OBJECT(
        'start_time', submission_workflow.start_time,
        'complete_time', submission_workflow.complete_time
    ))) workflows
  FROM submission_workflow
  GROUP BY submission_workflow.id) submission_workflow
WHERE submission_status.id = {{submission.id}}`;

const applyWorkflow = `
WITH sub AS
(INSERT INTO submission_workflow(id, workflow_id)
VALUES({{submission.id}}, {{workflow.id}}))
UPDATE submission_status SET
workflow_id = {{workflow.id}},
step_name = 'init'
WHERE submission_status.id = {{submission.id}}
RETURNING *`;

const getNextstep = `
SELECT submission_status.workflow_id, step_edge.next_step_name step_name
FROM step
NATURAL JOIN submission_status
NATURAL JOIN step_edge
WHERE submission_status.id = {{submission.id}}`;

const promoteStep = `
UPDATE submission_status SET
last_change = NOW(),
step_name = (
  SELECT step_edge.next_step_name step_name
  FROM step
  NATURAL JOIN submission_status
  NATURAL JOIN step_edge
  WHERE submission_status.id = {{submission.id}})
WHERE submission_status.id = {{submission.id}}
RETURNING *`;

module.exports.findAll = findAll;
module.exports.findShortById = findShortById;
module.exports.findById = findById;
module.exports.initialize = initialize;
module.exports.getNextstep = getNextstep;
module.exports.promoteStep = promoteStep;
module.exports.getState = getState;
module.exports.getMetadata = getMetadata;
module.exports.updateMetadata = updateMetadata;
module.exports.getActionData = getActionData;
module.exports.updateActionData = updateActionData;
module.exports.getFormData = getFormData;
module.exports.updateFormData = updateFormData;
module.exports.applyWorkflow = applyWorkflow;
