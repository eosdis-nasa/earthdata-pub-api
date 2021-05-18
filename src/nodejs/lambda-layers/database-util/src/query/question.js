const sql = require('./sql-builder.js');

const table = 'question';
const allFields = ['id', 'short_name', 'version', 'long_name', 'text', 'help', 'required', 'created_at', 'inputs'];
const fieldMap = {
  id: 'question.id',
  short_name: 'question.short_name',
  version: 'question.version',
  long_name: 'question.long_name',
  text: 'question.text',
  help: 'question.help',
  required: 'question.required',
  created_at: 'question.created_at',
  inputs: 'inputs'
};
const refs = {
  section_question: {
    type: 'left_join',
    src: 'section_question',
    on: { left: fieldMap.id, right: 'section_question.question_id' }
  },
  input: {
    type: 'left_join',
    src: sql.select({
      fields: [
        'input.question_id',
        {
          type: 'json_agg',
          src: {
            type: 'json_obj',
            keys: [
              ['control_id', 'input.control_id'],
              ['type', 'input.type'],
              ['label', 'input.label'],
              ['attributes', 'input.attributes'],
              ['required', 'input.required'],
              ['required_if', 'input.required_if'],
              ['show_if', 'input.show_if'],
              ['enums', 'input.enums']
            ]
          },
          order: 'input.list_order',
          alias: 'inputs'
        }
      ],
      from: { base: 'input' },
      group: 'input.question_id',
      alias: 'input_agg'
    }),
    on: { left: 'input_agg.question_id', right: fieldMap.id }
  }
};

function fields(list) {
  return list.map((field) => fieldMap[field]);
}

const sectionJoin = () => sql.select({
  fields: [
    'section_question.section_id',
    {
      type: 'json_agg',
      src: {
        type: 'json_obj',
        keys: [
          ['short_name', 'question.id'],
          ['version', 'question.version'],
          ['long_name', 'question.long_name'],
          ['help', 'question.help'],
          ['text', 'question.text'],
          ['required', 'question.required'],
          ['required_if', 'section_question.required_if'],
          ['show_if', 'section_question.show_if'],
          ['inputs', 'inputs']
        ]
      },
      order: 'section_question.list_order',
      alias: 'questions'
    }],
  from: {
    base: 'question',
    joins: [refs.section_question, refs.input]
  },
  group: 'section_question.section_id',
  alias: 'question_agg'
});

const findAll = () => 'SELECT question.* FROM question';
const findAllEx = () => `
  SELECT question.*, inputs
  FROM question
  LEFT JOIN (
    SELECT
      input.question_id,
      JSONB_AGG(JSONB_BUILD_OBJECT(
        'control_id', input.control_id,
        'type', input.type,
        'label', input.label,
        'attributes', input.attributes,
        'required', input.required,
        'required_if', input.required_if,
        'show_if', input.show_if,
        'enums', input.enums) ORDER BY input.list_order) inputs
    FROM input
    GROUP BY input.question_id) input_agg ON question.id = input_agg.question_id`;
const findById = () => `${findAllEx()} WHERE question.id = {{question.id}}`;
const findByName = () => `${findAllEx()} WHERE question.short_name = {{question.short_name}}`;
const findBySectionId = () => `${findAllEx()} WHERE question.id IN (
  SELECT section_question.question_id
  FROM section_question
  WHERE section_question.section_id = {{section.id}})`;

module.exports.sectionJoin = sectionJoin;

module.exports.findAll = findAll;
module.exports.findAllEx = findAllEx;
module.exports.findByName = findByName;
module.exports.findBySectionId = findBySectionId;
module.exports.findById = findById;
