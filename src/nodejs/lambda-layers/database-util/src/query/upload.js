const sql = require('./sql-builder.js');

const findAllUploadSteps = () => 'SELECT upload_step.* FROM upload_step';
const findUploadStepById = () => `${findAllUploadSteps()} WHERE upload_step.id = {{id}}`;

module.exports.findAllUploadSteps = findAllUploadSteps;
module.exports.findUploadStepById  = findUploadStepById;