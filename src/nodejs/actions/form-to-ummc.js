/**
 * Maps form data from submitted forms to UMMC structured metadata
 * @memberof module:Actions
 * @async
 * @function
 * @name FormToUMMC
 * @param {object} submission - A submission entry on which to perform action
 * @param {object} data - A structured object of additional input
 * @param {object} AWS - a reference to the AWS JavaScript SDK
 * @param {object} PgAdapter - a reference to the Postgress Adapter to retrieve and update data
 * @param {object} MessageDriver - a reference to the Message Driver for sending SNS events
 * @param {object} Schema - a reference to the Schema Utility for access to models
 * @return {object}
 */
async function execute({ submission, data, AWS, PgAdapter, MessageDriver, Schema }) {
  const output = {};
  const { form_data: formData } = submission;
  return output;
}
