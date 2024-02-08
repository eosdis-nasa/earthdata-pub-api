const sql = require('./sql-builder.js');
const role = require('./role.js');
const group = require('./group.js');

const table = 'edpuser';
const allFields = ['id', 'name', 'email', 'registered', 'last_login', 'user_groups', 'user_roles', 'permissions', 'user_privileges', 'subscriptions', 'detailed'];
const fieldMap = {
  id: 'edpuser.id',
  name: 'edpuser.name',
  email: 'edpuser.email',
  registered: 'edpuser.registered',
  last_login: 'edpuser.last_login',
  refresh_token: 'edpuser.refresh_token',
  user_groups: {
    type: 'coalesce',
    src: 'user_groups',
    fallback: '\'[]\'::JSONB',
    alias: 'user_groups'
  },
  user_roles: {
    type: 'coalesce',
    src: 'user_roles',
    fallback: '\'[]\'::JSONB',
    alias: 'user_roles'
  },
  user_privileges: {
    type: 'coalesce',
    src: 'role_agg.user_privileges',
    fallback: '\'[]\'::JSONB',
    alias: 'user_privileges'
  },
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
  },
  detailed: 'edpuser.detailed'
};
const fields = (list) => list.map((field) => fieldMap[field]);
const refs = {
  group: {
    type: 'left_join',
    src: group.userJoin,
    on: { left: fieldMap.id, right: 'group_agg.edpuser_id' }
  },
  role: {
    type: 'left_join',
    src: role.userJoin,
    on: { left: fieldMap.id, right: 'role_agg.edpuser_id' }
  },
  user_permission_submission: {
    type: 'left_join',
    src: {
      type: 'select',
      fields: [
        'edpuser_permission_submission.edpuser_id',
        {
          type: 'json_agg',
          src: 'edpuser_permission_submission.submission_id',
          alias: 'permissions'
        }
      ],
      from: { base: 'edpuser_permission_submission' },
      group: 'edpuser_permission_submission.edpuser_id',
      alias: 'permission_agg'
    },
    on: { left: 'permission_agg.edpuser_id', right: fieldMap.id }
  },
  user_subscription_action: {
    type: 'left_join',
    src: {
      type: 'select',
      fields: [
        'edpuser_id',
        {
          type: 'json_agg',
          src: 'edpuser_subscription_action.action_id',
          alias: 'subscriptions_action'
        }
      ],
      from: { base: 'edpuser_subscription_action' },
      group: 'edpuser_id',
      alias: 'subscription_action_agg'
    },
    on: { left: 'subscription_action_agg.edpuser_id', right: fieldMap.id }
  },
  user_subscription_form: {
    type: 'left_join',
    src: {
      type: 'select',
      fields: [
        'edpuser_id',
        {
          type: 'json_agg',
          src: 'edpuser_subscription_form.form_id',
          alias: 'subscriptions_form'
        }
      ],
      from: { base: 'edpuser_subscription_form' },
      group: 'edpuser_id',
      alias: 'subscription_form_agg'
    },
    on: { left: 'subscription_form_agg.edpuser_id', right: fieldMap.id }
  },
  user_subscription_service: {
    type: 'left_join',
    src: {
      type: 'select',
      fields: [
        'edpuser_id',
        {
          type: 'json_agg',
          src: 'edpuser_subscription_service.service_id',
          alias: 'subscriptions_service'
        }
      ],
      from: { base: 'edpuser_subscription_service' },
      group: 'edpuser_id',
      alias: 'subscription_service_agg'
    },
    on: { left: 'subscription_service_agg.edpuser_id', right: fieldMap.id }
  },
  user_subscription_submission: {
    type: 'left_join',
    src: {
      type: 'select',
      fields: [
        'edpuser_id',
        {
          type: 'json_agg',
          src: 'edpuser_subscription_submission.submission_id',
          alias: 'subscriptions_submission'
        }
      ],
      from: { base: 'edpuser_subscription_submission' },
      group: 'edpuser_id',
      alias: 'subscription_submission_agg'
    },
    on: { left: 'subscription_submission_agg.edpuser_id', right: fieldMap.id }
  },
  user_subscription_workflow: {
    type: 'left_join',
    src: {
      type: 'select',
      fields: [
        'edpuser_id',
        {
          type: 'json_agg',
          src: 'edpuser_subscription_workflow.workflow_id',
          alias: 'subscriptions_workflow'
        }
      ],
      from: { base: 'edpuser_subscription_workflow' },
      group: 'edpuser_id',
      alias: 'subscription_workflow_agg'
    },
    on: { left: 'subscription_workflow_agg.edpuser_id', right: fieldMap.id }
  }
};

const find = ({ id, name, email, sort, order, per_page, page }) => sql.select({
  fields: fields(allFields),
  from: {
    base: table,
    joins: [
      refs.group,
      refs.role,
      refs.user_permission_submission,
      refs.user_subscription_action,
      refs.user_subscription_form,
      refs.user_subscription_service,
      refs.user_subscription_submission,
      refs.user_subscription_workflow
    ]
  },
  ...(id || name || email ? {
    where: {
      filters: [
        ...(id ? [{ field: 'edpuser.id', param: 'id' }] : []),
        ...(name ? [{ field: 'edpuser.name', like: 'name' }] : []),
        ...(email ? [{ field: 'edpuser.email', like: 'email' }] : []),
      ]
    }
  } : {}),
  ...(sort ? { sort } : {}),
  ...(order ? { order } : {}),
  ...(per_page ? { limit: per_page } : {}),
  ...(page ? { offset: page } : {})
});

