const sql = require('./sql-builder.js');
const table = 'page';

const findAll = () => sql.select({
  fields: ['page.*'],
  from: { base: table }
});

const findById = () => sql.select({
  fields: ['page.content'],
  from: { base: table },
  where: { filters: [{ field: 'page_key' }]}
});

const update = () => `
INSERT INTO page VALUES
({{payload.page_key}}, {{payload.content}}::JSONB)
ON CONFLICT(page_key) DO UPDATE SET
content = EXCLUDED.content
RETURNING *`;

module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.update = update;
