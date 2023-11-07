/** @module ErrorMessage */

/** Generic error, an unhandled exception occured.
 *  @type {string}
 */
module.exports.generic = 'There was an unhandled exception.';

/** No Results error, the query was successful but produced no results.
 *  @type {string}
 */
module.exports.noResults = 'The query was successful but produced no results.';
/** No Change error, inserted item matched previous existing item so changes
 *    no were performed.
*  @type {string}
*/
module.exports.noChange = 'The new item is equivalent to the previous version.';

/** Not Latest error, a previous version of an item was attempted to be updated.
*  @type {string}
*/
module.exports.notLatest = 'An update was attempted on an outdated version.';

/** Table Paramater Missing error, the tableName path parameters is missing.
*  @type {string}
*/
module.exports.tableParameterMissing = 'A table name was not specified in the URL path.';

/** No Such Table error, the requested table does not exist in the database.
 *  @type {string}
 */
module.exports.noSuchTable = 'No such table exists.';

/** No Such Table error, the requested table does not exist in the database.
 *  @type {string}
 */
module.exports.notAllowed = 'Access to that table is not allowed from this endpoint.';

/** No Such Index error, the request index doesn't exist for the table.
*  @type {string}
*/
module.exports.noSuchIndex = 'No such index exists for that table.';

/** No Sort Key error, the specified index does not have a sort key
 * @type {string}
 */
module.exports.noSortKey = 'The specified index does not have a sort key.';

/** Validation Failed error, item to insert does not pass schema validation.
 *  @type {string}
 */
module.exports.validationFailed = 'The new item did not pass schema validation.';

/** Generate error message for Invalid Foreign Reference.
*  @param {string} table - Table the reference belongs to
*  @param {string} id - Unique id of the invalid reference
*  @type {string}
*/
function invalidReference(table, id) {
  return `The foreign reference ${id} does not exist in ${table} table.`;
}
module.exports.invalidReference = invalidReference;

/** Pull error message from an AWS Response
 *  @param {object} error - AWS Error from which to pull error message
 *  @return {string} Resulting error message
 */
function fromAwsError(error) {
  return error.message ? error.message : 'There was an unhandled error.';
}
module.exports.fromAwsError = fromAwsError;
