const findAll = 'SELECT service.* FROM service';
const findById = `${findAll} WHERE service.id = {{service.id}}`;
const findByName = `${findAll} WHERE service.service_name = {{service.service_name}}`;

module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.findByName = findByName;
