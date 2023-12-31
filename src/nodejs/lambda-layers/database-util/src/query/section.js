const sql = require('./sql-builder.js');
const question = require('./question.js');

const table = 'section';
const allFields = ['id', 'form_id', 'heading', 'required_if', 'show_if', 'sections', 'questions', 'list_order', 'daac_id'];
const fieldMap = {
  id: 'section.id',
  form_id: 'section.form_id',
  heading: 'section.heading',
  required_if: 'section.required_if',
  show_if: 'section.show_if',
  list_order: 'section.list_order',
  daac_id: 'section.daac_id',
  sections: {
    type: 'json_agg',
    src: {
      type: 'json_obj',
      keys: [
        ['heading', 'section.heading'],
        ['required_if', 'section.required_if'],
        ['show_if', 'section.show_if'],
        ['daac_id', 'section.daac_id'],
        ['questions', 'questions']]
    },
    sort: 'section.list_order',
    alias: 'sections'
  },
  questions: 'questions'
};
const refs = {
  question: {
    type: 'left_join',
    src: question.sectionJoin(),
    on: { left: fieldMap.id, right: 'question_agg.section_id' }
  }
};
function fields(list) {
  return list.map((field) => fieldMap[field]);
}

const formJoin = () => sql.select({
  fields: fields(['form_id', 'sections']),
  from: {
    base: table,
    joins: [refs.question]
  },
  where: {
    filters:[
      ...([{ field: 'question_agg.questions', op: 'is_not', value: 'null'}]),
      ...([{cmd: '(section.daac_id IS NULL OR section.daac_id = {{daac_id}})'}]),
    ]
  },
  group: 'section.form_id',
  alias: 'section_agg'
});

module.exports.formJoin = formJoin;
