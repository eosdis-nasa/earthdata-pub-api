const aws = require('aws-sdk');
const Driver = require('dynamodb-driver')
const dynamodb = new aws.DynamoDB.DocumentClient();
const driver = new Driver(dynamodb);

exports.handler = async (event, context) => {
  const { table_name: tableName } = event.pathParameters;
  const { id: id, unique_name: uniqueName, version: version } = event.queryStringParameters;

  let { data, err } = await driver.getItems(tableName, id, uniqueName, version);

  return {
    statusCode: 200,
    body: JSON.stringify(items)
  }
}
