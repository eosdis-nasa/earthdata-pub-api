const findAll = 'SELECT service.* FROM service';
const findById = `${findAll} WHERE service.id = {{service.id}}`;
const findByName = `${findAll} WHERE service.short_name = {{service.short_name}}`;

module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.findByName = findByName;
