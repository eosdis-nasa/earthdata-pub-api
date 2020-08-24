function radioDefault({ id, enums }) {
  console.log(enums);
  return { [id]: enums[0] };
}

function textDefault({ id }) {
  return { [id]: '' };
}

function numberDefault({ id }) {
  return { [id]: 0 };
}

function dateDefault({ id }) {
  return { [id]: '01-01-0000' };
}

function checkboxDefault({ id }) {
  return { [id]: false };
}

const defaultMap = {
  file: textDefault,
  email: textDefault,
  text: textDefault,
  textarea: textDefault,
  number: numberDefault,
  date: dateDefault,
  radio: radioDefault,
  checkbox: checkboxDefault
};

function defaultValue({
  id, type, enums, required
}) {
  console.log(defaultMap[type]({ id, enums }));
  return defaultMap[type]({ id, enums });
}

function getFormDefaults(form) {
  return form.sections.reduce((acc, section) => {
    section.questions.forEach((question) => {
      question.inputs.forEach((input) => {
        console.log(input);
        Object.assign(acc, defaultValue(input));
      });
    });
    return acc;
  }, {});
}

module.exports.getFormDefaults = getFormDefaults;
