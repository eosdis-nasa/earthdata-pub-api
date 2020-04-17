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
 * @type {external:Ajv}
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

/**
 * Gets a value from a complex object with nested values using a path in the
 *  form of
 *  ["key1", "key2", "key3"]
 *  for an object
 *  {"key1": {"key2": {"key3": <value>}}}
 * @param {Item} item - An Item with nested values
 * @param {Array.<string|number>} path - An array of successive keys within the
 *   Item
 * @return {object} Value located in the given path
 */
const getNested = (item, path) => {
  if (path.length > 1) {
    return getNested(item[path.shift()], path)
  }
  else {
    return item[path[0]];
  }
}

/**
 * Enumerates foreign key paths where an item contains an array,
 *   denoted in the reference path by "n". It operates recursively and uses
 *   aftPath and forePath to track depth
 * @param {Item} item - An Item to be validated
 * @param {Array.<string|number>} aftPath - Visited, n is expanded to 0,1,2,etc
 * @param {string[]} forePath Not Visited, n is not expanded
 * @return {Array.<string|number>}
 */
const enumeratePaths = ({item, aftPath, forePath}) => {
  console.log({item, aftPath, forePath})
  let paths = [];
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
    if (forePath.length <= 0) {
      paths.push(aftPath.concat(key));
    }
    else {
      let enumerated = enumeratePaths({item: item[key], aftPath: aftPath.concat(key), forePath: forePath.slice(0)});
      enumerated.forEach((path) => {
        paths.push(path);
      });
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

/**
 * Checks if a table has foreign references.
 * @param {string} tableName - The table to check for
 * @return {boolean} Whether or not the table items contain foreign references
 */
module.exports.hasForeignReferences = function(tableName) {
  return refPaths.hasOwnProperty(tableName);
}

/**
 * Gets an array of paths of foreign references in an item.
 * @example
 * {"<foreign_table>: [["key1", "key2"]]}
 * is returned for an object where
 * {"key1": {"key2": {"id": "xx", "f_ref": "<foreign_table>"}}}
 * For a form type with 2 sections each with a single question it returns:
 * {"question": [["sections", "0", "questions", "0"], ["sections", "1", "questions", "0"]]}
 * @param {string} tableName - The table to which the item belongs
 * @param {Item} item - An in item for which to get foreign reference paths
 * @return {object} Foreign reference paths
 */
module.exports.getForeignKeyPaths = function(tableName, item) {
  let paths = {};
  for(let [table, path] of Object.entries(refPaths[tableName])) {
    paths[table] = enumeratePaths({item: item, aftPath: [], forePath: path.slice(0)});
  }
  console.log(paths);
  return paths;
}

/**
 * Converts a nested JSON object into a flat key-value map. This is used when
 * the database only supports key-values rather than complex nested structures.
 * where:
 * @example
 * toFlat({"keyA": {"key1": 1}, "keyB": 2})
 * //returns {"keyA#key1": 1, "keyB": 2}
 * @param {object} item - Nested object to be flattened
 * @param {object} [flatItem] - Object into which results will be stored, this
 *   is not necessary when calling the method but is used in recursive calls
 * @param {string[]} [afPath] - Array to track traversed paths, should not be
 *   passed when calling this method as it is used internally for recursive calls
 * @return {object} Flattened object
 */
module.exports.toFlat = function(item, flatItem = {}, aftPath = []) {
  for(let [key, value] of Object.entries(item)) {
    if (typeof item[key] === 'object') {
      toFlat(item[key], flatItem, aftPath.concat(key));
    }
    else {
      flatItem[aftPath.concat(key).join("#")] = item[key]
    }
  }
  return flatItem;
}

/**
 * Converts a flattened JSON object into a nested object where:
 * @example
 * fromFlat({"keyA#key1": 1, "keyB": 2})
 * //returns {"keyA": {"key1": 1}, "keyB": 2}
 * @param {object} item - Flattened object to be transformed into nested object
 * @param {object} [nestedItem] - Object into which results will be stored
 * @return {object} Nested object after transformation
 */
module.exports.fromFlat = function(item, nestedItem = {}) {
  for(let [joinedKeys, value] of Object.entries(item)) {
    let path = joinedKeys.split("#");
    temp = nestedItem;
    for (let [idx, key] of Object.entries(path)) {
      idx = Number(idx);
      if (idx == path.length - 1) {
        temp[key] = value;
      }
      else {
        let nextKey = path[idx + 1];
        if (!temp[key]) {
          console.log(key, !isNaN(nextKey), nextKey)
          if (!isNaN(nextKey)) {
            console.log("array")
            temp[key] = [];
          }
          else {
            temp[key] = {};
          }
        }
      }
      temp = temp[key];
    }
  }
  return nestedItem;
}
