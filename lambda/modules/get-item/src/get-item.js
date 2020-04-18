const AWS = require('aws-sdk');
const Driver = require('database-driver').DynamodbDriver;

const dynamodb = new AWS.DynamoDB.DocumentClient();
const driver = new Driver(dynamodb);

exports.handler = async (event, context) => {
  const { tableName } = event.pathParameters || {};
  const {
    id, uniqueName, version, latest
  } = event.queryStringParameters || {};

  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  console.info(`[USER]\n${JSON.stringify(context.identity)}`);

  const { data, statusCode, err } = await
  driver.getItems(tableName, id, uniqueName, Number(version), !!latest);

  if (err) {
    console.error(`[ERROR] ${err}`);
  }
  return {
    statusCode,
    body: JSON.stringify({ data, err })
  };
};

exports.getDriver = () => driver;
