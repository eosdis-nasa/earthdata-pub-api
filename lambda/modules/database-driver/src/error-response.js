/** @module ErrorResponse */

/** Generic error, an unhandled exception occured.
 *  @type {Response}
 */
module.exports.generic = {
  data: false,
  statusCode: 500,
  err: "There was an unhandled exception."
}

/** No Results error, the query was successful but produced no results.
 *  @type {Response}
 */
module.exports.noResults = {
  data: false,
  statusCode: 404,
  err: "The query was successful but produced no results."
}

/** Invalid Reference error, root item contains a reference to an id that
 *    doesn't exist.
*  @type {Response}
*/
module.exports.invalidReference = {
  data: false,
  statusCode: 500,
  err: "Expanding foreign keys failed, possibly due to an invalid foreign key."
}

/** No Change error, inserted item matched previous existing item so changes
 *    no were performed.
*  @type {Response}
*/
module.exports.noChange = {
  data: false,
  statusCode: 200,
  err: "The new item is equivalent to the previous version."
}

/** Table Paramater Missing error, the tableName path parameters is missing.
*  @type {Response}
*/
module.exports.tableParameterMissing = {
  data: false,
  statusCode: 500,
  err: "A table name was not specified in the URL path."
}

/** No Such Table error, the requested table does not exist in the database.
 *  @type {Response}
 */
module.exports.noSuchTable = {
  data: false,
  statusCode: 404,
  err: "No such table exists."
}

/** Invalid Query error, either id or uniqueName must be specified in query
 *    parameters.
*  @type {Response}
*/
module.exports.invalidQuery = {
  data: false,
  statusCode: 500,
  err: "Either id or uniqueName must be specified in the query parameters."
}

/** Validation Failed error, item to insert does not pass schema validation.
 *  @type {Response}
 */
module.exports.validationFailed = {
  data: false,
  statusCode: 200,
  err: "The new item did not pass schema validation."
}

/** Converts AWS Error to a {@link Response}
 *  @param {external:Error} error - AWS Error to convert
 *  @return {Response} The converted AWS Response Error
 */
module.exports.fromAwsError = function(error) {
  let response = { data: false };
  response.statusCode = error.statusCode ? error.statusCode : 500;
  response.err = error.message ? error.message : "There was an unhandled error.";
  return response;
}
