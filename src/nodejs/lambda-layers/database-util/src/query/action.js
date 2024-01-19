const sql = require('./sql-builder.js');

const findAll = () => 'SELECT action.* FROM action';
const findById = () => `${findAll()} WHERE action.id = {{id}}`;

module.exports.findAll = findAll;
module.exports.findById = findById;
