/**
 * AWS DynamoDB Document Client
 * @external DocumentClient
 * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html|AWS DynamodDB DocumentClient}
 */

/**
 * @typedef {Object} QueryParams
 * @property {string} TableName - DynamoDB table to query
 * @property {string} [IndexName] - Name of secondary index to query or null for
 *   primary index
 * @property {string} KeyConditionExpression - Expressions for query
 * @property {object} ExpressionAttributeValues - Mapping of values for query
 *   conditions
 */

 /**
  * @typedef {Object} Item
  * @property {string} id - UUID of item
  * @property {string} unique_name - Unique Name that describes the item's
  *   archetype, multiple versions can exist with the same Unique Name
  * @property {string} version - Version of the item
  * @property {(string|object)} [additional] - Other item properties specific to
  *   that item's type
  */

  /**
   * @typedef {Object} Response
   * @property {Item|Item[]|boolean} data
   * @property {string} [err]
   */

/**
 * A driver for interfacing with the AWS DynamoDB Document Client using
 *   Earthdata Pub's database schema.
 */
class Driver {
  /**
   * Create a driver instance connected to a given AWS DynamoDB Document Client.
   * @param {external:DocumentClient} client - Instance of AWS DynamoDB Document
   *   Client.
   */
  constructor(client) {
    this.client = client;
    this.query = this.client.query.bind(this.client);
    this.put = this.client.put.bind(this.client);
  }

  /**
   * Initiates a request with the client. Wraps the operation in a promise to
   *   allow making subsequent operations without callback chains.
   * @param {function} operation - Should be one of external:DocumentClient.put
   *   or external:DocumentClient.query
   * @param {QueryParams} params - Query params for external:DocumentClient
   *   operation
   * @return {Promise<Response>} A promise that resolves to a Response object
   */
  request(operation, params) {
    var promise = new Promise((resolve) => {
      const callback = (err, data) => {
        if (err) {
          return resolve({ data: false, err: err.message);
        }
        else {
          if (data.Items) {
            resolve({ data: data.Items, err: null);
          }
          else {
            resolve({ data: true, err: null);
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
   *   in place and replaces the foreign key reference with an entity retrieved
   *   from the database. To prevent referential loops this does not expand
   *   nested foreign keys.
   * @param {Object} item - A single entity from query results
   * @return {Promise} - A promise that resolves when each database query
   *   promise resolves.
   */
  expandKeys(item) {
    let err;
    let promises = [];
    for (let key of Object.keys(item)) {
      if (typeof item[key] == 'object') {
        if (item[key].hasOwnProperty("f_ref")) {
          const promise = new Promise((resolve) => {
            this.getItemById(item[key].f_ref, item[key].id)
            .then(({ data, err }) => {
              if (data) {
                item[key] = nestedItem;
                resolve();
              }
              else {
                reject();
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
   * Routes to the appropriate get* method based on the passed in parameters.
   * @param {string} tableName - Name of the DynamoDB table to query
   * @param {string} [id] - Id of entity to retrieve
   * @param {string} [unique_name] - Unique Name of entity
   * @param {string} [version] - Version of entity
   * @param {bool} [expand = true] - Whether or not to expand foreign keys
   * @return {Response} - The Response object bubbled up from the routed method
   *   or an empty error Response.
   *
   */
  async getItems(tableName, id, uniqueName, version, expand = true) {
    if (id) {
      return await this.getItemById(tableName, id, expand);
    }
    else if (uniqueName) {
      if (version) {
        return await this.getItemByNameAndVersion(tableName, uniqueName, version, expand);
      }
      else {
        return await this.getItemsByName(tableName, uniqueName);
      }
    }
    else {
      return { data: false, err: "There was an uncaught error."};
    }
  }

  /**
   * Gets a single Item from a given table by its id.
   * @param {string} tableName - Name of the DynamoDB table to query
   * @param {string} id - Id of Item to retrieve
   * @param {boolean} [expand = false] - Whether or not to expand foreign keys
   * @return {(Item|Error)} - A single Item or Error
   */
  async getItemById(tableName, id, expand = false) {
    let data;
    let items;
    let err;
    let params = {
      TableName: tableName,
      KeyConditionExpression: `id = ${id}`
    }
    { items, err } = await this.request(this.query, params);
    data = items[0];
    if (expand) {
      await this.expandKeys(data)
      .catch(() => {
        data = false;
        err = "Expanding foreign keys failed, possibly due to an invalid foreign key.";
      });
    }
    return { data: data, err: err };
  }

  /**
   * Gets a single Item from a given table by its unique name and version.
   * @param {string} tableName - Name of the DynamoDB table to query
   * @param {string} uniqueName - Unique name of Item to retrieve
   * @param {(string|number)} version - Version of Item to retrieve
   * @param {boolean} [expand = false] - Whether or not to expand foreign keys
   * @return {(Item|Error)} - A single Item or Error
   */
  async getItemByNameAndVersion(tableName, uniqueName, version, expand = false) {
    let data;
    let items;
    let err;
    let params = {
      TableName: tableName,
      IndexName: `${tableName}_index`,
      KeyConditionExpression: `unique_name = ${uniqueName} and version = ${version}`
    }
    { items, err } = await this.request(this.query, params);
    let data = items[0];
    if (expand) {
      await this.expandKeys(data)
      .catch(() => {
        data = false;
        err = "There was an error, possibly an invalid foreign key.";
      });
    }
    return { data: data, err: err };
  }

  /**
   * Gets all versions of an Item from a given table by its unique name
   * @param {string} tableName - Name of the DynamoDB table to query
   * @param {string} uniqueName - Unique name of Item to retrieve
   * @return {(Item[]|Error)} - Item[] or an Error
   */
  async getItemsByName(tableName, uniqueName) {
    let params = {
      TableName: tableName,
      IndexName: `${tableName}_index`,
      KeyConditionExpression: `unique_name = ${uniqueName}`
    }
    return await this.request(this.query, params);
  }

  /**
   * Puts a new item or new version of existing item into the given
   * table
   * @param {string} tableName - Name of the DynamoDB table to query
   * @param {Item} item - New item to put into table
   * @return {Response} - Response object where data is a boolean
   *   indicating success of operation and err is an error string
   *   or null
   */
  async putItem(tableName, item) {
    let data;
    let err;
    const uuid = require('uuid');
    const deepEqual = require('deep-equal');
    { data, err } = await this.getItemsByName(item.unique_name);
    if (data) {
      const count = data.length;
      const lastIndex = count - 1;
      const latest = count > 0 ? data[lastIndex] : { version: 0 };
      const newVersion = latest.version + 1;

      delete item.id;
      delete item.version;
      delete latest.id;
      delete latest.version;

      if (!deepEqual(item, latest)) {
        item.id = uuid.v4();
        item.version = newVersion;
        const params = {
          Item: item,
          TableName: tableName
        }
        { data, err } = await this.request(this.put, params);
      }
      else {
        err = "The new item is equivalent to previous version.";
      }
    }
    return { data: data, err: err };
  }
}

module.exports = Driver;
