const db = require('database-util');

const templates = {
  direct_message: (e) => ({
    user_id: e.user_id,
    ...e.data
  }),
  request_initialized: (e) => ({
    text: `Request ID ${e.submission_id} has been initialized.`
  }),
  workflow_promote_step: (e) => ({
    text: `The request has completed step "${e.step_name}" and promoted to the next step in the workflow.`
  }),
  workflow_started: (e) => ({
    text: `The request has started on Workflow ID ${e.workflow_id}.`
  }),
  workflow_completed: (e) => ({
    text: `The request has completed Workflow ID ${e.workflow_id}.`
  }),
  form_request: (e) => ({
    text: `Progress for Workflow ID ${e.workflow_id} has halted pending submission of Form ID ${e.form_id}.`
  }),
  review_request: (e) => ({
    text: `Progress for Workflow ID ${e.workflow_id} has halted pending a review by DAAC staff.`
  }),
  form_submitted: (e) => ({
    text: `Form ID ${e.form_id} has been submitted and Workflow progress will resume.`
  }),
  review_approved: (e) => ({
    text: `Request ID ${e.submission_id} has passed review and Workflow progress will resume.`
  }),
  review_rejected: (e) => ({
    text: `Request ID ${e.submission_id} has not passed review and rolled back to step "${e.data.rollback}"`
  }),
  metadata_updated: (e) => ({
    text: `The Collection level metadata for Request ID ${e.submission_id} has been updated.`
  })
};

const getTemplate = async (message) => {
  if (message.event_type && templates[message.event_type]) {
    const template = templates[message.event_type](message);
    template.conversation_id = template.conversation_id || message.conversation_id;
    if(message.step_name && message.event_type !== 'request_initialized'){
      const stepMessage = await db.submission.getStepMessage({step_name:message.step_name})
      template.text = `${template.text}\n${stepMessage.notification}`
    }
    return template;
  }
  return false;
};

module.exports.getTemplate = getTemplate;
