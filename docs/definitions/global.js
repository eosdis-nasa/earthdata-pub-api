/**
* @typedef {object} Item
* @property {string} id - UUID of an Item
* @property {string} unique_name - Unique Name that describes the Item's
*   archetype, multiple versions can exist with the same Unique Name
* @property {string} version - Version of the Item
* @property {(string|object)} [additional] - Other Item properties specific to
*   that Item's type
*/

/**
* @typedef {object} Response
* @property {Item|Item[]} data Response data which is the queried Item(s)
*   or a reduced Item object containing the Id, Version, and Unique Name of the
*   newly inserted Item
* @property {number} httpStatus HTTP Status code
* @property {string} [err] Error message
*/

/**
 * @typedef {object} DynamoQueryParams
 * @property {string} TableName - DynamoDB table to query
 * @property {string} [IndexName] - Name of secondary index to query or null for
 *   primary index
 * @property {string} KeyConditionExpression - Expressions for query
 * @property {object} ExpressionAttributeValues - Mapping of values for query
 *   conditions
 */
