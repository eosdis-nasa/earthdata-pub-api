const sql = require('./sql-builder.js');

const find = () => 'SELECT daac.* FROM daac';
const order = () => 'ORDER BY short_name ASC';
const findAll = () => `${find()} ${order()}`;
const findById = () => `${find()} WHERE daac.id = {{id}} ${order()}`;

module.exports.findAll = findAll;
module.exports.findById = findById;
