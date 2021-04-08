const sql = require('./sql-builder.js');
const workflow = require('./workflow.js');

const table = "submission";
// const allFields = ['id', 'name', 'user_id', 'daac_id', 'conversation_id', 'workflow_id', 'workflow_name', 'step_name', 'status', 'forms', 'action_data', 'form_data', 'metadata', 'created_at', 'last_change', 'lock'];
const allFields = ['id', 'name', 'workflow_id', 'workflow_name', 'daac_id', 'step_name', 'status', 'forms', 'action_data', 'form_data', 'metadata', 'created_at', 'last_change', 'lock'];
const fieldMap = {
  id: 'submission.id',
  name: 'submission.name',
  user_id: 'submission.initiator_edpuser_id user_id',
  daac_id: 'submission.daac_id',
  conversation_id: 'submission.conversation_id',
  workflow_id: 'submission_status.workflow_id',
  workflow_name: 'workflow.long_name workflow_name',
  daac_id: 'submission.daac_id',
  step_name: 'step.step_name',
  status: 'step.status',
  forms: 'forms',
  action_data: `COALESCE(submission_action_data.action_data, '{}'::JSONB) action_data`,
  form_data: `COALESCE(submission_form_data.form_data, '{}'::JSONB) form_data`,
  metadata: 'submission_metadata.metadata',
  created_at: 'submission.created_at',
  last_change: 'submission_status.last_change',
  lock: '(EXISTS(SELECT edpuser_id FROM submission_lock WHERE submission_lock.id = submission.id)) "lock"'
};
const refs = {
  submission_status: {
    type: 'natural_join',
    src: 'submission_status'
  },
  submission_metadata: {
    type: 'natural_join',
    src: 'submission_metadata'
  },
  submission_action_data: {
    type: 'natural_left_join',
    src: {
      type: 'select',
      fields: ['submission_action_data.id', `COALESCE(JSONB_OBJECT_AGG(submission_action_data.action_id, data), '{}'::JSONB) action_data`],
      from: { base: 'submission_action_data'},
      group: 'submission_action_data.id',
      alias: 'submission_action_data'
    }
  },
  submission_form_data: {
    type: 'natural_left_join',
    src: {
      type: 'select',
      fields: [
        'submission_form_data.id',
        {
          type: 'coalesce',
          src: {
            type: 'json_merge_agg',
            src: 'submission_form_data.data',
            order: 'submitted_at'
          },
          fallback: `'{}'::JSONB`,
          alias: 'form_data'
        },
        {
          type: 'json_agg',
          src: {
            type: 'json_obj',
            keys: [
              ['id', 'form.id'],
              ['short_name', 'form.short_name'],
              ['long_name', 'form.long_name'],
              ['submitted_at', 'submission_form_data.submitted_at']
            ]
          },
          alias: 'forms'
        }],
      from: { base: 'submission_form_data', joins: [{
        type: 'left_join',
        src: 'form',
        on: { left: 'submission_form_data.form_id', right: 'form.id' }
      }] },
      group: 'submission_form_data.id',
      alias: 'submission_form_data'
    }
  },
  step: {
    type: 'natural_join',
    src: {
      type: 'select',
      fields: [
        'step.workflow_id',
        'step.step_name',
        'step.type',
        {
          type: 'case',
          when: [
            { field: 'type', value: 'init', result: 'Initialized' },
            { field: 'type', value: 'form', result: 'Pending Form Submittal' },
            { field: 'type', value: 'review', result: 'Pending Review' },
            { field: 'type', value: 'service', result: 'Pending Service Completion' },
            { field: 'type', value: 'action', result: 'Processing Action' },
            { field: 'type', value: 'close', result: 'Ready' }
          ],
          alias: 'status'
        }
      ],
      from: { base: 'step' },
      alias: 'step'
    }
  },
  workflow: {
    type: 'left_join',
    src: 'workflow',
    on: { left: 'workflow.id', right: 'submission_status.workflow_id' }
  }
};

const fields = (list) => {
  return list.map(field => fieldMap[field]);
}

const findById = (params) => sql.select({
  fields: fields(allFields),
  from: {
    base: table,
    joins: [refs.submission_status, refs.submission_metadata, refs.submission_action_data, refs.submission_form_data, refs.step, refs.workflow]
  },
  where: {
    filters: [{ field: fieldMap.id }]
  }
});

const getUsersSubmissions = (params) => sql.select({
  fields: fields(allFields),
  from: {
    base: table,
    joins: [refs.submission_status, refs.submission_metadata, refs.submission_action_data, refs.submission_form_data, refs.step, refs.workflow]
  },
  where: {
    filters: [{ field: 'submission.initiator_edpuser_id', param: 'user_id' }]
  },
  order: fieldMap.last_change,
  sort: 'DESC'
});

