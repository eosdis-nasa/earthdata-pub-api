const sql = require('./sql-builder.js');

const findAll = () => 'SELECT service.* FROM service';
const findById = () => `${findAll()} WHERE service.id = {{id}}`;
const findByName = () => `${findAll()} WHERE service.short_name = {{short_name}}`;

module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.findByName = findByName;
