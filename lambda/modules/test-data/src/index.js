const data = {
  action: require('../examples/action_item.json'),
  daac: require('../examples/daac_item.json'),
  form: require('../examples/form_item.json'),
  question: require('../examples/question_item.json'),
  service: require('../examples/service_item.json'),
  user: require('../examples/user_item.json'),
  workflow: require('../examples/workflow_item.json')
}

const { DynamodbDriver } = require('database-driver');

const { DynamoDB } = require('aws-sdk');

const Schema = require('schema-util');

const config = {
  endpoint: 'http://localhost:4569',
  region: 'us-east-1',
  accessKeyId: "fake",
  secretAccessKey: "fake"
}

const dbDriver = new DynamodbDriver(
  new DynamoDB(config),
  DynamoDB.Converter.marshall,
  DynamoDB.Converter.unmarshall,
  process.env.TABLE_SUFFIX
);

async function populate(profile) {
  const tables = ['daac', 'service', 'action', 'question', 'form', 'user', 'workflow'];
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    const items = data[table];
    const hasRef = Schema.hasNestedObjects(table);
    for (let j = 0; j < items.length; j++) {
      const item = items[j];
      if (hasRef) {
        const refMap = Schema.getForeignObjects(table, item);
        console.log(JSON.stringify(refMap, null, 2))
        await dbDriver.refreshNestedObjects(refMap);
      }
      const response = await dbDriver.putItem(table, item);
      console.log(response);
    }
  }
}


module.exports.populate = populate;
module.exports.db = dbDriver;
