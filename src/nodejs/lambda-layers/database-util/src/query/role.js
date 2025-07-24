const sql = require('./sql-builder.js');

const table = 'edprole';
const allFields = ['id', 'short_name', 'long_name', 'description', 'role_privileges'];
const fieldMap = {
  id: 'edprole.id',
  short_name: 'edprole.short_name',
  long_name: 'edprole.long_name',
  description: 'edprole.description',
  user_id: 'edpuser_edprole.edpuser_id',
  role_id: 'edpuser_edprole.edprole_id',
  users: 'users',
  permissions: 'permissions',
  subscriptions: 'subscriptions',
  role_privileges: {
    type: 'coalesce',
    src: 'role_privileges',
    fallback: '\'[]\'::JSONB',
    alias: 'role_privileges'
  },
  role_agg: {
    type: 'json_agg',
    src: {
      type: 'json_obj',
      keys: [
        ['id', 'edprole.id'],
        ['short_name', 'edprole.short_name'],
        ['long_name', 'edprole.long_name'],
        ['description', 'edprole.description']]
    },
    distinct: true,
    alias: 'user_roles'
  },
  role_list: {
    type: 'json_agg',
    src: 'edprole.long_name',
    distinct: true,
    alias: 'user_roles'
  },
  privilege_agg: {
    type: 'json_agg',
    src: 'edprole_privilege.privilege',
    distinct: true,
    sort: 'edprole_privilege.privilege',
    order: 'ASC',
    filters: [
      { field: 'privilege', op: 'is_not', value: 'NULL' }
    ],
    alias: 'user_privileges'
  }
  // privilege_agg: 'JSONB_AGG(DISTINCT edprole_privilege.privilege ORDER BY privilege ASC) FILTER (WHERE privilege IS NOT NULL) user_privileges'
};
const fields = (list) => list.map((field) => fieldMap[field]);
const refs = {
  user_role: {
    type: 'left_join',
    src: 'edpuser_edprole',
    on: { left: fieldMap.id, right: fieldMap.role_id }
  },
  user_privilege: {
    type: 'left_join',
    src: 'edprole_privilege',
    on: { left: 'edprole_privilege.edprole_id', right: fieldMap.id }
  },
  role_privilege: {
    type: 'left_join',
    src: {
      type: 'select',
      fields: [
        'edprole_privilege.edprole_id',
        {
          type: 'json_agg',
          src: 'edprole_privilege.privilege',
          alias: 'role_privileges'
        }
      ],
      from: { base: 'edprole_privilege' },
      group: 'edprole_privilege.edprole_id',
      alias: 'privilege_agg'
    },
    on: { left: 'privilege_agg.edprole_id', right: fieldMap.id }
  }
};
const userJoin = {
  type: 'select',
  fields: fields(['user_id', 'role_agg', 'privilege_agg']),
  from: { base: table, joins: [refs.user_role, refs.user_privilege] },
  group: fieldMap.user_id,
  alias: 'role_agg'
};
const userJoinList = {
  type: 'select',
  fields: fields(['user_id', 'role_list']),
  from: { base: table, joins: [refs.user_role] },
  group: fieldMap.user_id,
  alias: 'role_agg'
};
const findAll = ({ short_name, long_name, sort, order, per_page, page }) => sql.select({
  fields: ['edprole.*'],
  from: { base: table },
  ...(short_name || long_name ? {
    where: {
      filters: [
        ...(short_name ? [{ field: 'edprole.short_name', like: 'short_name' }] : []),
        ...(long_name ? [{ field: 'edprole.long_name', like: 'long_name' }] : []),
      ]
    }
  } : {}),
  ...(sort ? { sort } : {}),
  ...(order ? { order } : {}),
  ...(per_page ? { limit: per_page } : {}),
  ...(page ? { offset: page } : {})
});
const findById = () => sql.select({
  fields: fields(allFields),
  from: { base: table, joins: [refs.role_privilege] },
  where: {
    filters: [ { field: fieldMap.id, param: 'id' } ]
  }
});
const findByName = (params) => sql.select({
  fields: fields(allFields),
  from: { base: table, joins: [refs.role_privilege] },
  where: {
    filters: [
      ...(params.short_name ? [{ field: 'edprole.short_name', like: 'short_name' }] : []),
      ...(params.long_name ? [{ field: 'edprole.long_name', like: 'long_name' }] : []),
    ]
  }
});

module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.findByName = findByName;
module.exports.userJoin = userJoin;
module.exports.userJoinList = userJoinList;