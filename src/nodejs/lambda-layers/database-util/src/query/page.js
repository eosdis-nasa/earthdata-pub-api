const sql = require('./sql-builder.js');
const table = 'page';

const findAll = () => sql.select({
  fields: ['page.*'],
  from: { base: table },
});

const findById = () => sql.select({
  fields: ['page.*'],
  from: { base: table },
  where: { filters: [{ field: 'id' }]}
});

const update = () => `
INSERT INTO page VALUES
({{payload.id}}, {{payload.description}}, {{payload.location}}::JSONB)
ON CONFLICT(id) DO UPDATE SET
description = EXCLUDED.description
RETURNING *`;

module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.update = update;
