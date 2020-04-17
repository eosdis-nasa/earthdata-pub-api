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
const ajv = new Ajv({ schemas: [schema] });

/**
 * An object mapping table names to schema location
 * @private
 * @type {object}
 */
const tableMap = {
  form: '#/Form',
  question: '#/Question'
};

/**
 * An object mapping table names to foreign key paths
 * @private
 * @type {object}
 */
const refPaths = {
  form: {
    question: ['sections', 'n', 'questions', 'n']
  }
};

/**
 * Enumerates foreign key paths where an item contains an array,
 *   denoted in the reference path by 'n'. It operates recursively and uses
 *   aftPath and forePath to track depth
 * @param {Item} item - An Item to be validated
 * @param {Array.<string|number>} aftPath - Visited, n is expanded to 0,1,2,etc
 * @param {string[]} forePath Not Visited, n is not expanded
 * @return {Array.<string|number>}
 */
const enumeratePaths = ({ item, aftPath, forePath }) => {
  const paths = [];
  const key = forePath.shift();
  if (key === 'n') {
    if (forePath.length <= 0) {
      item.forEach((child, i) => {
        paths.push({ path: aftPath.concat(i), lastIndex: i, value: item });
      });
    } else {
      item.forEach((child, i) => {
        const enumerated = enumeratePaths(
          { item: item[i], aftPath: aftPath.concat(i), forePath: forePath.slice(0) }
        );
        enumerated.forEach((path) => {
          paths.push(path);
        });
      });
    }
  } else if (forePath.length <= 0) {
    paths.push({ path: aftPath.concat(key), lastIndex: key, value: item });
  } else {
    const enumerated = enumeratePaths(
      { item: item[key], aftPath: aftPath.concat(key), forePath: forePath.slice(0) }
    );
    enumerated.forEach((path) => {
      paths.push(path);
    });
  }
  return paths;
};

/**
 * Checks if a string is a valid numeric index i.e. zero or a positive integer
 * @param {string} value - A string to test
 * @return {boolean} Whether the value is numeric and non-floating point or not
 */
const isIndex = (value) => /\d+$/.test(value);

/**
 * Validates an Item against the schema for a given table
 * @param {Item} item - An Item to be validated
 * @param {string} tableName - The table whose schema will be used for
 *   validation
 * @return {boolean} Whether or not the Item pass validation;
 */
function validate(tableName, item) {
  const evaluate = ajv.getSchema(tableMap[tableName]);
  const isValid = evaluate(item);
  if (!isValid) {
    console.info(`[ERROR] Validation errors: \n${validate.errors}`);
  }
  return isValid;
}
module.exports.validate = validate;

/**
 * Checks if a table exists within the schema tree and consequently if it
 * exists within the database.
 * @param {string} tableName - The table to check for
 * @return {boolean} Whether or not the table exists
 */
function isTable(tableName) {
  return Object.prototype.hasOwnProperty.call(tableMap, tableName);
}
module.exports.isTable = isTable;

/**
 * Checks if a table has foreign references.
 * @param {string} tableName - The table to check for
 * @return {boolean} Whether or not the table items contain foreign references
 */
function hasForeignReferences(tableName) {
  return Object.prototype.hasOwnProperty.call(refPaths, tableName);
}
module.exports.hasForeignReferences = hasForeignReferences;

/**
 * Gets an array of paths of foreign references in an item.
 * @example
 * {'<foreign_table>: [['key1', 'key2']]}
 * is returned for an object where
 * {'key1': {'key2': {'id': 'xx', 'f_ref': '<foreign_table>'}}}
 * For a form type with 2 sections each with a single question it returns:
 * {'question': [['sections', '0', 'questions', '0'], ['sections', '1', 'questions', '0']]}
 * @param {string} tableName - The table to which the item belongs
 * @param {Item} item - An in item for which to get foreign reference paths
 * @return {object} Foreign reference paths
 */
function getForeignKeys(tableName, item) {
  const paths = {};
  Object.entries(refPaths[tableName]).forEach(([table, path]) => {
    paths[table] = enumeratePaths({ item, aftPath: [], forePath: path.slice(0) });
  });
  return paths;
}
module.exports.getForeignKeys = getForeignKeys;

/**
 * Sets a nested value within an object at a given path. The original item is
 *   modified.
 * @example
 * let item = {'key1': {'key2': {'key3': 0}}};
 * let path = ['key1', 'key2', 'key3'];
 * setNested(item, path, 1);
 * // item now {'key1': {'key2': {'key3': 1}}}
 * @param {Item} item - An Item with nested values
 * @param {Array.<string|number>} path - An array of successive keys within the
 *   Item
 * @param {(object|string|number)} A value to set at the given path
 * @return {object} Modified item
 */
function setNested(item, path, value) {
  if (path.length > 1) {
    return this.setNested(item[path.shift()], path);
  }

  item[path[0]] = value;
  return item;
}
module.exports.setNested = setNested;

/**
 * Converts a nested JSON object into a flat key-value map. This is used when
 * the database only supports key-values rather than complex nested structures.
 * where:
 * @example
 * toFlat({'keyA': {'key1': 1}, 'keyB': 2})
 * //returns {'keyA#key1': 1, 'keyB': 2}
 * @param {object} item - Nested object to be flattened
 * @param {object} [flatItem] - Object into which results will be stored, this
 *   is not necessary when calling the method but is used in recursive calls
 * @param {string[]} [afPath] - Array to track traversed paths, should not be
 *   passed when calling this method as it is used internally for recursive calls
 * @return {object} Flattened object
 */
function toFlat(item, flatItem = {}, aftPath = []) {
  Object.keys(item).forEach((key) => {
    if (typeof item[key] === 'object') {
      this.toFlat(item[key], flatItem, aftPath.concat(key));
    } else {
      flatItem[aftPath.concat(key).join('#')] = item[key];
    }
  });
  return flatItem;
}
module.exports.toFlat = toFlat;

/**
 * Converts a flattened JSON object into a nested object where:
 * @example
 * fromFlat({'keyA#key1': 1, 'keyB': 2})
 * //returns {'keyA': {'key1': 1}, 'keyB': 2}
 * @param {object} item - Flattened object to be transformed into nested object
 * @param {object} [nestedItem] - Object into which results will be stored
 * @return {object} Nested object after transformation
 */
function fromFlat(item, nestedItem = {}) {
  Object.entries(item).forEach(([joinedKeys, value]) => {
    const path = joinedKeys.split('#');
    let temp = nestedItem;
    Object.entries(path).forEach(([pathIndex, key]) => {
      const idx = Number(pathIndex);
      if (idx === path.length - 1) {
        temp[key] = value;
      } else {
        const nextKey = path[idx + 1];
        if (!Object.prototype.hasOwnProperty.call(temp, key)) {
          if (isIndex(nextKey)) {
            temp[key] = [];
          } else {
            temp[key] = {};
          }
        }
      }
      temp = temp[key];
    });
  });
  return nestedItem;
}
module.exports.fromFlat = fromFlat;
