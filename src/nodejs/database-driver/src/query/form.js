const findAll = 'SELECT form.* FROM form';
const findById = `
  SELECT
    form.*, sections
  FROM form
  LEFT JOIN (
    SELECT
      section.form_id,
      JSONB_AGG(JSON_BUILD_OBJECT(
        'heading', section.heading,
        'required_if', section.required_if,
        'show_if', section.show_if,
        'questions', questions) ORDER BY section.list_order) sections
    FROM section
    LEFT JOIN (
      SELECT
        section_question.section_id,
        JSONB_AGG(JSONB_BUILD_OBJECT(
          'question_name', question.question_name,
          'version', question.version,
          'text', question.text,
          'required', question.required,
          'required_if', section_question.required_if,
          'show_if', section_question.show_if,
          'inputs', inputs
          ) ORDER BY section_question.list_order) questions
      FROM question
      LEFT JOIN section_question ON (section_question.question_id = question.id)
      LEFT JOIN (
        SELECT
          input.question_id,
          JSONB_AGG(JSONB_BUILD_OBJECT(
            'id', input.id,
            'type', input.type,
            'label', input.label,
            'attributes', input.attributes,
            'required', input.required,
            'required_if', input.required_if,
            'show_if', input.show_if,
            'enums', input.enums) ORDER BY input.list_order) inputs
        FROM input
        GROUP BY input.question_id) input_agg ON question.id = input_agg.question_id
      GROUP BY section_question.section_id) question_agg ON section.id = question_agg.section_id
    GROUP BY section.form_id) section_agg ON form.id = section_agg.form_id
  WHERE form.id = {{form.id}}`;

module.exports.findAll = findAll;
module.exports.findById = findById;
