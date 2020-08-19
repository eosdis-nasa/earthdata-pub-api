const IndexKeys = require('./index-keys.js');

const ErrorMessage = require('./error-message.js');

/**
 * A driver for interfacing with the AWS DynamoDB Client using
 *   Earthdata Pub's database schema.
 */
class DynamodbDriver {
  /**
   * Create a driver instance connected to a given AWS DynamoDB Client.
   * The tableSuffix member is a string that indicates the environment.
   * i.e. '_dev' '_test'. Earthdata Pub appends this to the table names
   * to isolate working tables from operational tables.
   * It is recommended to use the following for the marshall and unmarshall
   * functions:
   * AWS.DynamoDB.Converter.marshall
   * AWS.DynamoDB.Converter.unmarshall
   * @param {object} client - AWS DynamoDB Client instance
   * @param {function} marshall - marshall to Dynamo format
   * @param {function} unmarshall - unmarshall from Dynamo format
   * @param {string} tableSuffix - suffix appended to table name for environment
   */
  constructor(client, marshall, unmarshall, tableSuffix = '') {
    this.indexKeys = IndexKeys;
    this.errors = ErrorMessage;
    this.marshall = marshall;
    this.unmarshall = unmarshall;
    this.env = tableSuffix;
    this.operations = {
      getItems: {
        method: client.query.bind(client),
        parse: (data) => data.Items.map(this.unmarshall)
      },
      putItem: {
        method: client.putItem.bind(client),
        parse: (data, params) => !!data ? this.unmarshall(params.Item) : false
      },
      updateItem: {
        method: client.updateItem.bind(client),
        parse: (data) => !!data
      },
      deleteItem: {
        method: client.deleteItem.bind(client),
        parse: (data) => !!data
      }
    };
  }

  /**
   * Gets items from a DynamoDB table.
   * @param {string} tableName - The table that contains the item
   * @param {string} pValue - Value of partition key
   * @param {string} [sValue] - Value of sort key
   * @param {string} [index='primary'] - Index to query
   * @param {boolean} [latest=false] - Reverse scan order
   * @return {Promise} A promise that resolves to the query result
   */
  getItems(tableName, pValue, sValue, index = 'primary', latest = false) {
    const invalid = this.isInvalid(tableName, index);
    if (invalid) {
      return [false, invalid];
    }
    const {
      pKey, pType, sKey, sType
    } = this.getKeys(tableName, index);
    const params = {
      TableName: `${tableName}${this.env}`,
      ...(index !== 'primary' ? { IndexName: index } : {}),
      KeyConditionExpression: `${pKey} = :${pKey}${sKey && sValue ? ` and ${sKey} = :${sKey}` : ''}`,
      ExpressionAttributeValues: {
        [`:${pKey}`]: { [pType]: pValue },
        ...(sKey && sValue ? { [`:${sKey}`]: { [sType]: sValue } } : {})
      },
      ScanIndexForward: !latest
    };
    return this.request('getItems', params);
  }

  /**
   * Inserts a new item or updates an existing item in a given table.
   * @param {string} tableName - Item type or table name
   * @param {Item} item - New item to put into table
   * @return {Promise} Promise that resolves when the put operation succeeds
   */
  putItem(tableName, item) {
    const invalid = this.isInvalid(tableName);
    if (invalid) {
      return [false, invalid];
    }
    console.info(`[DATABASE] Attempting to insert into ${tableName}`);
    const params = {
      Item: this.marshall(item),
      TableName: `${tableName}${this.env}`
    };
    return this.request('putItem', params);
  }

  /**
   * Delete items from a DynamoDB table.
   * @param {string} tableName - The table that contains the item
   * @param {string} pValue - Value of partition key
   * @param {string} sValue - Value of sort key
   * @return {Promise} A promise that resolves to the result
   */
  deleteItem(tableName, pValue, sValue) {
    const invalid = this.isInvalid(tableName);
    if (invalid) {
      return [false, invalid];
    }
    const {
      pKey, pType, sKey, sType
    } = this.getKeys(tableName);
    const params = {
      TableName: `${tableName}${this.env}`,
      Key: {
        [pKey]: { [pType]: pValue },
        ...(sKey && sValue ? { [sKey]: { [sType]: sValue } } : {})
      }
    };
    return this.request('deleteItem', params);
  }

