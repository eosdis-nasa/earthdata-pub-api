const BaseDriver = require("./base-driver.js");
const ErrorResponse = require("./error-response.js");

/**
 * A driver for interfacing with the AWS DynamoDB Document Client using
 *   Earthdata Pub's database schema.
 *   @implements {Driver}
 */
class DynamodbDriver extends BaseDriver {
  /**
   * Create a driver instance connected to a given AWS DynamoDB Document Client.
   * @param {external:DocumentClient} client - Instance of AWS DynamoDB Document
   *   Client.
   */
  constructor(client) {
    super();
    /**
     * Reference to a {@link DocumentClient}
     * @type {external:DocumentClient}
     */
    this.client = client;
    /** Reference to bound query method of client
     * @type {function}
     */
    this.query = this.client.query.bind(this.client);
    /** Reference to bound put method of client
     * @type {function}
     */
    this.put = this.client.put.bind(this.client);
  }

  /**
   * Initiates a request with the client. Wraps the operation in a promise to
   *   allow making subsequent operations without callback chains.
   * @param {function} operation - Should be one of external:DocumentClient.put
   *   or external:DocumentClient.query
   * @param {DynamoQueryParams} params - Query params for external:DocumentClient
   *   operation
   * @return {Promise<Response>} A promise that resolves to a Response object
   */
  request(operation, params) {
    console.info(`[DATABASE] Request payload\n${JSON.stringify(params)}`);
    var promise = new Promise((resolve) => {
      const callback = (err, data) => {
        if (err) {
          return resolve(ErrorResponse.fromAwsError(err));
        }
        else {
          if (data.Items) {
            console.info(`[DATABASE] ${data.Count} items fetched`);
            if (data.Count <= 0) {
              resolve(ErrorResponse.noResults);
            }
            resolve({ data: data.Items, statusCode: 200 });
          }
          else {
            resolve({ data: true, statusCode: 200 });
          }
        }
      }
      operation(params, callback);
    });
    return promise;
  }

  /**
   * Expands foreign keys in a query result by checking for the presence of
   *   foreighn key references denoted by the f_ref key. Modifies the given item
   *   in place and replaces the foreign key reference with an item retrieved
   *   from the database. To prevent referential loops this does not expand
   *   beyond the first level.
   * @param {Item} item - A single Item containing foreign reference keys
   * @return {Promise} A promise that resolves when each database query
   *   promise resolves.
   */
  expandKeys(item) {
    let err;
    let promises = [];
    for (let key of Object.keys(item)) {
      if (typeof item[key] == 'object') {
        if (item[key].hasOwnProperty("f_ref")) {
          const promise = new Promise((resolve, reject) => {
            this.getItemById(item[key].f_ref, item[key].id)
            .then((response) => {
              if (response.data) {
                item[key] = response.data;
                resolve();
              }
              else {
                reject(ErrorResponse.invalidReference);
              }
            });
          });
          promises.push(promise);
        }
        else {
          promises.push(this.expandKeys(item[key]));
        }
      }
    }
    return Promise.all(promises);
  }

  /**
   * Convenience method that routes a request to the appropriate get* method
   *   based on the passed in parameters.
   * @override
   * @param {string} tableName - Item type or table name
   * @param {string} [id] - Id of Item to retrieve
   * @param {string} [uniqueName] - Unique Name of Item to retrieve
   * @param {string} [version] - Version of Item to retrieve
   * @param {bool} [expand = true] - Whether or not to expand foreign keys
   * @return {Promise<Response>} Promise that resolves to a {@link Response}
   */
  async getItems(tableName, id, uniqueName, version, latest, expand = true) {
    console.info(`[DATABASE] Attempting to fetch from ${tableName}`)
    let response = false;
    if (!tableName) {
      response = ErrorResponse.tableParameterMissing;
    }
    else if (id || uniqueName) {
      if (id) {
        response = await this.getItemById(tableName, id, expand);
      }
      else if (uniqueName) {
        if (version) {
          response =  await this.getItemByNameAndVersion(tableName, uniqueName, version, expand);
        }
        else if (latest) {
          response = await this.getItemLatestByName(tableName, uniqueName, expand);
        }
        else {
          response = await this.getItemsByName(tableName, uniqueName);
        }
      }
    }
    else {
      response = ErrorResponse.invalidQuery;
    }
    if (!response) {
      response = ErrorResponse.generic;
    }
    return response;
  }

