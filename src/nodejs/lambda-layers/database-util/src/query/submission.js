const util = require('./utils.js');
const sql = require('./sql-builder.js');
const workflow = require('./workflow.js');

const table = 'submission';
// const allFields = ['id', 'name', 'user_id', 'daac_id', 'conversation_id', 'workflow_id', 'workflow_name', 'step_name', 'status', 'forms', 'action_data', 'form_data', 'metadata', 'created_at', 'last_change', 'lock'];

const allFields = ['id', 'name', 'initiator', 'workflow_id', 'hidden', 'conversation_id', 'workflow_name', 'daac_id', 'daac_name', 'step_data', 'step_status_label', 'step_name', 'status', 'forms', 'action_data', 'form_data', 'metadata', 'created_at', 'last_change', 'lock', 'contributor_ids', 'copy', 'origin_id'];
const customFields = ['id', 'name', 'data_producer_name', 'initiator', 'workflow_id', 'hidden', 'conversation_id', 'workflow_name', 'daac_id', 'daac_name', 'step_data', 'step_status_label', 'step_name', 'status', 'created_at', 'last_change', 'lock', 'contributor_ids', 'copy', 'origin_id'];

const fieldMap = {
  id: 'submission.id',
  name: 'submission.name',
  data_producer_name: 'submission.data_producer_name',
  initiator: 'initiator_ref.initiator',
  user_id: 'submission.initiator_edpuser_id user_id',
  daac_id: 'submission.daac_id',
  daac_name: 'daac.long_name daac_name',
  conversation_id: 'submission.conversation_id',
  hidden: 'submission.hidden',
  workflow_id: 'submission_status.workflow_id',
  workflow_name: 'workflow.long_name workflow_name',
  step_name: 'step.step_name',
  step_status_label: 'step.step_status_label',
  step_data: 'step.step_data',
  status: 'step.status',
  forms: 'forms',
  action_data: 'COALESCE(submission_action_data.action_data, \'{}\'::JSONB) action_data',
  form_data: 'COALESCE(submission_form_data_pool.data, \'{}\'::JSONB) form_data',
  metadata: 'submission_metadata.metadata',
  created_at: 'submission.created_at',
  last_change: 'submission_status.last_change',
  lock: '(EXISTS(SELECT edpuser_id FROM submission_lock WHERE submission_lock.id = submission.id)) "lock"',
  contributor_ids: 'submission.contributor_ids',
  copy: '(EXISTS(SELECT edpuser_id FROM submission_copy WHERE submission_copy.id = submission.id)) "copy"',
  origin_id: 'submission_copy.origin_id'
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
  submission_copy:{
    type: 'left_join',
    src: 'submission_copy',
    on: { left: 'submission.id', right: 'submission_copy.id' }
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
  step: {
    type: 'natural_join',
    src: {
      type: 'select',
      fields: [
        'step.step_name',
        'step.type',
        'step.step_status_label',
        'form.daac_only',
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
            ['data', 'step.data'],
            ['daac_only', 'form.daac_only']
          ],
          strip: true,
          alias: 'step_data'
        }
      ],
      from: { 
        base: 'step', 
        joins: [{
          type: 'left_join',
          src: 'form',
          on: { left: 'step.form_id', right: 'form.id' }
        }]
      },
      alias: 'step'
    }
  },
  workflow: {
    type: 'left_join',
    src: 'workflow',
    on: { left: 'workflow.id', right: 'submission_status.workflow_id' }
  },
  daac: {
    type: 'left_join',
    src: 'daac',
    on: { left: 'daac.id', right: 'submission.daac_id' }
  },
  submission_form_data_pool: {
    type: 'left_join',
    src: 'submission_form_data_pool',
    on:{ left: 'submission_form_data_pool.id', right: 'submission.id'}
  }
};

const daacIdSelect = () => sql.select({
  fields: [
    'submission.daac_id',
  ],
  from: {
    base: 'submission',
  },
  where: {
    filters: [{ field: 'submission.id', param: 'id' }]
  }
});

