const aws = require('aws-sdk');
const dynamodb = new aws.DynamoDB.DocumentClient();
const query = dynamodb.query.bind(dynamodb);

exports.handler = async (event, context) => {
  const { tableName } = event.pathParameters;
  const { id, unique_name, version } = event.queryStringParameters;

  let items = await getItems(tableName, id, unique_name, version);

  return {
    statusCode: 200,
    body: JSON.stringify(items)
  }
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

const getItems = async (tableName, id, unique_name, version) => {
  if (id) {
    return await getItemById(tableName, id, true);
  }
  else if (unique_name) {
    if (version) {
      return await getItemByNameAndVersion(tableName, unique_name, version, true);
    }
    else {
      return await getItemsByName(tableName, unique_name);
    }
  }
  else {
    return []
  }
}

const getItemById = async (tableName, hkey, expand) => {
  let params = {
    TableName: tableName,
    KeyConditionExpression: "id = :hkey",
    ExpressionAttributeValues: { ":hkey": hkey }
  }
  let response = await request(query, params);
  let item = response.Items[0];
  if (expand) {
    await expandKeys(item);
  }
  return item;
}

const getItemByNameAndVersion = async (tableName, hkey, rkey, expand) => {
  let params = {
    TableName: tableName,
    IndexName: `${tableName}_index`,
    KeyConditionExpression: 'unique_name = :hkey and version = :rkey',
    ExpressionAttributeValues: { ":hkey": hkey, ":rkey": rkey }
  }
  let response = await request(query, params);
  let item = response.Items[0];
  if (expand) {
    await expandKeys(item);
  }
  return response.Items;
}

const getItemsByName = async (tableName, hkey) => {
  let params = {
    TableName: tableName,
    IndexName: `${tableName}_index`,
    KeyConditionExpression: "unique_name = :hkey",
    ExpressionAttributeValues: { ":hkey": hkey }
  }
  let response = await request(query, params);
  return response.Items
}

const expandKeys = (item) => {
  let promises = [];
  for (let key of Object.keys(item)) {
    if (typeof item[key] == 'object') {
      if (item[key].hasOwnProperty("f_ref")) {
        const promise = new Promise((resolve) => {
          getItemById(item[key].f_ref, item[key].id)
            .then((nestedItem) => {
              item[key] = nestedItem;
              resolve();
          });
        });
        promises.push(promise);
      }
      else {
        promises.push(expandKeys(item[key]));
      }
    }
  }
  return Promise.all(promises);
}
