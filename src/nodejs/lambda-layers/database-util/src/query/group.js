const sql = require('./sql-builder.js');

const table = 'edpgroup';
const allFields = ['id', 'short_name', 'long_name', 'description', 'permissions', 'subscriptions'];
const fieldMap = {
  id: 'edpgroup.id',
  short_name: 'edpgroup.short_name',
  long_name: 'edpgroup.long_name',
  description: 'edpgroup.description',
  parent: 'parent',
  user_id: 'edpuser_edpgroup.edpuser_id',
  group_id: 'edpuser_edpgroup.edpgroup_id',
  users: 'users',
  permissions: {
    type: 'coalesce',
    src: 'permissions',
    fallback: '\'[]\'::JSONB',
    alias: 'permissions'
  },
  subscriptions: {
    type: 'json_obj',
    keys: [
      ['action', {
        type: 'coalesce',
        src: 'subscriptions_action',
        fallback: '\'[]\'::JSONB'
      }],
      ['daac', {
        type: 'coalesce',
        src: 'subscriptions_daac',
        fallback: '\'[]\'::JSONB'
      }],
      ['form', {
        type: 'coalesce',
        src: 'subscriptions_form',
        fallback: '\'[]\'::JSONB'
      }],
      ['service', {
        type: 'coalesce',
        src: 'subscriptions_service',
        fallback: '\'[]\'::JSONB'
      }],
      ['submission', {
        type: 'coalesce',
        src: 'subscriptions_submission',
        fallback: '\'[]\'::JSONB'
      }],
      ['workflow', {
        type: 'coalesce',
        src: 'subscriptions_workflow',
        fallback: '\'[]\'::JSONB'
      }]
    ],
    alias: 'subscriptions'
  }, // action, daac, form, service, submission workflow
  group_agg: {
    type: 'json_agg',
    src: {
      type: 'json_obj',
      keys: [
        ['id', 'edpgroup.id'],
        ['short_name', 'edpgroup.short_name'],
        ['long_name', 'edpgroup.long_name'],
        ['description', 'edpgroup.description']]
    },
    alias: 'user_groups'
  }
};
const fields = (list) => list.map((field) => fieldMap[field]);
const refs = {
  group_permission_submission: {
    type: 'left_join',
    src: {
      type: 'select',
      fields: [
        'edpgroup_permission_submission.edpgroup_id',
        {
          type: 'json_agg',
          src: 'edpgroup_permission_submission.submission_id',
          alias: 'permissions'
        }
      ],
      from: { base: 'edpgroup_permission_submission' },
      group: 'edpgroup_permission_submission.edpgroup_id',
      alias: 'permission_agg'
    },
    on: { left: 'permission_agg.edpgroup_id', right: fieldMap.id }
  },
  group_subscription_action: {
    type: 'left_join',
    src: {
      type: 'select',
      fields: [
        'edpgroup_id',
        {
          type: 'json_agg',
          src: 'edpgroup_subscription_action.action_id',
          alias: 'subscriptions_action'
        }
      ],
      from: { base: 'edpgroup_subscription_action' },
      group: 'edpgroup_id',
      alias: 'subscription_action_agg'
    },
    on: { left: 'subscription_action_agg.edpgroup_id', right: fieldMap.id }
  },
  group_subscription_daac: {
    type: 'left_join',
    src: {
      type: 'select',
      fields: [
        'edpgroup_id',
        {
          type: 'json_agg',
          src: 'edpgroup_subscription_daac.daac_id',
          alias: 'subscriptions_daac'
        }
      ],
      from: { base: 'edpgroup_subscription_daac' },
      group: 'edpgroup_id',
      alias: 'subscription_daac_agg'
    },
    on: { left: 'subscription_daac_agg.edpgroup_id', right: fieldMap.id }
  },
  group_subscription_form: {
    type: 'left_join',
    src: {
      type: 'select',
      fields: [
        'edpgroup_id',
        {
          type: 'json_agg',
          src: 'edpgroup_subscription_form.form_id',
          alias: 'subscriptions_form'
        }
      ],
      from: { base: 'edpgroup_subscription_form' },
      group: 'edpgroup_id',
      alias: 'subscription_form_agg'
    },
    on: { left: 'subscription_form_agg.edpgroup_id', right: fieldMap.id }
  },
  group_subscription_service: {
    type: 'left_join',
    src: {
      type: 'select',
      fields: [
        'edpgroup_id',
        {
          type: 'json_agg',
          src: 'edpgroup_subscription_service.service_id',
          alias: 'subscriptions_service'
        }
      ],
      from: { base: 'edpgroup_subscription_service' },
      group: 'edpgroup_id',
      alias: 'subscription_service_agg'
    },
    on: { left: 'subscription_service_agg.edpgroup_id', right: fieldMap.id }
  },
  group_subscription_submission: {
    type: 'left_join',
    src: {
      type: 'select',
      fields: [
        'edpgroup_id',
        {
          type: 'json_agg',
          src: 'edpgroup_subscription_submission.submission_id',
          alias: 'subscriptions_submission'
        }
      ],
      from: { base: 'edpgroup_subscription_submission' },
      group: 'edpgroup_id',
      alias: 'subscription_submission_agg'
    },
    on: { left: 'subscription_submission_agg.edpgroup_id', right: fieldMap.id }
  },
  group_subscription_workflow: {
    type: 'left_join',
    src: {
      type: 'select',
      fields: [
        'edpgroup_id',
        {
          type: 'json_agg',
          src: 'edpgroup_subscription_workflow.workflow_id',
          alias: 'subscriptions_workflow'
        }
      ],
      from: { base: 'edpgroup_subscription_workflow' },
      group: 'edpgroup_id',
      alias: 'subscription_workflow_agg'
    },
    on: { left: 'subscription_workflow_agg.edpgroup_id', right: fieldMap.id }
  },
  user_group: {
    type: 'left_join',
    src: 'edpuser_edpgroup',
    on: { left: fieldMap.id, right: fieldMap.group_id }
  }
};
const userJoin = {
  type: 'select',
  fields: fields(['user_id', 'group_agg']),
  from: { base: table, joins: [refs.user_group] },
  group: fieldMap.user_id,
  alias: 'group_agg'
};
const findAll = () => sql.select({
  fields: fields(allFields),
  from: {
    base: table,
    joins: [
      refs.group_permission_submission,
      refs.group_subscription_action,
      refs.group_subscription_daac,
      refs.group_subscription_form,
      refs.group_subscription_service,
      refs.group_subscription_submission,
      refs.group_subscription_workflow
    ]
  }
});
const findById = () => `${findAll()} WHERE edpgroup.id = {{id}}`;
const findByName = () => `${findAll()} WHERE edpgroup.short_name = {{short_name}}`;
const findByUserId = () => `${findAll()}
  WHERE edpgroup.id IN (SELECT edpuser_edpgroup.edpuser_id WHERE edpuser_edpgroup.edpuser_id = {{user_id}})`;

module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.findByName = findByName;
module.exports.findByUserId = findByUserId;
module.exports.userJoin = userJoin;
