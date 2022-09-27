const sql = require('./sql-builder.js');
const table = 'paragraph';

const findAll = () => sql.select({
  fields: ['paragraph.*'],
  from: { base: table }
});

const findById = () => sql.select({
  fields: ['paragraph.*'],
  from: { base: table },
  where: { filters: [{ field: 'paragraph_key' }]}
});

const update = () => `
INSERT INTO paragraph VALUES
({{payload.paragraph_key}}, {{payload.page_id}}, {{payload.content}}::JSONB)
ON CONFLICT(paragraph_key) DO UPDATE SET
content = EXCLUDED.content
RETURNING *`;

module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.update = update;
