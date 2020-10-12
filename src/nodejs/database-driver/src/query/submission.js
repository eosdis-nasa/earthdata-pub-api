const findAll = `SELECT submission.* FROM submission`;
const findById = `${findAll} WHERE submission.id = {{submission.id}}`;

module.exports.findAll = findAll;
module.exports.findById = findById;
