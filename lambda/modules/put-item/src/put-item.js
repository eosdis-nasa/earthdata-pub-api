const aws = require('aws-sdk');
const Driver = require('database-driver').DynamodbDriver;
const dynamodb = new aws.DynamoDB.DocumentClient();
const driver = new Driver(dynamodb);

exports.handler = async (event, context) => {
  const { tableName: tableName } = event.pathParameters;
  const item = JSON.parse(event.body);

  console.info("[EVENT]\n" + JSON.stringify(event));

  let { data, statusCode, err } = await driver.putItem(tableName, item);

  if (err) {
    console.error("[ERROR] " + err);
  }

  return {
    statusCode: statusCode,
    body: JSON.stringify({data: data, err: err})
  }
}
