const sql = require('./sql-builder.js');

const table = 'edpgroup';
const allFields = ['id', 'short_name', 'long_name', 'description'];
const fieldMap = {
  id: 'edpgroup.id',
  short_name: 'edpgroup.short_name',
  long_name: 'edpgroup.long_name',
  description: 'edpgroup.description',
  parent: 'parent',
  user_id: 'edpuser_edpgroup.edpuser_id',
  group_id: 'edpuser_edpgroup.edpgroup_id',
  users: 'users',
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
  },
  group_list: {
    type: 'json_agg',
    src: 'edpgroup.long_name',
    alias: 'user_groups'
  }
};
const fields = (list) => list.map((field) => fieldMap[field]);
const refs = {
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
const userJoinList = {
  type: 'select',
  fields: fields(['user_id', 'group_list']),
  from: { base: table, joins: [refs.user_group] },
  group: fieldMap.user_id,
  alias: 'group_agg'
};
const findAll = ({ short_name, long_name, sort, order, per_page, page }) => sql.select({
  fields: ['edpgroup.*'],
  from: { base: table },
  ...(short_name || long_name ? {
    where: {
      filters: [
        ...(short_name ? [{ field: 'edpgroup.short_name', like: 'short_name' }] : []),
        ...(long_name ? [{ field: 'edpgroup.long_name', like: 'long_name' }] : []),
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
  from: { base: table },
  where: {
    filters: [ { field: fieldMap.id, param: 'id' } ]
  }
});
const findByName = (params) => sql.select({
  fields: fields(allFields),
  from: { base: table },
  where: {
    filters: [
      ...(short_name ? [{ field: 'edpgroup.short_name', like: 'short_name' }] : []),
      ...(long_name ? [{ field: 'edpgroup.long_name', like: 'long_name' }] : []),
    ]
  }
});

module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.findByName = findByName;
module.exports.userJoin = userJoin;
module.exports.userJoinList = userJoinList;
