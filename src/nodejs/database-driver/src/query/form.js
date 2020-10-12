const findAll = `SELECT form.* FROM form`;
const findById = `
  SELECT
    form.*, sections
  FROM form
  LEFT JOIN (
    SELECT
      section.form_id,
      JSONB_AGG(JSON_BUILD_OBJECT(
    		'heading', section.heading,
    		'questions', questions) ORDER BY section.list_order) sections
    FROM section
  	LEFT JOIN (
    	SELECT
    		section_question.section_id,
    		JSONB_AGG(JSONB_BUILD_OBJECT(
    			'question_name', question.question_name,
    			'version', question.version,
    			'text', question.text,
    			'inputs', inputs
    			) ORDER BY section_question.list_order) questions
    	FROM question
    	LEFT JOIN section_question ON (section_question.question_id = question.id)
    	LEFT JOIN (
    		SELECT
    			input.question_id,
    			JSONB_AGG(JSONB_BUILD_OBJECT(
    				'type', input.type,
    				'label', input.label) ORDER BY input.list_order) inputs
    		FROM input
        GROUP BY input.question_id) input_agg ON question.id = input_agg.question_id
  	  GROUP BY section_question.section_id) question_agg ON section.id = question_agg.section_id
    GROUP BY section.form_id) section_agg ON form.id = section_agg.form_id
  WHERE form.id = {{form.id}}`;

module.exports.findAll = findAll;
module.exports.findById = findById;
