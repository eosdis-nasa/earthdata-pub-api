const sql = require('./sql-builder.js');

const findAll = () => 'SELECT service.* FROM service';
const findById = () => `${findAll()} WHERE service.id = {{id}}`;
const findByName = () => `${findAll()} WHERE service.short_name = {{short_name}}`;
const createSecret = () => `INSERT INTO service_secret(id, secret, submission_id) VALUES ({{id}}, {{secret}}, {{submission_id}})`;
const findSecret = () => `SELECT * FROM service_secret WHERE service_secret.id = {{id}} AND service_secret.submission_id = {{submissionId}}`;
const deleteSecret = () => `DELETE FROM service_secret WHERE service_secret.id = {{id}}`;

module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.findByName = findByName;
module.exports.createSecret = createSecret;
module.exports.findSecret = findSecret;
module.exports.deleteSecret = deleteSecret;
