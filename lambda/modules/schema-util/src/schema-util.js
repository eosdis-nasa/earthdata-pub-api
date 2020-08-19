/**
 * Module that provides schema validation and utitilites for transformation
 *   and remapping of complex JS Objects.
 * @module Schema
 */

/**
 * A mapping of references to all nested foreign objects contained in a
 *   parent object.
 * @typedef {object.<string, Array.<ForeignObject>>} ReferenceMap
 */

/**
 * A container that holds the path to a foreign object from the root level of
 *   its root object, the key or index that points to the foreign object and
 *   a reference to the parent object that directly contains it.
 * @typedef {object} ForeignObject
 * @property {Array.<string|number>} path - An array of keys leading to a nested
 *   object contained within the root object
 * @property {(string|number)} key - A property or index of the nested object
 * @property {(object|Array)} ref - Reference to the object directly containing
 *   the foreign object
 */

/**
  * An array of strings that represent the path to a nested foreign object
  *   in a root object. Where an object contains an array the key is denoted as "n"
  *   which indicates that key should be enumerated.
  * @typedef {Array.<string>} NonEnumeratedPath
  */

/**
  * An array of strings or numbers that represent the path to a nested foreign
  *   object. Rather than "n" for arrays, it has been enumerated to the number of
  *   entries for that array.
  * @typedef {Array.<string|number>} EnumeratedPath
  */


const Ajv = require('ajv');

const crypto = require('crypto');

/**
 *  A tree structure of JSON schemas not intended for direct access.
 *  @private
 *  @type {object}
 */
const Models = require('./models.js');

/**
 * An object mapping table names to foreign object paths for expanding. This
 *   is used to ensure a referenced item contained within another matches the
 *   copy in its own table.
 * @private
 * @type {object}
 */
const TableMeta = require('./table-meta.js');

/**
 * An module with remapping methods for tables whose objects are remapped
 *   between client and persistent storage.
 * @private
 * @type {object}
 */
const Remap = require('./remap.js');

/**
 * A validator utility
 * @private
 * @type {external:Ajv}
 */
const ajv = new Ajv({ schemas: [Models] });

/**
* Generate a new random character. This function is used internally by
* the UUID generator function.
* @private
* @param {string} char - Single character to be replaced
* @return {string} A random replacement character
*/
function digit(char) {
  const randBytes = crypto.randomBytes(1)[0];
  // eslint-disable-next-line
  const value = char ^ (randBytes & (15 >> (char / 4)));
  const newChar = value.toString(16);
  return newChar;
}

/**
 * Generate a randomized (v4) UUID.
 * @return {string} A randomized (v4) UUID
 */
function generateId() {
  const base = '10000000-1000-4000-8000-100000000000';
  const uuid = base.replace(/[018]/g, digit);
  return uuid;
}
module.exports.generateId = generateId;

/**
 * Attaches a newly generated id to the passed object. Optionally, it will attach
 *   a version. The function both modifies the object by reference and returns the
 *   reference.
 * @param {object} item - A table item sans id and version
 * @param {boolean} [versioned=false] - Whether the object is a versioned item or not
 * @param {number} [previous=0] - Previous version for an existing versioned item
 * @return {object}
 */
function attachNewId(item, versioned = false, previous = 0) {
  item.id = generateId();
  if (versioned) {
    item.version = previous + 1;
  }
  return item;
}
module.exports.attachNewId = attachNewId;

/**
 * A wrapper function to alias deepStrictEqual and catch thrown assertion
 *   error and instead return a boolean for deep equality.
 * @param {object} itemA - Object to test
 * @param {object} itemB - Object to test againt
 * @return {boolean} Whether the two objects are deep equal or not
 */
function deepEqual(itemA, itemB) {
  try {
    assert.deepStrictEqual(itemA, itemB);
    return true;
  } catch (e) {
    return false;
  }
}
module.exports.deepEqual = deepEqual;

/**
 * A wrapper function to alias checking if an object has a specified key at its
 *   root level.
 * @param {object} obj - An object to check
 * @param {string} key - Key to check for
 * @return {boolean} Whether the object contains the key or not
 */
