/**
 * Rewinds a Submission to the first step of its Workflow, preserving previously
 * entered form data and action output. This is useful if only a small number
 * of fields need to be changed.
 * @memberof module:Actions
 * @async
 * @function
 * @name Rewind
 * @param {object} submission - A submission entry on which to perform action
 * @return {object}
 */
async function execute(submission) {
  const output = {};
  const { workflow } = submission;
  submission.step = workflow.entry;
  Object.keys(submission.completed, (key) => {
    submission.completed[key] = false;
  });
  return output;
}

module.exports.execute = execute;