  /**
   * Update specific attributes in an item in a DynamoDB table
   * @param {string} tableName - The table that contains the item
   * @param {string} pValue - Value of partition key
   * @param {string} sValue - Value of sort key
   * @param {Object} updates - A mapping of keys to update and new values
   * @return {Promise} A promise that resolves to the result
   */
  updateItem(tableName, pValue, sValue, updates) {
    const invalid = this.isInvalid(tableName);
    if (invalid) {
      return [false, invalid];
    }
    const {
      pKey, pType, sKey, sType
    } = this.getKeys(tableName);
    const params = {
      TableName: `${tableName}${this.env}`,
      Key: {
        [pKey]: { [pType]: pValue },
        ...(sKey && sValue ? { [sKey]: { [sType]: sValue } } : {})
      },
      ExpressionAttributeNames: Object.keys(updates)
        .reduce((names, key) => {
          names[`#${key}`] = key;
          return names;
        }, {}),
      ExpressionAttributeValues: this.marshall(Object.entries(updates)
        .reduce((values, [key, val]) => {
          values[`:${key}`] = val;
          return values;
        }, {})),
      UpdateExpression: `SET ${Object.keys(updates)
        .map((key) => `#${key} = :${key}`)
        .join(', ')}`
    };
    return this.request('updateItem', params);
  }

  /**
   * Replaces nested foreign references with fresh copies retrieved from
   *   the database. This prevents a nested foreign object from being
   *   updated accidently.
   * @params {module:Schema.ReferenceMap} refMap - Map of foreign
   *   references contained in an item
   * @return {Promise} A promise that resolves once all nested objects are
   *   refreshed
   */
  refreshNestedObjects(refMap) {
    return Promise.all(Object.entries(refMap)
      .map(([fTable, refs]) => {
        console.log(fTable);
        return Promise.all(refs.map(async ({ ref, key }) => {
          const refId = ref[key].id;
          const [[stored]] = await this.getItems(fTable, refId);
          ref[key] = stored;
        }));
      }));
  }

  /**
   * Verify that all of the foreign references exist.
   * @params {module:Schema.ReferenceMap} refMap - Map of foreign
   *   references contained in an item
   * @return {Promise} A promise that resolves to a boolean indicating if
   *   all referenced items exist
   */
  verifyReferences(refMap) {
    return new Promise(async (resolve) => {
      await Object.entries(refMap)
      .forEach(async ([fTable, refs]) => {
        await refs.forEach(async ({ ref, key }) => {
          const refId = ref[key];
          const [items] = await this.getItems(fTable, refId);
          if (items.length == 0) {
            resolve(false);
          }
        });
      });
      resolve(true);
    });
  }

  /**
   * Initiates a request with the client. Wraps the operation in a promise to
   *   allow making subsequent operations without callback chains.
   * @param {function} operation - Should be one of external:DocumentClient.put
   *   or external:DocumentClient.query
   * @param {object} params - Request params for DynamoDB operation
   * @return {Promise} A promise that resolves to operation result
   */
  request(operation, params) {
    const { method, parse } = this.operations[operation];
    console.info(`[DATABASE] Request payload: \n${JSON.stringify(params)}`);
    const promise = new Promise((resolve) => {
      const callback = (err, data) => {
        if (err) {
          return resolve([false, this.errors.fromAwsError(err)]);
        }
        return resolve([parse(data, params)]);
      };
      method(params, callback);
    });
    return promise;
  }

  /**
   * Get index information for a given index of a table.
   * @param {string} tableName - The table that contains the item
   * @param {string} index - Index to query, or null for primary index
   * @return {object} A mapping of key names and types
   */
  getKeys(tableName, index = 'primary') {
    return this.indexKeys[tableName][index];
  }

  /**
   * Check if tableName and index are invalid.
   * @param {string} tableName - The table that contains the item
   * @param {string} index - Index to query, or null for primary index
   * @return {boolean | string} A boolean of false indicating no error, or an
   *   error string.
   */
  isInvalid(tableName, index = 'primary') {
    let error = false;

    if (tableName) {
      if (this.indexKeys[tableName]) {
        if (this.indexKeys[tableName][index]) {
          // Do nothing
        } else {
          error = this.errors.noSuchIndex;
        }
      } else {
        error = this.errors.noSuchTable;
      }
    } else {
      error = this.errors.tableParameterMissing;
    }
    return error;
  }
}

module.exports = DynamodbDriver;