function hasKey(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
module.exports.hasKey = hasKey;

/**
 * Check if a table's objects should be remapped.
 * @param {string} tableName - The table to check
 * @return {boolean} Whether the objects should be remapped
 */
function shouldRemap(tableName) {
  const table = TableMeta[tableName];
  return table.remap;
}
module.exports.shouldRemap = shouldRemap;

/**
 * Check if a table's objects should be remapped.
 * @param {string} tableName - The table whose schema will be used for
 * @param {Item} item - The item to be remapped
 * @param {boolean} inbound - Whether the item is inbound or outbound
 * @return {boolean} Whether or not the Item pass validation;
 */
function remapItem(tableName, item, inbound = true) {
  return Remap[tableName][inbound ? 'in' : 'out'](item);
}
module.exports.remapItem = remapItem;

/**
 * Checks if a string is a valid numeric index i.e. zero or a positive integer
 * @param {string} value - A string to test
 * @return {boolean} Whether the value is numeric and non-floating point or not
 */
function isIndex(value) {
  return /\d+$/.test(value);
}

/**
 * Enumerates paths in a JSON document. Where an item contains an array, it is
 *   denoted in the reference path by 'n'. It operates recursively and uses
 *   aftPath and forePath to track depth
 * @param {object} ref - An object to pull nested foreign object references from
 * @param {EnumeratedPath} aft - Visited, n is expanded to 0,1,2,etc
 * @param {NonEnumeratedPath} fore - Not Visited, n is not expanded
 * @return {Array<ForeignObject>} An array of all foreign objects for the root
 *   object
 */
function enumeratePaths({ ref, aft, fore }) {
  const paths = [];
  const nextKey = fore.shift();
  if (nextKey === 'n' || nextKey === '*') {
    if (fore.length <= 0) {
      Object.entries(ref).forEach(([key, child]) => {
        paths.push({ path: aft.concat(key), key, ref });
      });
    } else {
      Object.entries(ref).forEach(([key, child]) => {
        paths.push(...enumeratePaths({
          ref: ref[key], aft: aft.concat(key), fore: fore.slice(0)
        }));
      });
    }
  } else if (hasKey(ref, nextKey)) {
    const key = nextKey;
    if (fore.length <= 0) {
      paths.push({ path: aft.concat(key), key, ref });
    } else {
      paths.push(...enumeratePaths({
        ref: ref[key], aft: aft.concat(key), fore: fore.slice(0)
      }));
    }
  }
  return paths;
}

/**
 * Validates an Item against the schema for a given table
 * @param {string} tableName - The table whose schema will be used for
 * @param {Item} item - An Item to be validated
 *   validation
 * @return {boolean} Whether or not the Item pass validation;
 */
function validate(tableName, item) {
  const table = TableMeta[tableName];
  const evaluate = ajv.getSchema(table.schema);
  const isValid = evaluate(item);
  if (!isValid) {
    console.info(`[ERROR] Validation errors: \n${validate.errors}`);
  }
  return isValid;
}
module.exports.validate = validate;

/**
 * Checks if a table has nested foreign objects.
 * @param {string} tableName - The table to check for
 * @return {boolean} Whether or not the table items contain foreign references
 */
function hasNestedObjects(tableName) {
  const table = TableMeta[tableName];
  if (hasKey(table, 'foreign')) {
    const foreign = table.foreign;
    return hasKey(foreign, 'nested');
  };
  return false;
}
module.exports.hasNestedObjects = hasNestedObjects;

/**
 * Checks if a table has id references to foreign objects.
 * @param {string} tableName - The table to check for
 * @return {boolean} Whether or not the table items contain foreign references
 */
function hasReference(tableName) {
  const table = TableMeta[tableName];
  if (hasKey(table, 'foreign')) {
    const foreign = table.foreign;
    return hasKey(foreign, 'ref');
  };
  return false;
}
module.exports.hasReference = hasReference;

/**
 * Checks if a table contains versioned items.
 * @param {string} tableName - The table to check for
 * @return {(string|boolean)} The versioning index of the table or false if none
 */
function isVersioned(tableName) {
  const table = TableMeta[tableName];
  if (hasKey(table, 'versioned')) {
    return table.versioned;
  }
  return false;
}
module.exports.isVersioned = isVersioned;

/**
 * Gets a mapping of modifiable references to foreign objects in an item.
 *   This method can retrieve either nested objects or references where only
 *   the foreign id is saved.
 * @param {string} tableName - The table to which the item belongs
 * @param {object} item - An in item for which to get foreign references
 * @param {boolean} nested - Get nested objects otherwise get foreign references
 * @return {ReferenceMap} Foreign reference paths
 */
function getForeignObjects(tableName, item, nested = true) {
  const foreignType = nested ? 'nested' : 'ref';
  const paths = {};
  const table = TableMeta[tableName];
  const foreign = table.foreign
  Object.entries(foreign[foreignType]).forEach(([foreignTable, path]) => {
    paths[foreignTable] = enumeratePaths({
      ref: item, aft: [], fore: path.slice(0)
    });
  });
  return paths;
}
module.exports.getForeignObjects = getForeignObjects;

/**
 * Sets a nested value within an object at a given path. The original item is
 *   modified.
 * @example
 * let item = {'key1': {'key2': {'key3': 0}}};
 * let path = ['key1', 'key2', 'key3'];
 * setNested(item, path, 1);
 * // item now {'key1': {'key2': {'key3': 1}}}
 * @param {object} item - An Item with nested values
 * @param {EnumeratedPath} path - An array of successive keys within the
 *   Item
 * @param {(object|string|number)} value - A value to set at the given path
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
 *   the database only supports key-values rather than complex nested structures.
 *   where:
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
        if (!hasKey(temp, key)) {
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