  /**
   * Gets a single Item from a given table by its id.
   * @override
   * @param {string} tableName - Item type or table name
   * @param {string} id - Id of Item to retrieve
   * @param {boolean} [expand = false] - Whether or not to expand foreign keys
   * @return {Promise<Response>} Promise that resolves to a {@link Response}
   */
  async getItemById(tableName, id, expand = false) {
    let response;
    let params = {
      TableName: tableName,
      KeyConditionExpression: `id = :id`,
      ExpressionAttributeValues: {":id": id}
    }
    response = await this.request(this.query, params);
    if (response.data) {
      response.data = response.data[0];
      if (expand) {
        await this.expandKeys(response.data)
        .catch(() => {
          response = ErrorResponse.invalidReference;
        });
      }
    }
    return response;
  }

  /**
   * Gets a single Item from a given table by its unique name and version.
   * @override
   * @param {string} tableName - Item type or table name
   * @param {string} uniqueName - Unique Name of Item to retrieve
   * @param {(string|number)} version - Version of Item to retrieve
   * @param {boolean} [expand = false] - Whether or not to expand foreign keys
   * @return {Promise<Response>} Promise that resolves to a {@link Response}
   */
  async getItemByNameAndVersion(tableName, uniqueName, version, expand = false) {
    let response;
    let params = {
      TableName: tableName,
      IndexName: `${tableName}_index`,
      KeyConditionExpression: `unique_name = :unique_name and version = :version`,
      ExpressionAttributeValues: {":unique_name": uniqueName, ":version": version}
    }
    response = await this.request(this.query, params);
    if (response.data) {
      response.data = response.data[0];
      if (expand) {
        await this.expandKeys(response.data)
        .catch(() => {
          response = ErrorResponse.invalidReference;
        });
      }
    }
    return response;
  }

  /**
   * Gets a single Item from a given table by its unique name and version.
   * @override
   * @param {string} tableName - Item type or table name
   * @param {string} uniqueName - Unique Name of Item to retrieve
   * @return {Promise<Response>} Promise that resolves to a {@link Response}
   */
  async getItemLatestByName(tableName, uniqueName, expand = false) {
    let response;
    let params = {
      TableName: tableName,
      IndexName: `${tableName}_index`,
      KeyConditionExpression: `unique_name = :unique_name`,
      ExpressionAttributeValues: {":unique_name": uniqueName}
    }
    response = await this.request(this.query, params);
    if (response.data) {
      response.data = response.data[response.data.length - 1];
      if (expand) {
        await this.expandKeys(response.data)
        .catch(() => {
          response = ErrorResponse.invalidReference;
        });
      }
    }
    return response;
  }

  /**
   * Gets all versions of an Item from a given table by its Unique Name.
   * @override
   * @param {string} tableName - Name of the DynamoDB table to query
   * @param {string} uniqueName - Unique Name of Item to retrieve
   * @return {Promise<Response>} Response object
   */
  async getItemsByName(tableName, uniqueName) {
    let response;
    let params = {
      TableName: tableName,
      IndexName: `${tableName}_index`,
      KeyConditionExpression: `unique_name = :unique_name`,
      ExpressionAttributeValues: {":unique_name": uniqueName}
    }
    response = await this.request(this.query, params);
    return response;
  }

  /**
   * Inserts a new item to a given table.
   * @override
   * @param {string} tableName - Item type or table name
   * @param {Item} item - New item to put into table
   * @return {Promise<Response>} Promise that resolves to a {@link Response}
   */
  async putItem(tableName, item) {
    console.info(`[DATABASE] Attempting to insert into ${tableName}`)
    let response;
    //Remove id, version. These are generated for new items and
    //should beignored for equality check
    delete item.id;
    delete item.version;
    const uuid = require('uuid');
    const deepEqual = require('deep-equal');
    response = await this.getItemsByName(tableName, item.unique_name);
    if (response.data) {
      let items = response.data;
      const count = items.length;
      const lastIndex = count - 1;
      const latest = count > 0 ? items[lastIndex] : { version: 0 };
      const newVersion = latest.version + 1;

      //Remove id, version before checking item equivalency
      delete latest.id;
      delete latest.version;

      if (!deepEqual(item, latest)) {
        item.id = uuid.v4();
        item.version = newVersion;
        const params = {
          Item: item,
          TableName: tableName
        }
        response = await this.request(this.put, params);
      }
      else {
        response = ErrorResponse.noChange;
      }
    }
    else {
      item.id = uuid.v4();
      item.version = 1;
      const params = {
        Item: item,
        TableName: tableName
      }
      response = await this.request(this.put, params);
    }
    if (response.data) {
      response.data = item;
      console.info(`[DATABASE] New item successfully inserted:\n${JSON.stringify(item)}`);
    }
    return response;
  }
}

module.exports = DynamodbDriver;
