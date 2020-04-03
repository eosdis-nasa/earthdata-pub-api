/** @module Schema */
const Validator = require('jsonschema').Validator;

/**
 *  A tree structure of JSON schemas not intended for direct access.
 *  @private
 *  @type {object}
 */
const schema = {
  "form": {
    "id": "/form",
    "type": "object",
    "required": ["unique_name", "text", "sections"],
    "properties": {
      "id": { "$ref": "/uuid" },
      "version": { "type": "number" },
      "unique_name": { "type": "string" },
      "text":  { "type": "string" },
      "sections": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "heading": { "type": "string" },
            "questions": {
              "type": "array",
              "items":  {
                "oneOf": [
                  { "$ref": "/foreign_key" },
                  { "$ref": "/question" }
                ]
              }
            }
          }
        }
      }
    }
  },
  "question": {
    "id": "/question",
    "required": ["unique_name", "title", "text", "help", "inputs"],
    "type": "object",
    "properties": {
      "id": { "$ref": "/uuid" },
      "version": { "type": "number" },
      "unique_name": { "type": "string" },
      "title": { "type": "string" },
      "text": { "type": "string" },
      "help": { "type": "string" },
      "inputs": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "type": { "type": "string" },
            "id": { "type": "string" },
            "label": { "type": "string" },
            "validation_error_msg": { "type": "string" },
            "validator": {
              "oneOf": [
                {
                  "type": "array",
                  "items": { "type": "string" }
                },
                { "type": "string" }
              ]
            },
            "required": { "type": "boolean" },
            "attributes": { "type": "object" }
          }
        }
      }
    }
  },
  "definitions": {
    "uuid": {
      "id": "/uuid",
      "type": "string",
      "pattern": "^[a-f|0-9]{8}-[a-f|0-9]{4}-4[a-f|0-9]{3}-[89ab][a-f|0-9]{3}-[a-f|0-9]{12}$"
    },
    "foreign_key":  {
      "id": "/foreign_key",
      "type": "object",
      "required": ["id", "f_ref"],
      "properties": {
        "id": { "$ref": "/uuid" },
        "f_ref": { "type": "string" }
      }
    }
  }
}

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
