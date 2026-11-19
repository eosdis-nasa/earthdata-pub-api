const sql = require('./sql-builder.js');

const SORT_COLUMNS = {
  id: 'daac.id',
  short_name: 'daac.short_name',
  long_name: 'daac.long_name',
  url: 'daac.url',
  description: 'daac.description',
  discipline: 'daac.discipline',
  workflow_id: 'daac.workflow_id',
  edpgroup_id: 'daac.edpgroup_id',
  hidden: 'daac.hidden'
};

const find = () => 'SELECT daac.* FROM daac';
const order = () => 'ORDER BY short_name ASC';

const findAll = ({ sort, order, per_page, page }) => sql.select({
  fields: ['daac.*'],
  from: { base: 'daac' },
  sort_columns: SORT_COLUMNS,
  ...(sort ? { sort } : { sort: 'short_name'}),
  ...(order ? { order } : { order: 'ASC'}),
  ...(per_page ? { limit: per_page } : {}),
  ...(page ? { offset: page } : {})
});

const findById = () => `${find()} WHERE daac.id = {{id}} ${order()}`;
const getIds = (params) => `SELECT id FROM daac WHERE edpgroup_id IN ('${params.group_ids.join("','")}')`;
const getActiveDaacs = () => `${find()} WHERE hidden = 'false' AND NOT id = '1c36f0b9-b7fd-481b-9cab-3bc3cea35413' ${order()}`;


module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.getIds = getIds;
module.exports.getActiveDaacs = getActiveDaacs;
