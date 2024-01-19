const sql = require('./sql-builder.js');

const findAll = () => 'SELECT module.* FROM module';
const findAllWithInterface = () => `${findAll()} WHERE module.has_interface = TRUE`;
const findById = () => `${findAll()} WHERE module.id = {{id}}`;
const findByName = () => `${findAll()} WHERE module.short_name = {{short_name}}`;

module.exports.findAll = findAll;
module.exports.findAllWithInterface = findAllWithInterface;
module.exports.findById = findById;
module.exports.findByName = findByName;
