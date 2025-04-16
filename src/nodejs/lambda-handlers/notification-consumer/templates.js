const db = require('database-util');

function parseStepName(step) {
  return step.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

const templates = {
  direct_message: (e) => ({
    user_id: e.user_id,
    ...e.data
  }),
  request_initialized: (e) => ({
    text: `Request ID ${e.submission_id} has been initialized.`
  }),
  action_request_no_id: (e) => ({
    text: `${parseStepName(e.data.rollback)} is complete, ${parseStepName(e.step_name)} is ready to be worked on. Please click on the green button on the far right of your request's row to work on this action, if applicable`
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
    text: `${parseStepName(e.data.rollback)} completed; now under DAAC review.`
  }),
  form_submitted: (e) => ({
    text: `Form ID ${e.form_id} has been submitted and Workflow progress will resume.`
  }),
  review_approved: (e) => ({
    text: `${parseStepName(e.data.rollback)} review completed; please click on the green button on the far right of your request’s row to complete the next action, if applicable.`
  }),
  review_rejected: (e) => ({
    text: e.next_step ? `Request ID ${e.submission_id} has not passed review and was set to step "${e.next_step}"` : `Request ID ${e.submission_id} has not passed review and rolled back to step "${e.data.rollback}"`
  }),
  metadata_updated: (e) => ({
    text: `The Collection level metadata for Request ID ${e.submission_id} has been updated.`
  }),
  review_required: (e) => ({
    text: `Your review is required for Request ID ${e.submission_id}`
  }),
  upload_step_completed: (e) => ({
    text: `${parseStepName(e.data.rollback)} is complete, ${parseStepName(e.step_name)} is ready to be worked on. Please click on the green button on the far right of your request's row to work on this action, if applicable`
  }),
  daac_assignment: (e) => ({
    text: `${parseStepName(e.step_name)} is complete for Request ID ${e.submission_id}. Publication Codes are: ${e.assigned_daacs.map((element) => `${element.daac_name}: ${element.code}`).join(', ')}`
  })
};

const getTemplate = async (message) => {
  if (message.event_type && templates[message.event_type]) {
    const template = templates[message.event_type](message);
    template.conversation_id = template.conversation_id || message.conversation_id;
    if (message.event_type !== 'request_initialized') {
      template.text = `${template.text}`;
      if (message.step_message) {
        template.text += `\n${message.step_message}`;
      }
    }
    return template;
  }
  return false;
};

const getEmailTemplate = async (eventMessage, message) => {
  let emailPayload = {};
  if (eventMessage.event_type !== 'direct_message') {
    const workflowName = db.workflow.getLongName({ id: eventMessage.workflow_id });
    const formData = (await db.submission.getFormData({ id: eventMessage.submission_id })).data;
    const daac = await db.submission.getSubmissionDaac({ id: eventMessage.submission_id });

    emailPayload = {
      submission_id: eventMessage.submission_id,
      workflow_name: (await workflowName).long_name,
      conversation_last_message: message.text,
      event_type: eventMessage.event_type,
      daac_name: daac.short_name,
      user_id: eventMessage.user_id,
      submitted_by_name: eventMessage.submitted_by_name
    };

    if (formData?.data_product_name_value) {
      emailPayload.submission_name = formData.data_product_name_value;
    } else { (emailPayload.submission_name = `Request Initialized by ${(await db.submission.getCreatorName({ id: eventMessage.submission_id })).name}`); }
  } else {
    emailPayload = {
      conversation_last_message: message.text,
      event_type: eventMessage.event_type,
      note_id: message.note_id,
      attachments: message.attachments
    };
  }

  return emailPayload;
};

module.exports.getTemplate = getTemplate;
module.exports.getEmailTemplate = getEmailTemplate;
