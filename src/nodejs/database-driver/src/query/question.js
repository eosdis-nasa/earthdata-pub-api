const findAll = 'SELECT question.* FROM question';
const findAllEx = `
  SELECT question.*, inputs
  FROM question
  LEFT JOIN (
    SELECT
      input.question_id,
      JSONB_AGG(JSONB_BUILD_OBJECT(
        'id', input.id,
        'type', input.type,
        'label', input.label,
        'attributes', input.attributes,
        'required_if', input.required_if,
        'show_if', input.show_if,
        'enums', input.enums) ORDER BY input.list_order) inputs
    FROM input
    GROUP BY input.question_id) input_agg ON question.id = input_agg.question_id`;
const findById = `${findAllEx} WHERE question.id = {{question.id}}`;
const findByName = `${findAllEx} WHERE question.short_name = {{question.short_name}}`;
const findBySectionId = `${findAllEx} WHERE question.id IN (
  SELECT section_question.question_id
  FROM section_question
  WHERE section_question.section_id = {{section.id}})`;

module.exports.findAll = findAll;
module.exports.findAllEx = findAllEx;
module.exports.findByName = findByName;
module.exports.findBySectionId = findBySectionId;
module.exports.findById = findById;
