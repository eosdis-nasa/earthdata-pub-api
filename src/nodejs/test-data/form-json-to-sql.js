const fs = require('fs');
const crypto = require('crypto');

const inserts = {
  forms: [],
  sections: [],
  questions: [],
  section_questions: [],
  inputs: []
}

function uuid() {
  const base = '10000000-1000-4000-8000-100000000000';
  const uuid = base.replace(/[018]/g, (char) => {
    const bytes = crypto.randomBytes(1)[0];
    const value = char ^ (bytes & (15 >> (char / 4)));
    return value.toString(16);
  });
  return uuid;
}

function inputToSql(input, i, question) {
  // Input(question_id, control_id, list_order, label, type, enums, attributes, required_if, show_if, required, FALSE)
  const insert = `INSERT INTO input VALUES ('${question.id}', '${input.control_id}', ${i}, '${input.label}', '${input.type}', '${JSON.stringify(input.enums||{})}', '${JSON.stringify(input.attributes||{})}', '${JSON.stringify(input.required_if||[])}','${JSON.stringify(input.show_if||[])}',  ${input.required?'True':'False'});`;
  return insert;
}

function questionToSql(question) {
  // Question(id, short_name, version, long_name, text, help)
  const insert = `INSERT INTO question VALUES ('${question.id}', '${question.short_name}', ${question.version}, '${question.long_name}', '${question.text}', '${question.help}');`
  return insert;
}

function sectionQuestionToSql(question, i, section) {
  // SectionQuestion(section_id, question_id, list_order, required_if, show_if)
  const insert = `INSERT INTO section_question VALUES ('${section.id}', '${question.id}', ${i}, '${JSON.stringify(question.required_if||[])}', '${JSON.stringify(question.show_if||[])}');`
  return insert;
}

function sectionToSql(section, i, form) {
  // Section(id, form_id, heading, list_order)
  const insert = `INSERT INTO section VALUES ('${section.id}', '${form.id}', '${section.heading}', ${i}, '${JSON.stringify(section.required_if||[])}', '${JSON.stringify(section.show_if||[])}');`;
  return insert;
}

function formToSql(form) {
  // Form(id, short_name, version, long_name, description, text)
  const insert = `INSERT INTO form VALUES ('${form.id}', '${form.short_name}', ${form.version}, '${form.long_name}', '${form.description}', '${form.text}');`;
  return insert;
}

function parseQuestion(question, i, section) {
  question.id = question.id || uuid();
  inserts.questions.push(questionToSql(question));
  inserts.section_questions.push(sectionQuestionToSql(question, i, section));
  question.inputs.forEach((input, i) => {
    inserts.inputs.push(inputToSql(input, i, question));
  });
}

function parseSection(section, i, form) {
  section.id = section.id || uuid();
  inserts.sections.push(sectionToSql(section, i, form));
  section.questions.forEach((question, i) => {
    parseQuestion(question, i, section);
  })
}

function parseForm(form) {
  form.id = form.id || uuid();
  inserts.forms.push(formToSql(form));
  console.log(form)
  form.sections.forEach((section, i) => {
    parseSection(section, i, form);
  });
}

function clean(obj) {
  if (typeof obj === 'string') {
    return obj.replace(/'/g, '\'\'');
  } else if (Array.isArray(obj)) {
    obj.forEach((val, i) => {
      obj[i] = clean(val);
    });
  } else if (typeof obj === 'object') {
    Object.entries(obj).forEach(([key, val]) => {
      obj[key] = clean(val);
    });
  }
  return obj;
}

const formJson = require('./data_publication_request.json');

parseForm(clean(formJson));

const file = fs.createWriteStream('form.sql');
Object.entries(inserts).forEach(([key, val]) => {
  val.forEach(ins => { file.write(`${ins}\n`)});
});
