const Validator = require('jsonschema').Validator;

const schema = {
  "form": {
    "id": "/form",
    "type": "object",
    "required": ["unique_name", "text", "sections"],
    "properties": {
      "id": {
        "type": "string",
        "pattern": "^[a-f|0-9]{8}-[a-f|0-9]{4}-4[a-f|0-9]{3}-[89ab][a-f|0-9]{3}-[a-f|0-9]{12}$"
      },
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
      "id": { "type": "string" },
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
    "foreign_key":  {
      "id": "/foreign_key",
      "type": "object",
      "required": ["id", "f_ref"],
      "properties": {
        "id": {"type": "string" },
        "f_ref": { "type": "string" }
      }
    }
  }
}

const v = new Validator();
v.addSchema(schema.form, "/form");
v.addSchema(schema.question, "/question");
v.addSchema(schema.definitions.foreign_key, "/foreign_key");


module.exports = {
  validate: (item, tableName) => {
    if (schema.hasOwnProperty(tableName) && tableName !== "definitions") {
      return v.validate(item, schema[tableName]);
    }
    else {
      return false;
    }
  },
  isTable: (tableName) => {
    return schema.hasOwnProperty(tableName) && tableName !== "definitions";
  }
}
