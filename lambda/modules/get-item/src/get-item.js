const aws = require('aws-sdk');
const Driver = require('dynamodb-driver');
const dynamodb = new aws.DynamoDB.DocumentClient();
const driver = new Driver(dynamodb);

exports.handler = async (event, context) => {
  const { tableName: tableName } = event.pathParameters;
  const { id: id, uniqueName: uniqueName, version: version } = event.queryStringParameters;

  let { data, statusCode, err } = await driver.getItems(tableName, id, uniqueName, version);

  return {
    statusCode: 200,
    body: JSON.stringify({data: data, err: err})
  }
}
