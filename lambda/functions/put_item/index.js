const aws = require('aws-sdk');
const uuid = require('uuid');
const dynamodb = new aws.DynamoDB.DocumentClient();
const query = dynamodb.query.bind(dynamodb);
const put = dynamodb.put.bind(dynamodb);

exports.handler = async (event, context) => {

  // {
  //   "text": "Who is the primary person responsible for the collection or creation of this data product?",
  //   "help": "Often this is the Principle Investigator, Project Scientist, or Project Manager","name":"Primary Data Producer",
  //   "text_id":"producer",
  //   "inputs":["text","text","email"],
  //   "labels": ["Name","Organization","Email"],
  //   "required": true
  // }
  const { tableName } = event.pathParameters;
  const newItem = JSON.parse(event.body);

  const queryParams = {
    TableName: tableName,
    IndexName: `${tableName}_index`,
    KeyConditionExpression: 'text_id = :hkey',
    ExpressionAttributeValues: {':hkey': newItem.text_id }
  };

  let response = await request(query, queryParams);

  const items = response.Items;
  const count = response.Count;
  const lastIndex = count - 1;
  const latestVersion = count > 0 ? items[lastIndex].version : 0;

  if (count == 0 || itemsDiffer(newItem, items[lastIndex])) {
    newItem.id = uuid.v4();
    newItem.version = latestVersion + 1;
    const putParams = {
      Item: newItem,
      TableName: tableName
    }
    let response = await request(put, putParams);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}

const itemsDiffer = (newItem, oldItem) => {
  for (let [key, newValue] of Object.entries(newItem)) {
    let oldValue = oldItem[key];
    if (Array.isArray(newValue)) {
      for (let i = 0; i < newValue.length; i++) {
        if (newValue[i] !== oldValue[i]) {
          return true;
        }
      }
    }
    else if (newValue !== oldValue) {
      return true;
    }
  }
  return false;
}

const request = (operation, params) => {
  var promise = new Promise((resolve) => {
    const callback = (err, data) => {
      if (err) return resolve(err);
      else resolve(data);
    }
    operation(params, callback);
  });
  return promise;
}