const findAll = ({ name, user_id, daac_id, workflow_id, workflow_name, step_name, step_type,
  status, created_before, created_after, last_change_before, last_change_after, sort, order,
  per_page, page}) => sql.select({
  fields: [fieldMap.id, fieldMap.name, fieldMap.conversation_id, fieldMap.workflow_id, fieldMap.workflow_name, fieldMap.step_name, fieldMap.status, fieldMap.created_at, fieldMap.last_change],
  from: {
    base: table,
    joins: [refs.submission_status, refs.step, refs.workflow]
  },
  where: {
    filters: [
      ...(name ? [{ field: 'submission.name', param: 'name'}] : []),
      ...(user_id ? [{ field: 'submission.initiator_edpuser_id', param: 'user_id'}] : []),
      ...(daac_id ? [{ field: 'submission.daac_id', param: 'daac_id'}] : []),
      ...(workflow_id ? [{ field: 'submission_status.workflow_id', param: 'workflow_id'}] : []),
      ...(workflow_name ? [{ field: 'workflow.long_name', param: 'workflow_name'}] : []),
      ...(step_name ? [{ field: 'step.step_name', param: 'step_name'}] : []),
      ...(status ? [{ field: 'step.status', param: 'status'}] : []),
      ...(step_type ? [{ field: 'step.step_type', param: 'step_type'}] : []),
      ...(created_after ? [{ field: 'submission.created_at', op: 'gte', param: 'created_after'}] : []),
      ...(created_before ? [{ field: 'submission.created_at', op: 'lte', param: 'created_before'}] : []),
      ...(last_change_after ? [{ field: 'submission_status.last_change', op: 'gte', param: 'last_change_after'}] : []),
      ...(last_change_before ? [{ field: 'submission_status.last_change', op: 'lte', param: 'last_change_before'}] : [])
    ]
  },
  ...(order ? { order } : {}),
  ...(sort ? { sort } : {}),
  ...(per_page ? { limit: per_page } : {}),
  ...(page ? { offset: page } : {})
});

const findShortById = () => `
SELECT submission.*
FROM submission
WHERE submission.id = {{submission.id}}`;

const initialize = (params) => `
INSERT INTO submission(initiator_edpuser_id${params.daac_id ? `, daac_id` : ``})
VALUES ({{user_id}}${params.daac_id ? `, {{daac_id}}` : ``})
RETURNING *`;

const updateName = () => `
UPDATE submission
SET name = {{submission.name}}
WHERE id = {{submission.id}}
RETURNING *`;

const updateDaac = () => `
UPDATE submission
SET daac_id = {{submission.daac_id}}
WHERE id = {{submission.id}}
RETURNING *`;

const updateConversation = () => `
UPDATE submission
SET conversation_id = {{conversation_id}}
WHERE id = {{id}}
RETURNING *`;

const getMetadata = () => `
SELECT submission_metadata.*
FROM submission_metadata
WHERE submission_metadata.id = {{submission.id}}`;

const updateMetadata = () => `
UPDATE submission_metadata
SET metadata = {{submission.metadata}}::JSONB
WHERE id = {{submission.id}}
RETURNING *`;

const getFormData = () => `
SELECT
submission_form_data.id,
COALESCE(JSONB_OBJECT_AGG(data ORDER BY submitted_at ASC), '{}'::JSONB) form_data
FROM submission_form_data
GROUP BY submission_form_data.id
WHERE submission_form_data.id = {{submission.id}}`;

const updateFormData = () => `
INSERT INTO submission_form_data(id, form_id, data) VALUES
({{submission.id}}, {{form.id}}, {{form.data}}::JSONB)
ON CONFLICT (id, form_id) DO UPDATE SET
data = EXCLUDED.data
RETURNING *`;

const getActionData = () => `
SELECT
submission_form_data.id,
COALESCE(JSONB_OBJECT_AGG(submission_form_data.form_id, data), '{}'::JSONB) form_data
FROM submission_form_data
GROUP BY submission_form_data.id
WHERE submission_action_data.id = {{submission.id}}`;

const updateActionData = () => `
INSERT INTO submission_action_data(id, action_id, data) VALUES
({{submission.id}}, {{action.id}}, {{action.data}}::JSONB)
ON CONFLICT (id, action_id) DO UPDATE SET
data = EXCLUDED.data
RETURNING *`;

const getState = () => `
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

const applyWorkflow = () => `
WITH sub AS
(INSERT INTO submission_workflow(id, workflow_id)
VALUES({{submission.id}}, {{workflow.id}}))
UPDATE submission_status SET
workflow_id = {{workflow.id}},
step_name = 'init'
WHERE submission_status.id = {{submission.id}}
RETURNING *`;

const getNextstep = () => `
SELECT submission_status.workflow_id, step_edge.next_step_name step_name
FROM step
NATURAL JOIN submission_status
NATURAL JOIN step_edge
WHERE submission_status.id = {{submission.id}}`;

const promoteStep = () => `
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
module.exports.getUsersSubmissions = getUsersSubmissions;
module.exports.initialize = initialize;
module.exports.getNextstep = getNextstep;
module.exports.promoteStep = promoteStep;
module.exports.updateName = updateName;
module.exports.updateDaac = updateDaac;
module.exports.updateConversation = updateConversation;
module.exports.getState = getState;
module.exports.getMetadata = getMetadata;
module.exports.updateMetadata = updateMetadata;
module.exports.getActionData = getActionData;
module.exports.updateActionData = updateActionData;
module.exports.getFormData = getFormData;
module.exports.updateFormData = updateFormData;
module.exports.applyWorkflow = applyWorkflow;