const daacGroup = () => ({
  type: 'inner_join',
  src: {
    type: 'select',
    fields: [
      'daac.id AS daac_id',
      'daac.edpgroup_id'
    ],
    from: {
      base: 'daac',
    },
    where: {
      filters: [{ field: 'daac.id', value: `(${daacIdSelect()})` }]
    },
    alias: 'daac_group'
  },
  on:{ left: 'edpuser_edpgroup.edpgroup_id', right: 'daac_group.edpgroup_id'}
});

const submissionDaacUsers = () => sql.select({
  type: 'select',
  fields: [
    'daac_id',
    'edpuser_id',
    'privilege'
  ],
  from: {
    base: 'edpuser_edpgroup',
    joins: [
      daacGroup(),
      { type: 'natural_join', src: 'edpuser_edprole' },
      { type: 'natural_join', src: 'edprole_privilege' },
    ]
  },
  where: {
    filters: [{ field: 'edprole_privilege.privilege', literal: "REQUEST_DAACREAD" }]
  }
});

const adminUsers = () => sql.select({
  fields: [
    'NULL AS daac_id',
    'edpuser_id',
    'privilege '
  ],
  from: {
    base: 'edpuser_edprole',
    joins: [
      { type: 'natural_join', src: 'edprole_privilege' },
    ]
  },
  where: {
    filters: [{ field: 'edprole_privilege.privilege', literal: "ADMIN" }]
  },
  alias: 'daac_privileged_users_subquery'
});

const submissionPrivilegedUsers = () => ({
    type: 'left_join',
    src: {
      type: 'select',
      fields: [
        'daac_privileged_users.daac_id',
        'daac_privileged_users.user_ids'
      ],
      from: {
        base: sql.select({
          fields: [
            `(${daacIdSelect()})`,
            'array_agg(edpuser_id) user_ids'
          ],
          from: {
            base: `(${submissionDaacUsers()})`
          },
          alias: 'daac_privileged_users'
        })
      },
      alias: 'privileged_users',
    },
    on:{ left: 'submission.daac_id', right: 'privileged_users.daac_id'}
});

const submission_form_data = (privileged_user) => ({
  type: 'natural_left_join',
  src: {
    type: 'select',
    fields: [
      'submission_form_data.id',
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
    where: {
      filters: [
        ...(privileged_user ? [] : [{ field: 'form.daac_only',  op: 'eq', value: "FALSE" }])
      ]
    },
    group: 'submission_form_data.id',
    alias: 'submission_form_data'
  }
});

const fields = (list) => list.map((field) => fieldMap[field]);

const findById = (params) => sql.select({
  fields: fields(allFields),
  from: {
    base: table,
    joins: [refs.submission_status, refs.initiator_ref, refs.submission_metadata, refs.submission_action_data, submission_form_data(params.privileged_user), refs.step, refs.workflow, refs.daac, refs.submission_form_data_pool, refs.submission_copy, submissionPrivilegedUsers()]
  },
  where: {
    filters: [
      { field: fieldMap.id, param: 'id' },
      ...([{ cmd: `({{user_id}}=ANY(submission.contributor_ids) OR {{user_id}} = ANY(privileged_users.user_ids)) OR '4daa6b22-f015-4ce2-8dac-8b3510004fca' = ANY(SELECT EDPGROUP_ID FROM EDPUSER_EDPGROUP WHERE EDPUSER_ID={{user_id}})` }]),
    ]
  }
});

const getUsersSubmissions = (params) => sql.select({
  fields: fields(customFields),
  from: {
    base: table,
    joins: [refs.submission_status, refs.initiator_ref, refs.step, refs.workflow, refs.daac, refs.submission_copy]
  },
  where: {
    filters: [
      ...([{ cmd: `'${params.user_id}'=ANY(submission.contributor_ids)` }]),
      ...([{ field: 'submission.hidden', op: params.hidden ? 'is' : 'is_not', value: 'true'}])
    ]
  },
  sort: fieldMap.last_change,
  order: 'DESC'
});

const getDaacSubmissions = (params) => sql.select({
  fields: ['*'],
  from: {
      base: `(${sql.select({
        fields: fields(customFields),
    from: {
    base: table,
      joins: [refs.submission_status, refs.initiator_ref, refs.step, refs.workflow, refs.daac, refs.submission_copy]
    },
        where: {
          filters: [
            { field: 'submission.hidden', op: params.hidden ? 'is' : 'is_not', value: 'true' }
          ]
        }
      })}) new_query`
      },
  where: {
      conjunction: 'OR',
      filters: [
        ...(params.user_id ? [{cmd: `initiator ->> 'id' = {{user_id}}`}, {cmd: `{{user_id}} = ANY(contributor_ids)`}] : []),
        ...(params.daac ? [{
          field: 'conversation_id',
          any: {
          values: {
            type: 'select',
            fields: ['submission.conversation_id'],
            from : {
              base: 'submission'
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
              }])
              ]
            }
          }
          }
        }] : [])
      ]
  },
  sort: 'last_change',
  order: 'DESC'
});

