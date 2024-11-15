const sql = require('./sql-builder.js');
const section = require('./section.js');

const table = 'form';
const allFields = ['id', 'short_name', 'version', 'long_name', 'description', 'daac_only', 'created_at', 'sections'];
const fieldMap = {
  id: 'form.id',
  short_name: 'form.short_name',
  version: 'form.version',
  long_name: 'form.long_name',
  description: 'form.description',
  daac_only: 'form.daac_only',
  created_at: 'form.created_at',
  sections: 'sections'
};
const refs = {
  section: {
    type: 'left_join',
    src: section.formJoin(),
    on: { left: fieldMap.id, right: 'section_agg.form_id' }
  }
};

const fields = (list) => list.map((field) => fieldMap[field]);

const createForm = (params) => `
INSERT INTO form (short_name, version, long_name${params.description ? ', description' : ''}${params.daac_only ? ', daac_only' : ''})
VALUES ('${params.short_name}', ${params.version}, '${params.long_name}'${params.description ? `, '${params.description}'` : ''}${params.daac_only ? `, ${params.daac_only}` : ''})
RETURNING *;
`;

const updateForm = (params) => `
UPDATE form
SET
  short_name = '${params.short_name}',
  version = ${params.version},
  long_name = '${params.long_name}'
  description = '${params.description}'
  daac_only = '${params.daac_only}'
WHERE short_name = '${params.original_shortname}' AND version = ${params.original_version}
RETURNING *;
`;


const findAll = ({
  short_name, version, long_name, created_after, created_before, privileged_user, order, sort, per_page, page
}) => sql.select({
  fields: fields(['id', 'short_name', 'version', 'long_name', 'description', 'daac_only', 'created_at']),
  from: {
    base: table
  },
  where: {
    filters: [
      ...(short_name ? [{ field: 'form.short_name', like: 'short_name' }] : []),
      ...(version ? [{ field: 'form.version', param: 'version' }] : []),
      ...(long_name ? [{ field: 'form.long_name', like: 'long_name' }] : []),
      ...(created_after ? [{ field: 'form.created_at', op: 'gte', param: 'created_after' }] : []),
      ...(created_before ? [{ field: 'form.created_at', op: 'lte', param: 'created_before' }] : []),
      ...(privileged_user ? [] : [{ field: 'form.daac_only',  op: 'eq', value: "FALSE" }])
    ]
  },
  ...(sort ? { sort } : {}),
  ...(order ? { order } : {}),
  ...(per_page ? { limit: per_page } : {}),
  ...(page ? { offset: page } : {})
});

const findById = (params) => sql.select({
  field: fields(allFields),
  from: {
    base: table,
    joins: [refs.section]
  },
  where: {
    filters: [
      { field: 'form.id', param: 'id' },
      ...(params.privileged_user ? [] : [{ field: 'form.daac_only',  op: 'eq', value: "FALSE" }])
    ]
  }
});


module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.createForm = createForm;
module.exports.updateForm = updateForm;