/**
 * Logs the input to the console.  This is meant to be a template for creating new
 * actions for the Action System to call. An action will need to be registered in the
 * database Action table to be available to the Action System. This serves as the main
 * entry point of the action that is invoked by the Action System. Internal methods
 * can be added to maintain readable code.
 * @memberof module:Actions
 * @async
 * @function
 * @name ConsoleLog
 * @param {object} submission - A submission entry on which to perform action
 * @param {object} input - Input passed by the Action System, should validate
 *   against a JSON schema stored in the Action entity in the database.
 * @return {object}
 */
async function execute(submission, input) {
  const output = {};
  console.info(submission);
  console.info(input);
  return output;
}

module.exports.execute = execute;
