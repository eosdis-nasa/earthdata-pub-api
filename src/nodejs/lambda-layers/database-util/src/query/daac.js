const sql = require('./sql-builder.js');

const findAll = () => 'SELECT daac.* FROM daac ORDER BY short_name ASC';
const findById = () => `${findAll()} WHERE daac.id = {{id}}`;

module.exports.findAll = findAll;
module.exports.findById = findById;
