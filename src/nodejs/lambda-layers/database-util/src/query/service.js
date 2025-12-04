const sql = require('./sql-builder.js');

const findAll = ({ sort, order, per_page, page, where }) => sql.select({
  fields: ['service.*'],
  from: { base: 'service' },
  ...(where ? { where: {filters: [{cmd: where}]} }: {}),
  ...(sort ? { sort } : {}),
  ...(order ? { order } : {}),
  ...(per_page ? { limit: per_page } : {}),
  ...(page ? { offset: page } : {})
});

const findById = () => findAll({where: 'service.id = {{id}}'});
const findByName = () => findAll({where: 'service.short_name = {{short_name}}'});
const createSecret = () => `INSERT INTO service_secret(id, secret, submission_id) VALUES ({{id}}, {{secret}}, {{submission_id}})`;
const findSecret = () => `SELECT * FROM service_secret WHERE service_secret.id = {{id}} AND service_secret.submission_id = {{submissionId}}`;
const deleteSecret = () => `DELETE FROM service_secret WHERE service_secret.id = {{serviceId}} AND service_secret.submission_id = {{submissionId}}`;
const deleteSubmissionSecrets = () => `DELETE FROM service_secret WHERE service_secret.submission_id = {{submissionId}}`;

module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.findByName = findByName;
module.exports.createSecret = createSecret;
module.exports.findSecret = findSecret;
module.exports.deleteSecret = deleteSecret;
module.exports.deleteSubmissionSecrets = deleteSubmissionSecrets;
