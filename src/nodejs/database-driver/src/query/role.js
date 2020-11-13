const findAll = 'SELECT edprole.* FROM edprole';
const findAllEx = `${findAll} `;
const findById = `${findAll} WHERE edprole.id = {{role.id}}`;
const findByName = `${findAll} WHERE edpgroup.short_name = {{role.short_name}}`;

module.exports.findAll = findAll;
module.exports.findAllEx = findAllEx;
module.exports.findById = findById;
module.exports.findByName = findByName;
