const findAll = `
SELECT edpuser.* FROM edpuser`;

const findById = `${findAll} WHERE edpuser.id = {{user.id}}`;

const findByGroupId = `
${findAll}
WHERE edpuser.id IN (
  SELECT edpuser_edpgroup.edpuser_id
  FROM edpuser_edpgroup
  WHERE edpuser_edpgroup.edpgroup_id = {{group.id}})`;

const findByGroupName = `
${findAll}
WHERE edpuser.id IN (
  SELECT edpuser_edpgroup.edpuser_id
  FROM edpuser_edpgroup
  WHERE edpuser_edpgroup.edpgroup_id IN (
    SELECT edpgroup.id FROM edpgroup
    WHERE edpgroup.short_name = {{group.short_name}})`;

const loginUser = `
INSERT INTO edpuser VALUES
({{user.id}}, {{user.name}}, {{user.email}}, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
last_login = EXCLUDED.last_login
RETURNING *`;

module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.findByGroupId = findByGroupId;
module.exports.findByGroupName = findByGroupName;
module.exports.loginUser = loginUser;
