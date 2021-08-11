const templates = {
  direct_message: (e) => ({
    user_id: e.user_id,
    ...e.data
  }),
  request_initialized: (e) => ({
    text: `A new request has been initialized with ID ${e.submission_id}.`
  }),
  workflow_promote_step: (e) => ({
    text: `The request has completed step "${e.step_name}" and promoted to the next step in the workflow.`
  }),
  workflow_started: (e) => ({
    text: `The request has started on Workflow with ID ${e.workflow_id}.`
  }),
  workflow_completed: (e) => ({
    text: `The request has completed Workflow with ID ${e.workflow_id}.`
  }),
  form_request: (e) => ({
    text: `Workflow progress is pending submission of Form with ID ${e.form_id}.`
  }),
  review_request: (e) => ({
    text: `Workflow progress is pending a review by DAAC staff.`
  }),
  form_submitted: (e) => ({
    text: `Form with ID ${e.form_id} has been submitted.`
  }),
  metadata_updated: (e) => ({
    text: `The Collection level metadata has been updated.`
  })
};

const getTemplate = (message) => {
  if (message.event_type && templates[message.event_type]) {
    const template = templates[message.event_type](message);
    template.conversation_id = template.conversation_id || message.conversation_id;
    return template;
  }
  return false;
}

module.exports.getTemplate = getTemplate;
