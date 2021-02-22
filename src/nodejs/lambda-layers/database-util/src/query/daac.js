const sql = require('./sql-builder.js');
const findAll = () => 'SELECT daac.* FROM daac';
const findById = () => `${findAll()} WHERE daac.id = {{daac.id}}`;

module.exports.findAll = findAll;
module.exports.findById = findById;
