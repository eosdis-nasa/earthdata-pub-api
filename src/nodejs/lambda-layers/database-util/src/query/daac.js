const sql = require('./sql-builder.js');

const find = () => 'SELECT daac.* FROM daac';
const order = () => 'ORDER BY short_name ASC';
const findAll = () => `${find()} ${order()}`;
const findById = () => `${find()} WHERE daac.id = {{id}} ${order()}`;
const getIds = (params) => `SELECT id FROM daac WHERE edpgroup_id IN ('${params.group_ids.join("','")}')`;
const getActiveDaacs = () => `${find()} WHERE hidden = 'false' AND NOT id = '1c36f0b9-b7fd-481b-9cab-3bc3cea35413' ${order()}`;
const onboard = () => `UPDATE daac SET hidden = FALSE WHERE id = {{id}} RETURNING daac.*`;
const offboard = () => `UPDATE daac SET hidden = TRUE WHERE id = {{id}} RETURNING daac.*`;


module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.getIds = getIds;
module.exports.getActiveDaacs = getActiveDaacs;
module.exports.onboard = onboard;
module.exports.offboard = offboard;
