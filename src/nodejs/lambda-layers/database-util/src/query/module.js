const sql = require('./sql-builder.js');

const findAll = () => 'SELECT module.* FROM module';
const findById = () => `${findAll()} WHERE module.id = {{module.id}}`;
const findByName = () => `${findAll()} WHERE module.short_name = {{short_name}}`;

module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.findByName = findByName;
