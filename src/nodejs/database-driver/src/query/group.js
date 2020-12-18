const findAll = 'SELECT edpgroup.* FROM edpgroup';
const findById = `${findAll} WHERE edpgroup.id = {{group.id}}`;
const findByName = `${findAll} WHERE edpgroup.short_name = {{group.short_name}}`;
const findByUserId = `${findAll}
  WHERE edpgroup.id IN (SELECT edpuser_edpgroup.edpuser_id WHERE edpuser_edpgroup.edpuser_id = {{user.id}})`;

module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.findByName = findByName;
module.exports.findByUserId = findByUserId;
