const sql = require('./sql-builder.js');
const role = require('./role.js');
const group = require('./group.js');

const table = 'edpuser';
const allFields = ['id', 'name', 'email', 'registered', 'last_login', 'user_groups', 'user_roles', 'user_privileges', 'detailed'];
const fieldMap = {
  id: 'edpuser.id',
  name: 'edpuser.name',
  email: 'edpuser.email',
  extension: 'substring(edpuser.email from \'@.*\') AS extension',
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
  detailed: 'edpuser.detailed'
};
const fields = (list) => list.map((field) => fieldMap[field]);
const refs = {
  group: {
    type: 'left_join',
    src: group.userJoin,
    on: { left: fieldMap.id, right: 'group_agg.edpuser_id' }
  },
  groupList: {
    type: 'left_join',
    src: group.userJoinList,
    on: { left: fieldMap.id, right: 'group_agg.edpuser_id' }
  },
  simple_group: {
    type: 'left_join',
    src: 'edpuser_edpgroup',
    on: { left: fieldMap.id, right: 'edpuser_edpgroup.edpuser_id' }
  },
  role: {
    type: 'left_join',
    src: role.userJoin,
    on: { left: fieldMap.id, right: 'role_agg.edpuser_id' }
  },
  roleList: {
    type: 'left_join',
    src: role.userJoinList,
    on: { left: fieldMap.id, right: 'role_agg.edpuser_id' }
  },
  simple_role: {
    type: 'left_join',
    src: 'edpuser_edprole',
    on: { left: fieldMap.id, right: 'edpuser_edprole.edpuser_id' }
  }
};

const find = ({ id, name, email, sort, order, per_page, page }) => sql.select({
  fields: fields(allFields),
  from: {
    base: table,
    joins: [
      refs.group,
      refs.role
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

const findAll = ({name, email, sort, order, per_page, page, group_id, role_id, requested_fields=['id', 'name']}) => sql.select({
  fields: fields(requested_fields),
  from: {
    base: table,
    joins: [
      refs.simple_group,
      refs.simple_role
    ]
  },
  where: {
    filters: [
      ...(name ? [{ field: 'edpuser.name', like: 'name' }] : []),
      ...(email ? [{ field: 'edpuser.email', like: 'email'}] : []),
      ...(group_id ? [{ field: 'edpuser_edpgroup.edpgroup_id', param: 'group_id' }] : []),
      ...(role_id ? [{ field: 'edpuser_edprole.edprole_id', param: 'role_id' }] : []),
    ]
  },
  group: 'id',
  ...(sort ? { sort } : {}),
  ...(order ? { order } : {}),
  ...(per_page ? { limit: per_page } : {}),
  ...(page ? { offset: page } : {})
});

const getDetailedUsers = ({id, name, email, sort, order, per_page, page, group_id, role_id}) => sql.select({
  fields: fields(['id', 'name', 'email', 'extension', 'user_groups', 'user_roles']),
  from: {
    base: table,
    joins: [
      refs.groupList,
      refs.roleList
    ]
  },
  ...(id || name || email || group_id || role_id? {
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

const getInactiveUsers = () => `
SELECT name, id
    FROM edpuser
    WHERE last_login < (NOW() - INTERVAL '365 days');
`

const findById = () => sql.select({
  fields: fields(allFields),
  from: {
    base: table,
    joins: [
      refs.group,
      refs.role
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
  fields: ['edpuser.email', 'edpuser.name', 'edpuser.id'],
  from: {
    base: 'edpuser'
  },
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

const updateUsername = () => `
UPDATE edpuser SET
name = {{name}}
WHERE edpuser.id = {{id}}
RETURNING *`;

const getManagerIds = (params) => sql.select({
  fields: ['id','email','name'],
  from: {
    base: 'edpuser',
    joins:[
      {type: 'left_join', src: 'edpuser_edpgroup', on: {left: 'edpuser_edpgroup.edpuser_id', right: 'edpuser.id'}},
      {type: 'left_join', src: 'edpuser_edprole', on: {left: 'edpuser_edprole.edpuser_id', right: 'edpuser.id'}}
    ]
  },
  where: {
    filters: [
      { cmd: "edpuser_edpgroup.edpgroup_id = (SELECT edpgroup_id FROM daac WHERE id = {{daac_id}})" },
      { cmd: "edpuser_edprole.edprole_id = '2aa89c57-85f1-4611-812d-b6760bb6295c'"}
    ]
  }
});

const getRootGroupObserverIds = (params) => sql.select({
  fields: ['id', 'email', 'name'],
  from: {
    base: 'edpuser',
    joins:[
      {type: 'left_join', src: 'edpuser_edpgroup', on: {left: 'edpuser_edpgroup.edpuser_id', right: 'edpuser.id'}},
      {type: 'left_join', src: 'edpuser_edprole', on: {left: 'edpuser_edprole.edpuser_id', right: 'edpuser.id'}}
    ]
  },
  where: {
    filters: [
      { cmd: "edpuser_edpgroup.edpgroup_id = '4daa6b22-f015-4ce2-8dac-8b3510004fca'" },
      { cmd: "edpuser_edprole.edprole_id = '4be6ca4d-6362-478b-8478-487a668314b1'"}
    ]
  }
});

const getObserverIds = (params) => sql.select({
  fields: ['id'],
  from: {
    base: 'edpuser',
    joins:[
      {type: 'left_join', src: 'edpuser_edprole', on: {left: 'edpuser_edprole.edpuser_id', right: 'edpuser.id'}},
      {type: 'left_join', src: 'edpuser_edpgroup', on: {left: 'edpuser_edpgroup.edpuser_id', right: 'edpuser.id'}}
    ]
  },
  where: {
    filters: [
      { field: 'edpuser.id', any: { values: { param: 'contributor_ids' } } },
      { cmd: "edpuser_edprole.edprole_id = '4be6ca4d-6362-478b-8478-487a668314b1'"},
      ...(params.root_only && params.root_only === true ? [{ field: 'edpuser_edpgroup.edpgroup_id', literal: '4daa6b22-f015-4ce2-8dac-8b3510004fca' }] : [])
    ]
  }
});


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
module.exports.updateUsername = updateUsername;
module.exports.getManagerIds = getManagerIds;
module.exports.getRootGroupObserverIds = getRootGroupObserverIds;
module.exports.getObserverIds = getObserverIds;
module.exports.getDetailedUsers = getDetailedUsers;
module.exports.getInactiveUsers = getInactiveUsers;