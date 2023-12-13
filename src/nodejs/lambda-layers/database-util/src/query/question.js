const sql = require('./sql-builder.js');

const table = 'question';
const allFields = ['id', 'short_name', 'version', 'long_name', 'text', 'help', 'required', 'created_at', 'inputs', 'daac_ids'];
const fieldMap = {
  id: 'question.id',
  short_name: 'question.short_name',
  version: 'question.version',
  long_name: 'question.long_name',
  text: 'question.text',
  help: 'question.help',
  required: 'question.required',
  created_at: 'question.created_at',
  daac_ids: 'question.daac_ids',
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
              ['list_order', 'input.list_order'],
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
          sort: 'input.list_order',
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
          ['daac_ids', 'question.daac_ids'],
          ['inputs', 'inputs']
        ]
      },
      sort: 'section_question.list_order',
      alias: 'questions'
    }],
  from: {
    base: 'question',
    joins: [refs.section_question, refs.input]
  },
  where: {
    filters:[
      ...([{cmd: `(question.daac_ids = '{}' OR {{daac_id}} = ANY(question.daac_ids))`}]),
    ]
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
        'list_order', input.list_order,
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
const findById = () => `${findAllEx()} WHERE question.id = {{id}}`;
const findByName = () => `${findAllEx()} WHERE question.short_name = {{short_name}}`;
const update = ({ daac_ids }) => `
  INSERT INTO question (id, short_name, version, long_name, text, help, required, created_at, daac_ids)
  VALUES ({{payload.id}}, {{payload.short_name}}, {{payload.version}}, {{payload.long_name}}, {{payload.text}},
  {{payload.help}}, {{payload.required}}, {{payload.created_at}}, ARRAY(
    SELECT DISTINCT unnest(array_cat(daac_ids, ARRAY['${daac_ids.join('\',\'')}']::UUID[]))
  ))
  ON CONFLICT(short_name, version) DO UPDATE SET
  long_name = EXCLUDED.long_name, text = EXCLUDED.text, help = EXCLUDED.help,
  required = EXCLUDED.required, created_at = EXCLUDED.created_at, EXCLUDED.daac_ids
  RETURNING *`;
const add = ({ daac_ids }) => `
  WITH new_question AS (${update({ daac_ids })}),
  new_section_question AS (INSERT INTO section_question (section_id, question_id, list_order, required_if, show_if)
  VALUES ({{payload.section_question.section_id}}, {{payload.section_question.question_id}}, 
  {{payload.section_question.list_order}}, {{payload.section_question.required_if}}, 
  {{payload.section_question.show_if}}) ON CONFLICT(section_id, question_id) DO UPDATE SET
  section_id = EXCLUDED.section_id, question_id = EXCLUDED.question_id, list_order = EXCLUDED.list_order,
  required_if = EXCLUDED.required_if, show_if = EXCLUDED.show_if
  RETURNING *)
  SELECT * FROM new_question`;
const updateInput = () => `
  INSERT INTO input (question_id, control_id, list_order, label, type, enums, attributes, required_if, show_if, required)
  VALUES ({{questionId}}, {{input.control_id}}, {{input.list_order}}, {{input.label}}, {{input.type}},
  {{input.enums}}, {{input.attributes}}, {{input.required_if}}, {{input.show_if}}, {{input.required}})
  ON CONFLICT(question_id, control_id) WHERE ((question_id)::text = {{input.question_id}}::text) DO UPDATE SET
  list_order = EXCLUDED.list_order, label = EXCLUDED.label, type = EXCLUDED.type, enums = EXCLUDED.enums, 
  attributes = EXCLUDED.attributes,  required_if = EXCLUDED.required_if, show_if = EXCLUDED.show_if, 
  required = EXCLUDED.required
  RETURNING *`;
const deleteInput = (params) => `
  DELETE FROM input
    WHERE control_id IN ('${params.toDelete.join("','")}')
    RETURNING *`;

module.exports.sectionJoin = sectionJoin;

module.exports.findAll = findAll;
module.exports.findAllEx = findAllEx;
module.exports.findByName = findByName;
module.exports.findById = findById;
module.exports.update = update;
module.exports.add = add;
module.exports.updateInput = updateInput;
module.exports.deleteInput = deleteInput;