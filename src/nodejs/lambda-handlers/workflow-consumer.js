/**
 * Lambda that serves as the core component of the Workflow System. This lambda
 * processes incoming SNS messages, progresses the specified Submission to the
 * next step in its Workflow, and sends an SNS notification, and if needed an
 * SQS message to invoke an Action.
 * an SNS message to notify of successful completion.
 * @module WorkflowHandler
 * @see module:ActionHandler
 */

const db = require('database-util');

const msg = require('message-util');

async function actionMethod(status) {
  const eventMessage = {
    event_type: status.step.action_id ? 'action_request' : 'action_request_no_id',
    action_id: status.step.action_id,
    submission_id: status.id,
    conversation_id: status.conversation_id,
    workflow_id: status.workflow_id,
    step_name: status.step.name,
    data: status.step.data
  };
  Object.keys(eventMessage).forEach((key) => (
    eventMessage[key] === undefined && delete eventMessage[key]));
  await msg.sendEvent(eventMessage);
  status.step.action_id && await msg.sendEvent({
      event_type: 'workflow_promote_step',
      submission_id: status.id
    });
}

async function formMethod(status) {
  const eventMessage = {
    event_type: 'form_request',
    form_id: status.step.form_id,
    submission_id: status.id,
    conversation_id: status.conversation_id,
    workflow_id: status.workflow_id,
    step_name: status.step.name,
    data: status.step.data
  };
  await msg.sendEvent(eventMessage);
}

async function reviewMethod(status) {
  const eventMessage = {
    event_type: 'review_request',
    submission_id: status.id,
    conversation_id: status.conversation_id,
    workflow_id: status.workflow_id,
    step_name: status.step.name,
    data: status.step.data
  };
  await msg.sendEvent(eventMessage);
}

async function serviceMethod(status) {
  const eventMessage = {
    event_type: 'service_call',
    service_id: status.step.service_id,
    submission_id: status.id,
    conversation_id: status.conversation_id,
    workflow_id: status.workflow_id,
    step_name: status.step.name,
    data: status.step.data
  };
  await msg.sendEvent(eventMessage);
}

async function closeMethod(status) {
  const eventMessage = {
    event_type: 'workflow_completed',
    submission_id: status.id,
    conversation_id: status.conversation_id,
    workflow_id: status.workflow_id,
    step_name: status.step.name,
    data: status.step.data
  };
  await msg.sendEvent(eventMessage);
}

const stepMethods = {
  action: actionMethod,
  form: formMethod,
  review: reviewMethod,
  service: serviceMethod,
  close: closeMethod
};

async function promoteStepMethod(eventMessage) {
  const { submission_id: id } = eventMessage;
  await db.submission.promoteStep({ id });
  const status = await db.submission.getState({ id });
  const method = stepMethods[status.step.type];
  await method(status);
}

async function workflowStartedMethod(eventMessage) {
  const newEvent = { ...eventMessage, event_type: 'workflow_promote_step' };
  await msg.sendEvent(newEvent);
}

async function requestInitializedMethod(eventMessage) {
  const newEvent = { ...eventMessage, event_type: 'workflow_promote_step' };
  await msg.sendEvent(newEvent);
}

async function formSubmittedMethod(eventMessage) {
  const { submission_id: id, form_id: formId, user_id: userId } = eventMessage;
  const status = await db.submission.getState({ id });
  if (status.step.type === 'form' && status.step.form_id === formId) {
    const newEvent = {
      event_type: 'workflow_promote_step',
      submission_id: status.id,
      conversation_id: status.conversation_id,
      workflow_id: status.workflow_id,
      step_name: status.step.name,
      user_id: userId
    };
    await msg.sendEvent(newEvent);
  }
}

async function reviewApprovedMethod(eventMessage) {
  const newEvent = { ...eventMessage, event_type: 'workflow_promote_step' };
  await msg.sendEvent(newEvent);
}

async function reviewRejectedMethod(eventMessage) {
  const { submission_id: id, data: { rollback } } = eventMessage;
  await db.submission.rollback({ id, rollback });
  await promoteStepMethod(eventMessage);
}

async function workflowResumeMethod(eventMessage) {
  const { submission_id: id } = eventMessage;
  await db.service.deleteSecret(id);
}

const eventMethods = {
  workflow_promote_step: promoteStepMethod,
  workflow_started: workflowStartedMethod,
  request_initialized: requestInitializedMethod,
  form_submitted: formSubmittedMethod,
  review_approved: reviewApprovedMethod,
  review_rejected: reviewRejectedMethod,
  workflow_resume: workflowResumeMethod
};

async function processRecord(record) {
  const { eventMessage } = msg.parseRecord(record);
  const method = eventMethods[eventMessage.event_type];
  await method(eventMessage);
}

async function handler(event) {
  const records = event.Records;
  const promises = records.map((record) => processRecord(record));
  await Promise.all(promises);
  return {
    statusCode: 200
  };
}

exports.handler = handler;
