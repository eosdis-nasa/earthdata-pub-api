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

const findById = `
SELECT
	submission.id,
	submission_status.workflow_id,
	workflow.workflow_name,
	step.step_name,
	step.status,
	submission_action_data.action_data,
	submission_form_data.form_data,
	submission_metadata.metadata,
	submission.created_at,
	submission_status.last_change,
    (EXISTS(SELECT edpuser_id FROM submission_lock WHERE submission_lock.id = submission.id)) "lock" FROM submission
NATURAL JOIN submission_status
NATURAL JOIN submission_metadata
NATURAL JOIN submission_action_data
NATURAL JOIN submission_form_data
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

const getMetadata = `
SELECT submission_metadata.*
FROM submission_metadata
WHERE submission_metadata.id = {{submission.id}}`;

const getFormData = `
SELECT submission_form_data.*
FROM submission_form_data
WHERE submission_form_data.id = {{submission.id}}`;

const getActionData = `
SELECT submission_action_data.*
FROM submission_action_data
WHERE submission_action_data.id = {{submission.id}}`;

const getNextstep = `
SELECT submission_status.workflow_id, step_edge.next_step_name step_name
FROM step
NATURAL JOIN submission_status
NATURAL JOIN step_edge
WHERE submission_status.id = {{submission.id}}`;

const promoteStep = `
UPDATE submission_status
SET last_change = NOW(),
SET step_name = (
  SELECT step_edge.next_step_name step_name
  FROM step
  NATURAL JOIN submission_status
  NATURAL JOIN step_edge
  WHERE submission_status.id = {{submission.id}})
WHERE submission_status.id = {{submission.id}}`;

module.exports.findAll = findAll;
module.exports.findById = findById;
