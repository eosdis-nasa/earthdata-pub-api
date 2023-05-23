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

const getEmailTemplate = async (eventMessage, message) => {
  console.log(message)
  let emailPayload = {}
  if(eventMessage.event_type !== "direct_message"){

    const workflow_name = db.workflow.getLongName({id: eventMessage.workflow_id})
    const formData = await db.submission.getFormData({id: eventMessage.submission_id})

    emailPayload = {
      name : "EDPUB User", 
      submission_id: eventMessage.submission_id,
      workflow_name: (await workflow_name).long_name,
      conversation_last_message: message.text
    }

    if(formData.data_product_name_value){
      emailPayload['submission_name'] = formData.data_product_name_value
    }else(emailPayload['submission_name'] = 
      `Request Initialized by ${(await db.submission.getCreatorName({id: eventMessage.submission_id})).name}`)

  }

  if(eventMessage.event_type !== "form_submitted"
    && eventMessage.event_type !== "review_approved"){
    emailPayload['step_name'] = eventMessage.step_name
  }else{
    emailPayload['step_name'] = (await db.submission.getStepName({id: eventMessage.submission_id})).step_name
  }

  return emailPayload

}

module.exports.getTemplate = getTemplate;
module.exports.getEmailTemplate = getEmailTemplate;
