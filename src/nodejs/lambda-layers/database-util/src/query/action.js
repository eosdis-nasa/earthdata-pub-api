const sql = require('./sql-builder.js');

const SORT_COLUMNS = {
  id: 'action.id',
  short_name: 'action.short_name',
  version: 'action.version',
  long_name: 'action.long_name',
  description: 'action.description',
  created_at: 'action.created_at'
};

const findAll = ({ sort, order, per_page, page, where }) => sql.select({
  fields: ['action.*'],
  from: { base: 'action' },
  sort_columns: SORT_COLUMNS,
  ...(where ? { where: {filters: [{cmd: where}]} }: {}),
  ...(sort ? { sort } : {}),
  ...(order ? { order } : {}),
  ...(per_page ? { limit: per_page } : {}),
  ...(page ? { offset: page } : {})
});

const findById = () => findAll({ where: 'action.id = {{id}}' });

module.exports.findAll = findAll;
module.exports.findById = findById;
