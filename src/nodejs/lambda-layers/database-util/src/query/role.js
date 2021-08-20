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
    alias: 'user_roles'
  }
};
const fields = (list) => list.map((field) => fieldMap[field]);
const refs = {
  user_role: {
    type: 'left_join',
    src: 'edpuser_edprole',
    on: { left: fieldMap.id, right: fieldMap.role_id }
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
  fields: fields(['user_id', 'role_agg']),
  from: { base: table, joins: [refs.user_role] },
  group: fieldMap.user_id,
  alias: 'role_agg'
};
const findAll = () => sql.select({
  fields: fields(allFields),
  from: { base: table, joins: [refs.role_privilege] }
});
const findAllEx = () => `${findAll()} `;
const findById = () => `${findAll()} WHERE edprole.id = {{id}}`;
const findByName = () => `${findAll()} WHERE edprole.short_name = {{short_name}}`;

module.exports.findAll = findAll;
module.exports.findAllEx = findAllEx;
module.exports.findById = findById;
module.exports.findByName = findByName;
module.exports.userJoin = userJoin;
