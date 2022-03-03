const sql = require('./sql-builder.js');
const workflow = require('./workflow.js');

const table = 'submission';
// const allFields = ['id', 'name', 'user_id', 'daac_id', 'conversation_id', 'workflow_id', 'workflow_name', 'step_name', 'status', 'forms', 'action_data', 'form_data', 'metadata', 'created_at', 'last_change', 'lock'];
const allFields = ['id', 'name', 'initiator', 'workflow_id', 'hidden', 'conversation_id', 'workflow_name', 'daac_id', 'step_data', 'step_name', 'status', 'forms', 'action_data', 'form_data', 'metadata', 'created_at', 'last_change', 'lock'];
const fieldMap = {
  id: 'submission.id',
  name: 'submission.name',
  initiator: 'initiator_ref.initiator',
  user_id: 'submission.initiator_edpuser_id user_id',
  daac_id: 'submission.daac_id',
  conversation_id: 'submission.conversation_id',
  hidden: 'submission.hidden',
  workflow_id: 'submission_status.workflow_id',
  workflow_name: 'workflow.long_name workflow_name',
  step_name: 'step.step_name',
  step_data: 'step.step_data',
  status: 'step.status',
  forms: 'forms',
  action_data: 'COALESCE(submission_action_data.action_data, \'{}\'::JSONB) action_data',
  form_data: 'COALESCE(submission_form_data.form_data, \'{}\'::JSONB) form_data',
  metadata: 'submission_metadata.metadata',
  created_at: 'submission.created_at',
  last_change: 'submission_status.last_change',
  lock: '(EXISTS(SELECT edpuser_id FROM submission_lock WHERE submission_lock.id = submission.id)) "lock"'
};
const refs = {
  initiator_ref: {
    type: 'left_join',
    src: {
      type: 'select',
      fields: [
        'edpuser.id initiator_id',
        {
          type: 'json_obj',
          keys: [
            ['id', 'edpuser.id'],
            ['name', 'edpuser.name'],
            ['email', 'edpuser.email']
          ],
          alias: 'initiator'
        }
      ],
      from: { base: 'edpuser' },
      alias: 'initiator_ref'
    },
    on: { left: 'submission.initiator_edpuser_id', right: 'initiator_ref.initiator_id' }
  },
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
      fields: ['submission_action_data.id', 'COALESCE(JSONB_OBJECT_AGG(submission_action_data.action_id, data), \'{}\'::JSONB) action_data'],
      from: { base: 'submission_action_data' },
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
            sort: 'submitted_at'
          },
          fallback: '\'{}\'::JSONB',
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
      from: {
        base: 'submission_form_data',
        joins: [{
          type: 'left_join',
          src: 'form',
          on: { left: 'submission_form_data.form_id', right: 'form.id' }
        }]
      },
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
        },
        {
          type: 'json_obj',
          keys: [
            ['type', 'step.type'],
            ['name', 'step.step_name'],
            ['action_id', 'step.action_id'],
            ['form_id', 'step.form_id'],
            ['service_id', 'step.service_id'],
            ['data', 'step.data']
          ],
          strip: true,
          alias: 'step_data'
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

const fields = (list) => list.map((field) => fieldMap[field]);

const findById = (params) => sql.select({
  fields: fields(allFields),
  from: {
    base: table,
    joins: [refs.submission_status, refs.initiator_ref, refs.submission_metadata, refs.submission_action_data, refs.submission_form_data, refs.step, refs.workflow]
  },
  where: {
    filters: [{ field: fieldMap.id, param: 'id' }]
  }
});

const getUsersSubmissions = (params) => sql.select({
  fields: fields(allFields),
  from: {
    base: table,
    joins: [refs.submission_status, refs.initiator_ref, refs.submission_metadata, refs.submission_action_data, refs.submission_form_data, refs.step, refs.workflow]
  },
  where: {
    filters: [
      ...([{ field: 'submission.initiator_edpuser_id', param: 'user_id' }]),
      ...([{ field: 'submission.hidden', op: params.hidden ? 'is' : 'is_not', value: 'true'}])
    ]
  },
  sort: fieldMap.last_change,
  order: 'DESC'
});

const getDaacSubmissions = (params) => sql.select({
  fields: fields(allFields),
  from: {
    base: table,
    joins: [refs.submission_status, refs.initiator_ref, refs.submission_metadata, refs.submission_action_data, refs.submission_form_data, refs.step, refs.workflow]
  },
  where: {
    filters: [
      ...([{
      field: 'submission.daac_id',
      any: {
        values: {
          type: 'select',
          fields: ['daac.id'],
          from: {
            base: 'daac',
            joins: [{
              type: 'left_join',
              src: 'edpuser_edpgroup',
              on: { left: 'daac.edpgroup_id', right: 'edpuser_edpgroup.edpgroup_id' }
            }]
          },
          where: {
            filters: [{ field: 'edpuser_edpgroup.edpuser_id', param: 'user_id' }]
          }
        }
      }
    }]),
    ...([{ field: 'submission.hidden', op: params.hidden ? 'is' : 'is_not', value: 'true'}])
    ]
  },
  sort: fieldMap.last_change,
  order: 'DESC'
});

const getAdminSubmissions = (params) => sql.select({
  fields: fields(allFields),
  from: {
    base: table,
    joins: [refs.submission_status, refs.initiator_ref, refs.submission_metadata, refs.submission_action_data, refs.submission_form_data, refs.step, refs.workflow]
  },
  where: {
    filters: [
        ...([{ field: 'submission.hidden', op: params.hidden ? 'is' : 'is_not', value: 'true'}])
    ]
  },
  sort: fieldMap.last_change,
  order: 'DESC'
});

const findAll = ({
  name, user_id, daac_id, workflow_id, workflow_name, step_name, step_type,
  status, created_before, created_after, last_change_before, last_change_after, hidden, sort, order,
  per_page, page
}) => sql.select({
  fields: [fieldMap.id, fieldMap.name, fieldMap.conversation_id, fieldMap.workflow_id, fieldMap.workflow_name, fieldMap.step_name, fieldMap.status, fieldMap.created_at, fieldMap.last_change, fieldMap.hidden],
  from: {
    base: table,
    joins: [refs.submission_status, refs.step, refs.workflow]
  },
  where: {
    filters: [
      ...(name ? [{ field: 'submission.name', param: 'name' }] : []),
      ...(user_id ? [{ field: 'submission.initiator_edpuser_id', param: 'user_id' }] : []),
      ...(daac_id ? [{ field: 'submission.daac_id', param: 'daac_id' }] : []),
      ...(workflow_id ? [{ field: 'submission_status.workflow_id', param: 'workflow_id' }] : []),
      ...(workflow_name ? [{ field: 'workflow.long_name', param: 'workflow_name' }] : []),
      ...(step_name ? [{ field: 'step.step_name', param: 'step_name' }] : []),
      ...(status ? [{ field: 'step.status', param: 'status' }] : []),
      ...(step_type ? step_type.startsWith('!') ? [{ field: 'step.type', op: 'ne', value: `'${step_type.substring(1)}'` }] :
          [{ field: 'step.type', param: 'step_type' }] : []),
      ...(created_after ? [{ field: 'submission.created_at', op: 'gte', param: 'created_after' }] : []),
      ...(created_before ? [{ field: 'submission.created_at', op: 'lte', param: 'created_before' }] : []),
      ...(last_change_after ? [{ field: 'submission_status.last_change', op: 'gte', param: 'last_change_after' }] : []),
      ...(last_change_before ? [{ field: 'submission_status.last_change', op: 'lte', param: 'last_change_before' }] : []),
      ...(typeof(hidden)=='undefined' ? [] : (hidden==='false' || hidden===false) ? [{ cmd: 'NOT submission.hidden'}] : [{ cmd: 'submission.hidden'}]),
    ]
  },
  ...(sort ? { sort } : {}),
  ...(order ? { order } : {}),
  ...(per_page ? { limit: per_page } : {}),
  ...(page ? { offset: page } : {})
});

const findShortById = () => `
SELECT submission.*
FROM submission
WHERE submission.id = {{id}}`;

const initialize = (params) => `
INSERT INTO submission(initiator_edpuser_id${params.daac_id ? ', daac_id' : ''}${params.name ? ', name' : ''})
VALUES ({{user_id}}${params.daac_id ? ', {{daac_id}}' : ''}${params.name ? ', {{name}}' : ''})
RETURNING *`;

const updateName = () => `
UPDATE submission
SET name = {{name}}
WHERE id = {{id}}
RETURNING *`;

const updateDaac = () => `
UPDATE submission
SET daac_id = {{daac_id}}
WHERE id = {{id}}
RETURNING *`;

const updateConversation = () => `
UPDATE submission
SET conversation_id = {{conversation_id}}
WHERE id = {{id}}
RETURNING *`;

const getMetadata = () => `
SELECT submission_metadata.*
FROM submission_metadata
WHERE submission_metadata.id = {{id}}`;

const updateMetadata = () => `
UPDATE submission_metadata
SET metadata = {{metadata}}::JSONB
WHERE id = {{id}}
RETURNING *`;

const getFormData = () => `
SELECT
submission_form_data.id,
COALESCE(JSONB_OBJECT_AGG(data ORDER BY submitted_at ASC), '{}'::JSONB) form_data
FROM submission_form_data
GROUP BY submission_form_data.id
WHERE submission_form_data.id = {{id}}`;

const updateFormData = () => `
INSERT INTO submission_form_data(id, form_id, data) VALUES
({{id}}, {{form_id}}, {{data}}::JSONB)
ON CONFLICT (id, form_id) DO UPDATE SET
data = EXCLUDED.data
RETURNING *`;

const getActionData = () => `
SELECT
submission_form_data.id,
COALESCE(JSONB_OBJECT_AGG(submission_form_data.form_id, data), '{}'::JSONB) form_data
FROM submission_form_data
GROUP BY submission_form_data.id
WHERE submission_action_data.id = {{id}}`;

const updateActionData = () => `
INSERT INTO submission_action_data(id, action_id, data) VALUES
({{id}}, {{action_id}}, {{data}}::JSONB)
ON CONFLICT (id, action_id) DO UPDATE SET
data = EXCLUDED.data
RETURNING *`;

const getState = () => `
SELECT submission.conversation_id, submission.daac_id, submission_status.*, step_data.step, workflows
FROM submission_status
NATURAL JOIN submission
NATURAL JOIN (
  SELECT
    step.workflow_id,
    step.step_name,
    JSONB_STRIP_NULLS(JSONB_BUILD_OBJECT(
      'type', step.type,
      'name', step.step_name,
      'action_id', step.action_id,
      'form_id', step.form_id,
      'service_id', step.service_id,
      'data', step.data
    )) step
  FROM step) step_data
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
WHERE submission_status.id = {{id}}`;

const applyWorkflow = () => `
WITH sub AS
(INSERT INTO submission_workflow(id, workflow_id)
VALUES({{id}}, {{workflow_id}}))
UPDATE submission_status SET
workflow_id = {{workflow.id}},
step_name = 'init'
WHERE submission_status.id = {{id}}
RETURNING *`;

const getNextstep = () => `
SELECT submission_status.workflow_id, step_edge.next_step_name step_name
FROM step
NATURAL JOIN submission_status
NATURAL JOIN step_edge
WHERE submission_status.id = {{id}}`;

const promoteStep = () => `
UPDATE submission_status SET
last_change = NOW(),
step_name = (
  SELECT step_edge.next_step_name step_name
  FROM step
  NATURAL JOIN submission_status
  NATURAL JOIN step_edge
  WHERE submission_status.id = {{id}})
WHERE submission_status.id = {{id}}
RETURNING *`;

const rollback = (params) => `
UPDATE submission_status SET
last_change = NOW(),
step_name = (
  SELECT step_edge.step_name step_name
  FROM step_edge
  WHERE step_edge.workflow_id = submission_status.workflow_id
  AND step_edge.next_step_name = {{rollback}})
WHERE submission_status.id = {{id}}
RETURNING *`;

const reassignWorkflow = () => `
WITH  close_current AS (UPDATE submission_workflow SET complete_time=NOW() WHERE id={{id}} RETURNING *),
      update_status AS (UPDATE submission_status SET workflow_id={{workflowId}}, step_name='init', last_change=NOW() WHERE id ={{id}}),
      open_new AS (INSERT INTO submission_workflow (id, workflow_id, start_time) VALUES ({{id}}, {{workflowId}}, NOW()))
SELECT * from close_current;
`;

const withdrawSubmission = () => `
UPDATE submission SET
hidden='true'
WHERE id={{id}}
RETURNING *`;

const restoreSubmission = () => `
UPDATE submission SET
hidden='false'
WHERE id={{id}}
RETURNING *`;

module.exports.findAll = findAll;
module.exports.findShortById = findShortById;
module.exports.findById = findById;
module.exports.getUsersSubmissions = getUsersSubmissions;
module.exports.getDaacSubmissions = getDaacSubmissions;
module.exports.getAdminSubmissions = getAdminSubmissions;
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
module.exports.rollback = rollback;
module.exports.reassignWorkflow = reassignWorkflow;
module.exports.withdrawSubmission = withdrawSubmission;
module.exports.restoreSubmission = restoreSubmission;