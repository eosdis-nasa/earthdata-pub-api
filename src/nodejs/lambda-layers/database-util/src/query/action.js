const sql = require('./sql-builder.js');

const findAll = ({ sort, order, per_page, page, where }) => sql.select({
  fields: ['action.*'],
  from: { base: 'action' },
  ...(where ? { where: {filters: [{cmd: where}]} }: {}),
  ...(sort ? { sort } : {}),
  ...(order ? { order } : {}),
  ...(per_page ? { limit: per_page } : {}),
  ...(page ? { offset: page } : {})
});

const findById = () => findAll({ where: 'action.id = {{id}}' });

module.exports.findAll = findAll;
module.exports.findById = findById;
