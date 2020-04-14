/** @module Schema */
const Ajv = require('ajv');

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
const ajv = new Ajv({schemas: [schema]});

/**
 * An object mapping table names to schema location
 * @private
 * @type {object}
 */
const tableMap = {
  "form": "#/Form",
  "question": "#/Question"
}

/**
 * An object mapping table names to foreign key paths
 * @private
 * @type {object}
 */
const refPaths = {
  "form": {
    "question": ["sections", "n", "questions", "n"]
  }
}


const getNested = ({item, path}) => {
  if (path.length > 1) {
    return getNested({ item: item[path.shift()], path})
  }
  else {
    return item[path[0]];
  }
}

/**
 * Enumerates foreign key paths where an item contains an array,
 * denoted in the reference path by "n". It operates recursively and uses
 * aftPath and forePath to track depth
 * @param {Item} item - An Item to be validated
 * @param {Array.<string|number>} aftPath - Visited, n is expanded to 0,1,2,etc
 * @param {string[]} forePath Not Visited, n is not expanded
 * @return {Array.<string|number>}
 */
const enumeratePaths = ({item, aftPath, forePath}) => {
  let paths = [];
  console.log(aftPath);
  let key = forePath.shift();
  if (key === "n") {
    if (forePath.length <= 0) {
      for (let i = 0; i < item.length; i++) {
        paths.push(aftPath.concat(i));
      }
    }
    else {
      for (let i = 0; i < item.length; i++) {
        let enumerated = enumeratePaths({item: item[i], aftPath: aftPath.concat(i), forePath: forePath.slice(0)});
        enumerated.forEach((path) => {
          paths.push(path);
        });
      }
    }
  }
  else {
    if (path.length > 1) {
      let enumerated = enumeratePaths({item: item[key], aftPath: aftPath.concat(key), forePath: forePath.slice(0)});
      enumerated.forEach((path) => {
        paths.push(path);
      });
    }
    else {
      paths.push(aftPath.concat(key));
    }
  }
  return paths;
}

/**
 * Validates an Item against the schema for a given table
 * @param {Item} item - An Item to be validated
 * @param {string} tableName - The table whose schema will be used for
 *   validation
 * @return {boolean} Whether or not the Item pass validation;
 */
module.exports.validate = function(tableName, item) {
  let validate = ajv.getSchema(tableMap[tableName]);
  let isValid = validate(item);
  if (!isValid) {
    console.log(validate.errors);
  }
  return isValid;
}

/**
 * Checks if a table exists within the schema tree and consequently if it
 * exists within the database.
 * @param {string} tableName - The table to check for
 * @return {boolean} Whether or not the table exists
 */
module.exports.isTable = function(tableName) {
  return tableMap.hasOwnProperty(tableName);
}

module.exports.collapseKeys = function(tableName, item) {
  let referencePaths = refPaths[tableName]["question"];
  console.log(getForeignKeyPaths(item, referencePaths));
}

module.exports.getForeignKeyPaths = function(item, path) {
  return enumeratePaths({item: item, aftPath: [], forePath: path.slice(0)})
}
