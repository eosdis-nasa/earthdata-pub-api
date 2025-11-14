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

const findAll = ({ sort, order, per_page, page }) => sql.select({
  fields: ['question.*'],
  from: { base: 'question' },
  ...(sort ? { sort } : {}),
  ...(order ? { order } : {}),
  ...(per_page ? { limit: per_page } : {}),
  ...(page ? { offset: page } : {})
});

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

const update = (params) => 
  `UPDATE question
   SET 
     long_name = {{payload.long_name}}, text = {{payload.text}}, help = {{payload.help}}, required = {{payload.required}}, created_at = {{payload.created_at}},
     daac_ids = ARRAY(
       SELECT DISTINCT unnest(array_cat(daac_ids, ARRAY[${params.payload.daac_ids.map(id => `'${id}'`).join(',')}]::UUID[]))
     )
   WHERE short_name = {{payload.short_name}} and version = {{payload.version}}
   RETURNING *`;
const add = (params) => `
  WITH new_question AS (INSERT INTO question (${params.payload.id ? 'id,': ''} short_name, version, long_name, text, 
  help, required, ${params.payload.created_at ? 'created_at,': ''} daac_ids)
  VALUES (${params.payload.id ? '{{payload.id}},': ''} {{payload.short_name}}, {{payload.version}}, {{payload.long_name}}, {{payload.text}}, {{payload.help}}, 
  {{payload.required}}, ${params.payload.created_at ? '{{payload.created_at}},': ''} ${params.payload.daac_ids && params.payload.daac_ids.length > 0 ? `ARRAY['${params.payload.daac_ids.join('\',\'')}']::UUID[]` : `ARRAY[]::UUID[]`} 
  ) RETURNING *
    ),
  new_section_question AS (INSERT INTO section_question (section_id, question_id, list_order, required_if, show_if)
  SELECT {{payload.section_question.section_id}}, new_question.id, 
  {{payload.section_question.list_order}}, ${params.payload.section_question.required_if ? `'${JSON.stringify(params.payload.section_question.required_if)}'::JSONB`: "'[]'::JSONB"}, 
  ${params.payload.section_question.show_if ? `'${JSON.stringify(params.payload.section_question.show_if)}'::JSONB`: "'[]'::JSONB"}
  FROM new_question ON CONFLICT(section_id, question_id) DO UPDATE SET
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


const createOneInput = () => `
  INSERT INTO input (question_id, control_id, list_order, label, type, enums, attributes, required_if, show_if, required)
  VALUES (
    {{input.question_id}}, 
    {{input.control_id}}, 
    {{input.list_order}}, 
    {{input.label}}, 
    {{input.type}},
    {{input.enums}}::JSONB, 
    {{input.attributes}}::JSONB, 
    {{input.required_if}}::JSONB, 
    {{input.show_if}}::JSONB, 
    {{input.required}}
  )
  RETURNING *;
`;

const updateOneInput = () => `
  UPDATE input
  SET 
    control_id = {{input.control_id}},
    question_id = {{input.question_id}}, 
    list_order = {{input.list_order}},
    label = {{input.label}},
    type = {{input.type}},
    enums = {{input.enums}}::JSONB,
    attributes = {{input.attributes}}::JSONB,
    required_if = {{input.required_if}}::JSONB,
    show_if = {{input.show_if}}::JSONB,
    required = {{input.required}}
  WHERE 
    question_id = {{input.old_question_id}}
    AND control_id = {{input.old_control_id}}
  RETURNING *;
`;

const inputFindById = () => `SELECT input.* FROM input where question_id={{input.id}} and control_id={{input.control_id}}`;
const inputFindAll = () => `SELECT input.* FROM input`;

module.exports.sectionJoin = sectionJoin;

module.exports.findAll = findAll;
module.exports.findAllEx = findAllEx;
module.exports.findByName = findByName;
module.exports.findById = findById;
module.exports.update = update;
module.exports.add = add;
module.exports.updateInput = updateInput;
module.exports.deleteInput = deleteInput;
module.exports.createOneInput = createOneInput;
module.exports.updateOneInput = updateOneInput;
module.exports.inputFindById = inputFindById;
module.exports.inputFindAll = inputFindAll;

