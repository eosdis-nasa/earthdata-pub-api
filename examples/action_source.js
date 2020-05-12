/** @module SampleAction */

/**
 * Logs the input to the console.  This is meant to be a template for creating new
 * actions for the Action System to call. An action will need to be registered in the database Action table to be
 * available to the Action System.This serves as the main entry point of the action that is invoked by the
 * Action System. Internal methods can be added to maintain readable code.
 * @param {object} input - Input passed by the Action System, should validate against a JSON schema stored in the
 * Action entity in the database.
 * @return {object}
 */
function execute(input) {
  const output = {};
  console.log(input);
  return output;
}

module.exports.execute = execute;
