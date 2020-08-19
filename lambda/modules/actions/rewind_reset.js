/**
 * Rewinds a Submission to the first step of its Workflow, clearing all
 * previously entered form data and action output.
 * @memberof module:Actions
 * @async
 * @function
 * @name RewindReset
 * @param {object} submission - A submission entry on which to perform action
 * @return {object}
 */
async function execute(submission) {
  const output = {};
  const { workflow } = submission;
  const { entry } = workflow;
  submission.step = entry;
  Object.keys(submission.completed, (key) => {
    submission.completed[key] = false;
  });
  submission.form_data = {};
  submission.action_data = {};
  return output;
}

module.exports.execute = execute;
