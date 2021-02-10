const sql = require('./sql-builder.js');
const findAll = () => 'SELECT daac.* FROM daac';
const findById = () => `${findAll} WHERE daac.short_name = {{daac.short_name}}`;

module.exports.findAll = findAll;
module.exports.findById = findById;
