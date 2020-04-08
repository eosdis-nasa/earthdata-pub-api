const aws = require('aws-sdk');
const Driver = require('database-driver').DynamodbDriver;
const dynamodb = new aws.DynamoDB.DocumentClient();
const driver = new Driver(dynamodb);

exports.handler = async (event, context) => {

  const { tableName } = event.pathParameters || {};
  const { id, uniqueName, version } = event.queryStringParameters || {};

  let { data, statusCode, err } = await
    driver.getItems(tableName, id, uniqueName, Number(version));

  return {
    statusCode: statusCode,
    body: JSON.stringify({data: data, err: err})
  }
}
