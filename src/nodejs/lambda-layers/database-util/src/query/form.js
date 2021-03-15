const sql = require('./sql-builder.js');
const section = require('./section.js');

const table = "form";
const allFields = ['id', 'short_name', 'version', 'long_name', 'description', 'created_at', 'sections'];
const fieldMap = {
  id: "form.id",
  short_name: "form.short_name",
  version: "form.version",
  long_name: "form.long_name",
  description: "form.description",
  created_at: "form.created_at",
  sections: "sections"
};
const refs = {
  section: {
    type: 'left_join',
    src: section.formJoin(),
    on: { left: fieldMap.id, right: 'section_agg.form_id' }
  }
};

const fields = (list) => {
  return list.map(field => fieldMap[field]);
}

const findAll = (params) => sql.select({
  fields: fields(['id', 'short_name', 'version', 'long_name', 'description', 'created_at']),
  from: {
    base: table
  }
});


const findById = (params) => sql.select({
  field: fields(allFields),
  from: {
    base: table,
    joins: [refs.section]
  },
  where: {
    filters: [{ field: fieldMap.id }]
  }
});

module.exports.findAll = findAll;
module.exports.findById = findById;
