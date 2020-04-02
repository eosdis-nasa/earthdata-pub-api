const aws = require('aws-sdk');
const Driver = require('dynamodb-driver')
const dynamodb = new aws.DynamoDB.DocumentClient();
const driver = new Driver(dynamodb);

exports.handler = async (event, context) => {

  const { table_name: tableName } = event.pathParameters;
  const newItem = JSON.parse(event.body);

  let { data, err } = await driver.putItems(tableName, item);

  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}
