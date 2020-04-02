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
   * @return {Promise<Item|Error>} A promise that returns the requested Item if
   *   resolved or Error if rejected
   */
  request(operation, params) {
    var promise = new Promise((resolve) => {
      const callback = (err, data) => {
        if (err) return resolve(err);
        else resolve(data.Items);
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
    let promises = [];
    for (let key of Object.keys(item)) {
      if (typeof item[key] == 'object') {
        if (item[key].hasOwnProperty("f_ref")) {
          const promise = new Promise((resolve) => {
            this.getItemById(item[key].f_ref, item[key].id)
              .then((nestedItem) => {
                item[key] = nestedItem;
                resolve();
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
   * @return {(Item|Item[])} - A single Item or Item[] of zero or more
   *   entities
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
      return [];
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
    let params = {
      TableName: tableName,
      KeyConditionExpression: `id = ${id}`
    }
    let items = await this.request(this.query, params);
    let item = items[0];
    if (expand) {
      await this.expandKeys(item);
    }
    return item;
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
    let params = {
      TableName: tableName,
      IndexName: `${tableName}_index`,
      KeyConditionExpression: `unique_name = ${uniqueName} and version = ${version}`
    }
    let items = await this.request(this.query, params);
    let item = items[0];
    if (expand) {
      await this.expandKeys(item);
    }
    return item;
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
    let items = await this.request(this.query, params);
    return items;
  }
}

module.exports = Driver;
