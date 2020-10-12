const findAll = `SELECT edpuser.* FROM edpuser`;
const findById = `${findAll} WHERE edpuser.id = {{user.id}}`;
const findByGroupId = `${findAll}
  WHERE edpuser.id IN (
    SELECT edpuser_edpgroup.edpuser_id
    FROM edpuser_edpgroup
    WHERE edpuser_edpgroup.edpgroup_id = {{group.id}})`;
const findByGroupName = `${findAll}
  WHERE edpuser.id IN (
    SELECT edpuser_edpgroup.edpuser_id
    FROM edpuser_edpgroup
    WHERE edpuser_edpgroup.edpgroup_id IN (
      SELECT edpgroup.id FROM edpgroup
      WHERE edpgroup.group_name = {{group.group_name}})`;

module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.findByGroupId = findByGroupId;
module.exports.findByGroupName = findByGroupName;