const getAdminSubmissions = (params) => sql.select({
  fields: fields(customFields),
  from: {
    base: table,
    joins: [refs.submission_status, refs.initiator_ref, refs.step, refs.workflow, refs.daac, refs.submission_copy]
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
  per_page, page, contributor_ids
}) => sql.select({
  fields: [fieldMap.id, fieldMap.name, fieldMap.conversation_id, fieldMap.workflow_id, fieldMap.workflow_name, fieldMap.daac_name, fieldMap.step_name, fieldMap.status, fieldMap.created_at, fieldMap.last_change, fieldMap.hidden, fieldMap.contributor_ids],
  from: {
    base: table,
    joins: [refs.submission_status, refs.step, refs.workflow, refs.daac]
  },
  where: {
    filters: [
      ...(name ? [{ field: 'submission.name', param: 'name' }] : []),
      ...(user_id ? [{ field: 'submission.initiator_edpuser_id', param: 'user_id' }] : []),
      ...(daac_id ? [{ field: 'submission.daac_id', param: 'daac_id' }] : []),
      ...(daac_name ? [{ field: 'daac.long_name', param: 'daac_name' }] : []),
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
      ...(contributor_ids ? [{ field: 'submission.contributor_ids', param: 'contributor_ids' }] : []),
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
INSERT INTO submission(initiator_edpuser_id${params.daac_id ? ', daac_id' : ''}${params.name ? ', name' : ''}, contributor_ids)
VALUES ({{user_id}}${params.daac_id ? ', {{daac_id}}' : ''}${params.name ? ', {{name}}' : ''}, ARRAY[{{user_id}}::UUID])
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

const getConversationId = () =>`
SELECT submission.conversation_id
FROM submission
WHERE id = {{id}}
`

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
SELECT data FROM submission_form_data_pool
WHERE id = {{id}}`;

const updateFormData = ({id, data, form_id}) => `
DO $$
BEGIN
INSERT INTO submission_form_data_pool(id, data) VALUES
('${util.pubCleanString(id)}', '${util.pubCleanString(data)}'::JSONB)
ON CONFLICT (id) DO UPDATE SET
data = EXCLUDED.data;

INSERT INTO submission_form_data(id, form_id, data) VALUES
('${util.pubCleanString(id)}', '${util.pubCleanString(form_id)}', '${util.pubCleanString(id)}')
ON CONFLICT (id, form_id) DO UPDATE SET
data = EXCLUDED.data;
END $$`;

const updateSubmissionData = () => sql.update({
  table: 'submission',
  set: [
    ...( [{ field: 'name', param: 'dataProduct' }]),
    ...( [{ field: 'data_producer_name', param: 'dataProducer' }])
  ],
  where: {
    filters: [ { field: 'id', param: 'id' } ]
  },
  returning: ['*']
});

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

// TODO- This command needs lots of reworking and its output/use case needs more refinement
// within the application. Specifically how it differs from the above findById cmd
const getState = () => `
SELECT submission.conversation_id, submission.daac_id, submission_status.*, step_data.step, workflows
FROM submission_status
NATURAL JOIN submission
NATURAL JOIN (
  SELECT
    step_info.step_name,
    step_info.workflow_id,
    JSONB_STRIP_NULLS(JSONB_BUILD_OBJECT(
      'type', step_info.type,
      'name', step_info.step_name,
      'action_id', step_info.action_id,
      'form_id', step_info.form_id,
      'service_id', step_info.service_id,
      'data', step_info.data,
      'step_message', step_info.step_message
    )) step
  FROM (
    SELECT step.*, step_message, workflow_id
    FROM step
    INNER JOIN step_edge
    ON step.step_name = step_edge.step_name
  UNION
    SELECT step.*, step_message, workflow_id
    FROM step
    INNER JOIN step_edge
    ON step.step_name = step_edge.next_step_name WHERE next_step_name='close'
    )step_info
  ) step_data
NATURAL JOIN (
  SELECT
    submission_workflow.id,
    ARRAY_AGG(
      JSONB_STRIP_NULLS(JSONB_BUILD_OBJECT(
        'workflow_id', submission_workflow.workflow_id,
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
  AND step_edge.next_step_name = {{step_name}})
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

const setStep = () => `
UPDATE submission_status
SET step_name = {{step_name}}
WHERE id = {{id}}
RETURNING *`;

const checkWorkflow = () => `
SELECT step_edge.step_name
FROM step_edge
WHERE step_edge.step_name = {{step_name}} AND step_edge.workflow_id = (SELECT submission_workflow.workflow_id from submission_workflow WHERE id={{id}} AND submission_workflow.complete_time IS NULL)`;

const addContributors = ({ contributor_ids }) => `
UPDATE submission
SET contributor_ids = ARRAY(
  SELECT DISTINCT unnest(array_cat(contributor_ids, ARRAY['${contributor_ids.join('\',\'')}']::UUID[]))
)
WHERE id = {{id}}
RETURNING *`;

const getContributors = () =>`
SELECT contributor_ids
FROM submission
WHERE id = {{id}}
`;

const removeContributor = () =>`
UPDATE submission
SET contributor_ids = array_remove(contributor_ids, {{contributor}})
WHERE id = {{id}}
RETURNING *`;

const copyActionData = (params) =>`
DO $$
DECLARE
actionId UUID;
BEGIN
  FOR actionId IN 
    SELECT action_id FROM submission_action_data WHERE id = '${util.pubCleanString(params.origin_id)}'
  LOOP
    INSERT INTO submission_action_data(id, action_id, data) VALUES(
      '${util.pubCleanString(params.id)}',
      actionId, 
      (SELECT data FROM submission_action_data WHERE action_id = actionId and id = '${util.pubCleanString(params.origin_id)}')
    );
  END LOOP;
END $$
`;

const copyFormData = ({ id, data, origin_id }) =>`

DO $$
DECLARE
formId UUID;
BEGIN

  INSERT INTO submission_form_data_pool(id, data) VALUES
('${util.pubCleanString(id)}', '${util.pubCleanString(data)}'::JSONB);

  FOR formId IN 
    SELECT form_id FROM submission_form_data WHERE id = '${util.pubCleanString(origin_id)}'
  LOOP
    INSERT INTO submission_form_data(id, form_id, data) VALUES
    ('${util.pubCleanString(id)}', formId, '${util.pubCleanString(id)}');
  END LOOP;
END $$
`;

const setSubmissionCopy = ({ context }) => `
INSERT INTO submission_copy(id, edpuser_id, origin_id${context? ', context':''})
VALUES({{id}}, {{edpuser_id}}, {{origin_id}}${context? `, '${context}'`:''})
ON CONFLICT DO NOTHING
`;

const getStepMessage = () => `
SELECT step.notification FROM step
WHERE step.step_name = {{step_name}}
`;

const getCreatorName = () => `
SELECT edpuser.name FROM edpuser
Where edpuser.id = (select initiator_edpuser_id from submission where id = {{id}})
`;

const getStepName = () => `
SELECT step_name FROM submission_status WHERE id = {{id}}
`;

// TODO - Upate this query's complexity and to use sql builder
const getSubmissionDetailsById = (params) => `
WITH step_visibility AS (SELECT step.*, form.daac_only FROM step LEFT JOIN form ON step.form_id = form.id),
filteredForm AS (SELECT * FROM form ${params.privilegedUser === false ? `WHERE form.daac_only=false`: ``})
SELECT submission.id id, conversation_id, submission.created_at created_at, daac.long_name daac_name, 
submission.hidden hidden,
JSONB_BUILD_OBJECT('name', edpuser1.name, 'id', edpuser1.id) initiator,
submission_status.last_change last_change,
submission_form_data_pool.data::json->'data_producer_info_name' data_producer_name, 
submission_form_data_pool.data::json->'data_product_name_value' data_product_name, 
array_agg(DISTINCT JSONB_BUILD_OBJECT('id', edpuser2.id, 'name', edpuser2.name)) as contributors,
JSONB_BUILD_OBJECT('id', workflow.id, 'name', workflow.long_name, 'steps',
array_agg(DISTINCT step_edge.step_name)) workflow,
JSONB_STRIP_NULLS(JSONB_BUILD_OBJECT('type', step_visibility.type, 'name', step_visibility.step_name,'action_id', step_visibility.action_id, 
'form_id', step_visibility.form_id,'service_id', step_visibility.service_id, 'data', step_visibility.data, 'daac_only', step_visibility.daac_only)) step_data,
CASE 
  WHEN filteredForm.id is null THEN '[]'
  WHEN filteredForm.long_name is null THEN '[]' 
  WHEN submission_form_data.submitted_at is null THEN '[]' 
  ELSE
    JSONB_AGG(DISTINCT JSONB_STRIP_NULLS(JSONB_BUILD_OBJECT('id', filteredForm.id,
      'long_name', filteredForm.long_name, 'daac_only', filteredForm.daac_only, 'submitted_at', submission_form_data.submitted_at))) 
END forms, submission_metadata.metadata metadata
FROM submission
JOIN daac
ON submission.daac_id = daac.id
JOIN edpuser edpuser1
ON submission.initiator_edpuser_id = edpuser1.id
JOIN submission_status
ON submission.id = submission_status.id
JOIN workflow
ON submission_status.workflow_id = workflow.id
LEFT JOIN submission_form_data_pool
ON submission.id = submission_form_data_pool.id
JOIN edpuser edpuser2
ON edpuser2.id = ANY(submission.contributor_ids)
JOIN step_edge
ON submission_status.workflow_id = step_edge.workflow_id
JOIN step_visibility
ON submission_status.step_name = step_visibility.step_name
LEFT JOIN submission_form_data
ON submission.id = submission_form_data.id
LEFT JOIN filteredForm
ON submission_form_data.form_id = filteredForm.id
JOIN submission_metadata
ON submission.id = submission_metadata.id
WHERE submission.id= {{id}}
GROUP BY submission.id, daac.long_name, edpuser1.name, edpuser1.id,
submission_status.last_change, workflow.long_name, workflow.id,
submission_form_data_pool.data, step_visibility.type, step_visibility.step_name, step_visibility.action_id,
step_visibility.form_id, step_visibility.service_id, step_visibility.data, step_visibility.daac_only, filteredForm.id, 
filteredForm.long_name, submission_form_data.submitted_at, submission_metadata.metadata;
`;

const getSubmissionDaac = () => sql.select({
  fields: ['daac.short_name'],
  from: {
    base: 'submission',
    joins: [refs.daac]
  },
  where: {
    filters: [{ field: 'submission.id', param: 'id' }]
  }
});

const getStepReviewApproval = () => `
SELECT sr.step_name, sr.submission_id, sr.edpuser_id, sr.user_review_status, eu.name, sr.submitted_by
FROM step_review sr
INNER JOIN edpuser eu ON sr.edpuser_id = eu.id
WHERE sr.submission_id = {{id}}
`;


const createStepReviewApproval = (params) => `
WITH inserted AS (
  INSERT INTO step_review (step_name, submission_id, edpuser_id, user_review_status, submitted_by)
  SELECT s.step_name, {{submission_id}}, CAST(user_id AS UUID), 'review_required', {{submitted_by}}
  FROM unnest(ARRAY[${params.user_ids.map(id => `'${id}'::UUID`).join(',')}]) AS user_id
  JOIN step s ON s.step_name = {{step_name}}
  RETURNING *
)
SELECT i.*, s.data->>'form_id' AS form_id
FROM inserted i
JOIN step s ON i.step_name = s.step_name
`;


const deleteStepReviewApproval = (params) => `
WITH deleted AS (DELETE FROM step_review
WHERE submission_id = {{submission_id}}
AND step_name = {{step_name}}
AND edpuser_id IN (${params.user_ids.map(id => `'${id}'::UUID`).join(', ')})
RETURNING *
)
SELECT d.*, submission.initiator_edpuser_id AS initiator
FROM deleted d
JOIN submission ON d.submission_id = submission.id;
;
`;

const checkCountStepReviewApproved = () => `
SELECT COALESCE(SUM(sr.unapproved_count), 0) AS unapproved
FROM (
    SELECT submission_id, step_name, 
           SUM(CASE WHEN user_review_status IN ('rejected', 'review_required') THEN 1 ELSE 0 END) AS unapproved_count
    FROM step_review
    WHERE submission_id = {{submission_id}}
      AND step_name = {{step_name}}
    GROUP BY submission_id, step_name
) AS sr
LEFT JOIN (SELECT 1) AS dummy ON 1 = 1
`;

const checkCountStepReviewRejected = () => `
SELECT COUNT(*) AS unapproved
FROM step_review
WHERE submission_id = {{submission_id}}
  AND step_name = {{step_name}}
  AND edpuser_id <> {{user_id}}
`;


const updateStatusStepReviewApproval = () => `
UPDATE step_review
SET user_review_status = {{approve}}
WHERE submission_id = {{submission_id}}
  AND edpuser_id = {{user_id}}
  AND step_name = {{step_name}}
RETURNING *
`;

const stepCleanup = () => `
WITH step_to_delete AS (
    SELECT s.step_name
    FROM Step s
    LEFT JOIN Step_Edge se1 ON s.step_name = se1.step_name
    LEFT JOIN Step_Edge se2 ON s.step_name = se2.next_step_name
    WHERE se1.step_name IS NULL AND se2.next_step_name IS NULL
)
DELETE FROM Step
WHERE step_name IN (SELECT step_name FROM step_to_delete)`;

const checkCode = () =>`
SELECT code.submission_id, code.daac_id
FROM code
WHERE code = {{code}}
`;

const createCode = () => `
INSERT INTO code(submission_id, daac_id)
Values({{submissionId}}, {{daacID}})
RETURNING *
`

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
module.exports.getConversationId = getConversationId;
module.exports.getState = getState;
module.exports.getMetadata = getMetadata;
module.exports.updateMetadata = updateMetadata;
module.exports.getActionData = getActionData;
module.exports.updateActionData = updateActionData;
module.exports.getFormData = getFormData;
module.exports.updateFormData = updateFormData;
module.exports.updateSubmissionData = updateSubmissionData;
module.exports.applyWorkflow = applyWorkflow;
module.exports.rollback = rollback;
module.exports.reassignWorkflow = reassignWorkflow;
module.exports.withdrawSubmission = withdrawSubmission;
module.exports.restoreSubmission = restoreSubmission;
module.exports.setStep = setStep;
module.exports.checkWorkflow = checkWorkflow;
module.exports.addContributors = addContributors;
module.exports.getContributors = getContributors;
module.exports.removeContributor = removeContributor;
module.exports.copyActionData = copyActionData;
module.exports.copyFormData = copyFormData;
module.exports.setSubmissionCopy = setSubmissionCopy;
module.exports.getStepMessage = getStepMessage;
module.exports.getCreatorName = getCreatorName;
module.exports.getStepName = getStepName;
module.exports.getSubmissionDetailsById = getSubmissionDetailsById;
module.exports.getSubmissionDaac = getSubmissionDaac;
module.exports.getStepReviewApproval = getStepReviewApproval;
module.exports.createStepReviewApproval = createStepReviewApproval;
module.exports.deleteStepReviewApproval = deleteStepReviewApproval;
module.exports.checkCountStepReviewRejected = checkCountStepReviewRejected;
module.exports.checkCountStepReviewApproved = checkCountStepReviewApproved;
module.exports.updateStatusStepReviewApproval = updateStatusStepReviewApproval;
module.exports.stepCleanup = stepCleanup;
module.exports.checkCode = checkCode;
module.exports.createCode = createCode;