const findAll = ({name, email, sort, order, per_page, page}) => sql.select({
    fields: fields(allFields),
    from: {
      base: table,
      joins: [
        refs.group,
        refs.role,
        refs.user_permission_submission,
        refs.user_subscription_action,
        refs.user_subscription_form,
        refs.user_subscription_service,
        refs.user_subscription_submission,
        refs.user_subscription_workflow
      ]
    },
    where: {
      filters: [
          ...(name ? [{ field: 'edpuser.name', like: 'name' }] : []),
          ...(email ? [{ field: 'edpuser.email', like: 'email'}] : [])
      ]
    },
    ...(sort ? { sort } : {}),
    ...(order ? { order } : {}),
    ...(per_page ? { limit: per_page } : {}),
    ...(page ? { offset: page } : {})
});

const findById = () => sql.select({
  fields: fields(allFields),
  from: {
    base: table,
    joins: [
      refs.group,
      refs.role,
      refs.user_permission_submission,
      refs.user_subscription_action,
      refs.user_subscription_form,
      refs.user_subscription_service,
      refs.user_subscription_submission,
      refs.user_subscription_workflow
    ]
  },
  where: {
    filters: [
      ...([{ field: 'edpuser.id', param: 'id' }])
    ]
  }
});

const findSystemUser = () => sql.select({
  fields: fields(['id', 'name', 'email']),
  from: { base: table },
  where: {
    filters: [{ field: fieldMap.email, literal: 'no_email'}]
  }
});

const getRefreshToken = () => sql.select({
  fields: fields(['refresh_token']),
  from: { base: table },
  where:{
    filters: [{ field: fieldMap.id, param: 'id' }]
  }
});

const addRole = (params) => sql.insert({
  table: 'edpuser_edprole',
  values: {
    type: 'values_list',
    items: ['{{id}}', '{{role_id}}']
  },
  conflict: {},
  returning: ['*']
});

const addRoles = (params) => sql.insert({
  table: 'edpuser_edprole',
  values: {
    type: 'select',
    fields: ['{{id}} edpuser_id', 'UNNEST({{user_roles}}::uuid[]) edprole_id']
  },
  conflict: {},
  returning: ['*']
});

const removeRole = () => sql.delete({
  table: 'edpuser_edprole',
  where: {
    filters: [{ field: 'edpuser_id', param: 'id'}, { field: 'edprole_id', param: 'role_id'}]
  },
  returning: ['*']
});

const addGroup = (params) => sql.insert({
  table: 'edpuser_edpgroup',
  values: {
    type: 'values_list',
    items: ['{{id}}', '{{group_id}}']
  },
  conflict: {},
  returning: ['*']
});

const addGroups = (params) => sql.insert({
  table: 'edpuser_edpgroup',
  values: {
    type: 'select',
    fields: ['{{id}} edpuser_id', 'UNNEST({{user_groups}}::uuid[]) edpgroup_id']
  },
  conflict: {},
  returning: ['*']
});

const removeGroup = () => sql.delete({
  table: 'edpuser_edpgroup',
  where: {
    filters: [{ field: 'edpuser_id', param: 'id'}, { field: 'edpgroup_id', param: 'group_id'}]
  },
  returning: ['*']
});

const findByGroupId = () => `
${findAll()}
WHERE edpuser.id IN (
  SELECT edpuser_edpgroup.edpuser_id
  FROM edpuser_edpgroup
  WHERE edpuser_edpgroup.edpgroup_id = {{id}})`;

const findByGroupName = () => `
${findAll()}
WHERE edpuser.id IN (
  SELECT edpuser_edpgroup.edpuser_id
  FROM edpuser_edpgroup
  WHERE edpuser_edpgroup.edpgroup_id IN (
    SELECT edpgroup.id FROM edpgroup
    WHERE edpgroup.short_name = {{short_name}})`;

const loginUser = ({ id, sub, refresh_token }) => `
INSERT INTO edpuser(${id || sub ? 'id, ' : ''}name, email, refresh_token) VALUES
(${sub ? `{{sub}}, ` : id ? `{{id}}, `: ``}{{name}}, {{email}}, ${refresh_token ? `{{refresh_token}}` : `'none'`})
ON CONFLICT (id) DO UPDATE SET
last_login = EXCLUDED.last_login,
refresh_token = EXCLUDED.refresh_token
RETURNING *`;

const refreshUser = ({ sub }) => `
UPDATE edpuser SET
refresh_token = {{refresh_token}}
WHERE edpuser.id = {{${sub ? `sub` : `id`}}}
RETURNING *`;

const getEmails = (params) => sql.select({
  fields: ['edpuser.email'],
  from: 'edpuser',
  where: {
    filters: [{ field: 'edpuser.id', any: { values: { param: 'user_list' } } }]
  }
});

const findByEmail = () => `
  SELECT email FROM edpuser
  WHERE edpuser.email = {{email}}
`;

const getUsers = ({ids}) => `
  SELECT id, name FROM edpuser WHERE id = ANY (ARRAY['${ids.join('\',\'')}']::UUID[])
`;

const setDetail = () => `
UPDATE edpuser SET
detailed = {{detailed}}
WHERE edpuser.id = {{id}}
RETURNING *`;


module.exports.find = find;
module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.getRefreshToken = getRefreshToken;
module.exports.findByGroupId = findByGroupId;
module.exports.findByGroupName = findByGroupName;
module.exports.loginUser = loginUser;
module.exports.refreshUser = refreshUser;
module.exports.addRole = addRole;
module.exports.addRoles = addRoles;
module.exports.removeRole = removeRole;
module.exports.addGroup = addGroup;
module.exports.addGroups = addGroups;
module.exports.removeGroup = removeGroup;
module.exports.findSystemUser = findSystemUser;
module.exports.getEmails = getEmails;
module.exports.findByEmail = findByEmail;
module.exports.getUsers = getUsers;
module.exports.setDetail = setDetail;