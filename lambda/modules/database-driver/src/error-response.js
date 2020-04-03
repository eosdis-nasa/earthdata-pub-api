/** @module ErrorResponse */

/** Generic error, an unhandled exception occured.
 *  @type {Response}
 */
module.exports.generic = {
  data: false,
  httpStatus: 500,
  err: "There was an unhandled exception."
}

/** Invalid Reference error, root item contains a reference to an id that
 *    doesn't exist.
*  @type {Response}
*/
module.exports.invalidReference = {
  data: false,
  httpStatus: 500,
  err: "Expanding foreign keys failed, possibly due to an invalid foreign key."
}

/** No Change error, inserted item matched previous existing item so changes
 *    no were performed.
*  @type {Response}
*/
module.exports.noChange = {
  data: false,
  httpStatus: 200,
  err: "The new item is equivalent to the previous version."
}

/** No Such Table error, the requested table does not exist in the database.
 *  @type {Response}
 */
module.exports.noSuchTable = {
  data: false,
  httpStatus: 404,
  err: "No such table exists"
}

/** Validation Failed error, item to insert does not pass schema validation.
 *  @type {Response}
 */
module.exports.validationFailed = {
  data: false,
  httpStatus: 200,
  err: "The new item did not pass schema validation."
}

/** Converts AWS Error to a {@link Response}
 *  @param {external:Error} error - AWS Error to convert
 *  @return {Response} The converted AWS Response Error
 */
module.exports.fromAwsError = function(error) {
  let response = { data: false };
  response.httpStatus = error.statusCode ? error.statusCode : 500;
  response.err = error.message ? error.message : "There was an unhandled error.";
  return response;
}
