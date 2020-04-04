/** @module Schema */
const Validator = require('jsonschema').Validator;

/**
 *  A tree structure of JSON schemas not intended for direct access.
 *  @private
 *  @type {object}
 */
const schema = require('./schema.json');

/**
 * A validator utility
 * @private
 * @type {external:Validator}
 */
const validator = new Validator();
validator.addSchema(schema.form, "/form");
validator.addSchema(schema.question, "/question");
validator.addSchema(schema.definitions.uuid, "/uuid");
validator.addSchema(schema.definitions.foreign_key, "/foreign_key");

/**
 * Validates an Item against the schema for a given table
 * @param {Item} item - An Item to be validated
 * @param {string} tableName - The table whose schema will be used for
 *   validation
 * @return {boolean} Whether or not the Item pass validation;
 */
module.exports.validate = function(item, tableName) {
  if (schema.hasOwnProperty(tableName) && tableName !== "definitions") {
    return validator.validate(item, schema[tableName]);
  }
  else {
    return false;
  }
}

/**
 * Checks if a table exists within the schema tree and consequently if it
 * exists within the database.
 * @param {string} tableName - The table to check for
 * @return {boolean} Whether or not the table exists
 */
module.exports.isTable = function(tableName) {
  return schema.hasOwnProperty(tableName) && tableName !== "definitions";
}
