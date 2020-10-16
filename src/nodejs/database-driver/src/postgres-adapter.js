const { Client } = require('pg');
const actionQuery = require('./query/action.js');
const daacQuery = require('./query/daac.js');
const formQuery = require('./query/form.js');
const groupQuery = require('./query/group.js');
const noteQuery = require('./query/note.js');
const permissionQuery = require('./query/permission.js');
const questionQuery = require('./query/question.js');
const serviceQuery = require('./query/service.js');
const submissionQuery = require('./query/submission.js');
const subscriptionQuery = require('./query/subscription.js');
const userQuery = require('./query/user.js');
const workflowQuery = require('./query/workflow.js');

const config = {
  user: 'edpub',
  host: 'postgres',
  database: 'edpub',
  password: 'edpub',
  port: 5432
}

const statements = {
  action: actionQuery,
  daac: daacQuery,
  form: formQuery,
  group: groupQuery,
  note: noteQuery,
  permission: permissionQuery,
  question: questionQuery,
  service: serviceQuery,
  submission: submissionQuery,
  subscription: subscriptionQuery,
  user: userQuery,
  workflow: workflowQuery,
}

const parse = {
  findById: ([rows]) => { return rows },
  findAll: (rows) => { return rows },
  putItem: ([rows]) => { return row }
}

function getValueList(query, params) {
  let count = 0;
  const values = [];
  const text = query.replace(/\{\{(.*?)\}\}/g, function(match, token) {
    values.push(getNested(params, token.split('.')));
    return `$${++count}`;
  });
  return { text, values }
}

function getNested(obj, multiKey) {
  const [key, ...remaining] = multiKey;
  if (remaining < 1) {
    return obj[key];
  }
  else {
    return getNested(obj[key], remaining);
  }
}

function setNested(obj, multiKey, value) {
  const [key, ...remaining] = multiKey;
  if (remaining.length < 1) {
    obj[key] = value;
  } else {
    if (!obj[key]) {
      obj[key] = {};
    }
    setNested(obj[key], remaing, value);
  }
}

async function execute({ resource, operation }, params) {
  const client = new Client(config);
  let response;
  try {
    client.connect();
    console.log(resource, operation);
    const query = statements[resource][operation];
    const { text, values } = getValueList(query, params);
    const { rows } = await client.query({ text, values, rowMode:'object' });
    response = parse[operation](rows);
  }
  catch(e) {
    console.log(e);
    response = e;
  }
  finally {
    client.end();
  }
  return response;
}

module.exports.execute = execute;
module.exports.getNested = getNested;
module.exports.setNested = setNested;
