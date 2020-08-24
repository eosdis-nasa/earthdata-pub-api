/**
 * Lambda that exposes Information API to AWS API Gateway. This lambda
 * is used for fetching and updating user generated versioned databased entries
 * in the following tables:
 * Question, Form, Workflow, Action
 * @module Information
 */

const { DynamoDB } = require('aws-sdk');

const { DynamodbDriver, ErrorMessage } = require('database-driver');

const Schema = require('schema-util');

const ClientConfig = require('./client-config.js');

const dbDriver = new DynamodbDriver(
  new DynamoDB(ClientConfig.dynamodb),
  DynamoDB.Converter.marshall,
  DynamoDB.Converter.unmarshall,
  process.env.TABLE_SUFFIX
);

const available = {
  form: true,
  question: true,
  workflow: true
};

async function getMethod(table, pValue, sValue, index, latest, filter) {
  if (available[table]) {
    const response = await dbDriver.getItems(table, pValue, sValue, index, latest, filter);
    return response;
  }
  return [null, ErrorMessage.notAllowed];
}

async function postMethod(table, item) {
  const { id, version, ...itemSans } = item;
  if (Schema.hasForeignObjects(table)) {
    const referenceMap = Schema.getForeignObjects(table, itemSans);
    await dbDriver.refreshNestedObjects(referenceMap);
  }
  const nameIndex = Schema.isVersioned(table);
  const itemName = itemSans[nameIndex];
  const [[existing]] = await dbDriver.getItems(table, itemName, null, nameIndex, true);
  if (existing && id && version) {
    const { oldId, oldVersion, ...existingSans } = existing;
    if (Schema.deepEqual(itemSans, existingSans)) {
      return [null, ErrorMessage.noChange];
    } if (id !== oldId && version !== oldVersion) {
      return [null, ErrorMessage.notLatest];
    }
  }
  const newItem = Schema.attachNewId(itemSans, true, version);
  const response = await dbDriver.putItem(table, newItem);
  return response;
}

function getArgs(event, user) {
  const { table } = event.pathParameters || {};
  const {
    index, p_key: pValue, s_key: sValue, latest, ...filter
  } = event.queryStringParameters;

  console.info(user);

  return [table, pValue, sValue, index, (latest === 'true'), filter];
}

function postArgs(event, user) {
  const { table } = event.pathParameters || {};
  const item = JSON.parse(event.body);

  console.info(user);

  return [table, item];
}

const methodMap = {
  GET: {
    method: getMethod,
    args: getArgs
  },
  POST: {
    method: postMethod,
    args: postArgs
  }
};

async function handler(event) {
  // After integration of auth user will be pulled from context
  const user = {
    id: '54ce2972-39a7-49d4-af07-6b014a3bddfe',
    user_name: 'Brian Ellingson',
    email: 'brian.ellingson@uah.edu'
  };
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  console.info(`[USER]\n${JSON.stringify(user)}`);
  const { method, args } = methodMap[event.httpMethod];
  const params = args(event, user);
  const [data, err] = await method(...params);
  if (err) {
    console.error(`[ERROR] ${err}`);
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ data, err })
  };
}

module.exports.handler = handler;
