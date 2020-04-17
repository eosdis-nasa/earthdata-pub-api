/**
 * Abstract base class for the driver. It is not intended to be
 * instantiated directly.
 * @abstract
 */
class BaseDriver {
  /**
   * Empty constructor for abstract super class.
   * @throws {TypeError}
   */
  constructor() {
    if (this.constructor === BaseDriver) {
      throw new TypeError('This is an abstract class not meant to be instantiated.');
    }
  }

  /**
   * Convenience method that routes a request to the appropriate get* method
   *   based on the passed in parameters.
   * @abstract
   * @param {string} tableName - Item type or table name
   * @param {string} [id] - Id of Item to retrieve
   * @param {string} [unique_name] - Unique Name of Item to retrieve
   * @param {string} [version] - Version of Item to retrieve
   * @param {bool} [expand = true] - Whether or not to expand foreign keys
   * @return {Promise<Response>} Promise that resolves to a {@link Response}
   */
  async getItems() {
    if (this.constructor === BaseDriver) {
      throw new TypeError('This is an abstract method.');
    }
  }

  /**
   * Gets a single Item from a given table by its id.
   * @abstract
   * @param {string} tableName - Item type or table name
   * @param {string} id - Id of Item to retrieve
   * @param {boolean} [expand = false] - Whether or not to expand foreign keys
   * @return {Promise<Response>} Promise that resolves to a {@link Response}
   */
  async getItemById() {
    if (this.constructor === BaseDriver) {
      throw new TypeError('This is an abstract method.');
    }
  }

  /**
   * Gets a single Item from a given table by its unique name and version.
   * @abstract
   * @param {string} tableName - Item type or table name
   * @param {string} uniqueName - Unique Name of Item to retrieve
   * @param {(string|number)} version - Version of Item to retrieve
   * @param {boolean} [expand = false] - Whether or not to expand foreign keys
   * @return {Promise<Response>} Promise that resolves to a {@link Response}
   */
  async getItemByNameAndVersion() {
    if (this.constructor === BaseDriver) {
      throw new TypeError('This is an abstract method.');
    }
  }

  /**
   * Gets a single Item from a given table by its unique name and version.
   * @abstract
   * @param {string} tableName - Item type or table name
   * @param {string} uniqueName - Unique Name of Item to retrieve
   * @param {boolean} [expand = false] - Whether or not to expand foreign keys
   * @return {Promise<Response>} Promise that resolves to a {@link Response}
   */
  async getItemLatestByName() {
    if (this.constructor === BaseDriver) {
      throw new TypeError('This is an abstract method.');
    }
  }

  /**
   * Gets all versions of an Item from a given table by its Unique Name.
   * @abstract
   * @param {string} tableName - Name of the DynamoDB table to query
   * @param {string} uniqueName - Unique Name of Item to retrieve
   * @return {Promise<Response>} Response object
   */
  async getItemsByName() {
    if (this.constructor === BaseDriver) {
      throw new TypeError('This is an abstract method.');
    }
  }

  /**
   * Inserts a new item to a given table.
   * @abstract
   * @param {string} tableName - Item type or table name
   * @param {Item} item - New item to put into table
   * @return {Promise<Response>} Promise that resolves to a {@link Response}
   */
  async putItem() {
    if (this.constructor === BaseDriver) {
      throw new TypeError('This is an abstract method.');
    }
  }
}

module.exports = BaseDriver;
