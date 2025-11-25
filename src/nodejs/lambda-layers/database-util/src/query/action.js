const sql = require('./sql-builder.js');

const findAll = ({ sort, order, per_page, page }) => sql.select({
  fields: ['action.*'],
  from: { base: 'action' },
  ...(sort ? { sort } : {}),
  ...(order ? { order } : {}),
  ...(per_page ? { limit: per_page } : {}),
  ...(page ? { offset: page } : {})
});

const findById = () => `${findAll({})} WHERE action.id = {{id}}`;

module.exports.findAll = findAll;
module.exports.findById = findById;
