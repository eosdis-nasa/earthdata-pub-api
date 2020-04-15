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

module.exports.getForeignKeyPaths = function(tableName, item) {
  let paths = {};
  for(let [table, path] of Object.entries(refPaths[tableName])) {
    paths[table] = enumeratePaths({item: item, aftPath: [], forePath: path.slice(0)});
  }
  console.log(paths);
  return paths;
}

function toFlat(item, flatItem = {}, aftPath = []) {
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

function fromFlat(item, nestedItem = {}) {
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
