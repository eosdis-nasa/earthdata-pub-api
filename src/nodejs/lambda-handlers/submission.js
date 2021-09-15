/**
 * Lambda that exposes Submission API to AWS API Gateway. This lambda
 * is used for most direct interactions with a Submission including the
 * following operations:
 * initialize, submit, review, lock, unlock, status
 * @module Submission
 */

const db = require('database-util');

const msg = require('message-util');

async function activeMethod(event, user) {
  if (user.user_privileges.includes('REQUEST_ADMINREAD') || user.user_privileges.includes('ADMIN')) {
    return db.submission.getAdminSubmissions();
  }
  if (user.user_privileges.includes('REQUEST_DAACREAD')) {
    return db.submission.getDaacSubmissions({ user_id: user.id });
  }
  if (user.user_privileges.includes('REQUEST_READ')) {
    return db.submission.getUsersSubmissions({ user_id: user.id });
  }

  return [];
}

async function resumeMethod(event, user, silent = false) {
  const { id } = event;
  const status = await db.submission.getState({ id });
  const eventMessage = {
    event_type: 'workflow_resume',
    submission_id: status.id,
    conversation_id: status.conversation_id,
    workflow_id: status.workflow_id,
    step_name: status.step.name,
    user_id: user.id,
    ...(silent ? { data: { silent } } : {})
  };
  await msg.sendEvent(eventMessage);
  return status;
}

async function initializeMethod(event, user) {
  const submission = await db.submission.initialize({
    user_id: user.id,
    ...event
  });
  const status = await db.submission.getState(submission);
  const eventMessage = {
    event_type: 'request_initialized',
    submission_id: status.id,
    conversation_id: status.conversation_id,
    workflow_id: status.workflow_id,
    step_name: 'init',
    user_id: user.id
  };
  await msg.sendEvent(eventMessage);
  return status;
}

async function applyMethod(event, user) {
  const { id, workflow_id: workflowId } = event;
  const status = await db.submission.getState({ id });
  if (status.step.type === 'close') {
    await db.submission.applyWorkflow({ id, workflow_id: workflowId });
    const eventMessage = {
      event_type: 'workflow_started',
      submission_id: id,
      conversation_id: status.conversation_id,
      workflow_id: workflowId,
      step_name: 'init',
      user_id: user.id
    };
    await msg.sendEvent(eventMessage);
  }
  return status;
}

async function metadataMethod(event, user) {
  // Update Metadata for a Submission
  const { id, metadata } = event;
  const response = await db.submission.updateMetadata({ id, metadata: JSON.stringify(metadata) });
  const status = await db.submission.getState({ id });
  const eventMessage = {
    event_type: 'metadata_updated',
    submission_id: id,
    conversation_id: status.conversation_id,
    user_id: user.id
  };
  await msg.sendEvent(eventMessage);
  return response;
}

async function saveMethod(event, user) {
  const { form_id: formId, daac_id: daacId, data } = event;
  let { id } = event;
  if (!id) {
    const submission = await initializeMethod(event, user);
    id = submission.id;
  }
  await db.submission.updateFormData({ id, form_id: formId, data: JSON.stringify(data) });
  const status = await db.submission.getState({ id });
  if (daacId && daacId !== status.daac_id) {
    await db.submission.updateDaac({ id, daac_id: daacId });
    status.daac_id = daacId;
  }
  return status;
}

async function submitMethod(event, user) {
  const { form_id: formId } = event;
  const status = await saveMethod(event, user);
  const eventMessage = {
    event_type: 'form_submitted',
    submission_id: status.id,
    conversation_id: status.conversation_id,
    workflow_id: status.workflow_id,
    form_id: formId,
    user_id: user.id
  };
  await msg.sendEvent(eventMessage);
  return status;
}

async function reviewMethod(event, user) {
  const { id, approve } = event;
  const status = await db.submission.getState({ id });
  if (status.step.type === 'review') {
    const eventMessage = {
      event_type: approve ? 'review_approved' : 'review_rejected',
      submission_id: id,
      conversation_id: status.conversation_id,
      workflow_id: status.workflow_id,
      user_id: user.id,
      data: status.step.data
    };
    await msg.sendEvent(eventMessage);
    return status;
  }
  return {};
}

async function lockMethod(event, user) {
  // const [[submission]] = await dbDriver.getItems('submission', body.submission_id);
  // submission.lock = user.id;
  // const response = await dbDriver.putItem('submission', submission);
  // constructMessage(submission, 'lock');
  // return response;
  console.info('Not Implemented', event, user);
}

async function unlockMethod(event, user) {
  // const [[submission]] = await dbDriver.getItems('submission', body.submission_id);
  // submission.lock = false;
  // const response = await dbDriver.putItem('submission', submission);
  // constructMessage(submission, 'unlock');
  // return response;
  console.info('Not Implemented', event, user);
}

const operations = {
  initialize: initializeMethod,
  active: activeMethod,
  apply: applyMethod,
  metadata: metadataMethod,
  submit: submitMethod,
  save: saveMethod,
  review: reviewMethod,
  resume: resumeMethod,
  lock: lockMethod,
  unlock: unlockMethod
};

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const user = await db.user.findById({ id: event.context.user_id });
  const operation = operations[event.operation];
  const data = await operation(event, user);
  return data;
}

exports.handler = handler;
