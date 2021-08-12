/**
 * Lambda that exposes Submission API to AWS API Gateway. This lambda
 * is used for most direct interactions with a Submission including the
 * following operations:
 * initialize, submit, review, lock, unlock, status
 * @module Submission
 */

const DatabaseUtil = require('database-util');

const MessageUtil = require('message-util');

async function activeMethod(event, userId) {
  const activeSubmissions = await DatabaseUtil.execute({ resource: 'submission', operation: 'getUsersSubmissions' },
    {
      user_id: userId
    });
  return activeSubmissions;
}

async function resumeMethod(event, userId, silent = false) {
  const { id } = event;
  const status = await DatabaseUtil.execute({ resource: 'submission', operation: 'getState' },
    { submission: { id } });
  const eventMessage = {
    event_type: 'workflow_promote_step',
    submission_id: status.id,
    conversation_id: status.conversation_id,
    workflow_id: status.workflow_id,
    step_name: status.step.name,
    user_id: userId,
    ...(silent ? { data: { silent } } : {})
  };
  await MessageUtil.sendEvent(eventMessage);
  return status;
}

async function initializeMethod(event, userId) {
  const submission = await DatabaseUtil.execute({ resource: 'submission', operation: 'initialize' },
    { user_id: userId, ...event });
  const eventMessage = {
    event_type: 'request_initialized',
    submission_id: submission.id,
    conversation_id: submission.conversation_id,
    user_id: userId
  };
  await MessageUtil.sendEvent(eventMessage);
  await resumeMethod({ id: submission.id }, userId);
  return submission;
}

async function applyMethod(event, userId) {
  const { id, workflow_id: workflowId } = event;
  const status = await DatabaseUtil.execute({ resource: 'submission', operation: 'getState' },
    { submission: { id } });
  // Check if in ready state and if the proposed workflow has been run previously
  await DatabaseUtil.execute({ resource: 'submission', operation: 'applyWorkflow' },
    { submission: { id }, workflow: { id: workflowId } });
  const eventMessage = {
    event_type: 'workflow_started',
    submission_id: id,
    conversation_id: status.conversation_id,
    workflow_id: workflowId
  };
  await MessageUtil.sendEvent(eventMessage);
  await resumeMethod(event, userId);
  return status;
}

async function metadataMethod(event, userId) {
  // Update Metadata for a Submission
  const { id, metadata } = event;
  const response = await DatabaseUtil.execute({ resource: 'submission', operation: 'updateMetadata' },
    { submission: { id, metadata: JSON.stringify(metadata) } });
  const status = await DatabaseUtil.execute({ resource: 'submission', operation: 'getState' },
    { submission: { id } });
  const eventMessage = {
    event_type: 'metadata_updated',
    submission_id: id,
    conversation_id: status.conversation_id,
    user_id: userId
  };
  await MessageUtil.sendEvent(eventMessage);
  return response;
}

async function saveMethod(event, userId) {
  const { form_id: formId, daac_id: daacId, data } = event;
  let { id } = event;
  if (!id) {
    const submission = await initializeMethod(event, userId);
    id = submission.id;
  }
  await DatabaseUtil.execute({ resource: 'submission', operation: 'updateFormData' }, { submission: { id }, form: { id: formId, data: JSON.stringify(data) } });
  const status = await DatabaseUtil.execute({ resource: 'submission', operation: 'getState' },
    { submission: { id } });
  if (daacId && daacId !== status.daac_id) {
    await DatabaseUtil.execute({ resource: 'submission', operation: 'updateDaac' },
      { submission: { id, daac_id: daacId } });
    status.daac_id = daacId;
  }
  return status;
}

async function submitMethod(event, userId) {
  const { form_id: formId } = event;
  const status = await saveMethod(event, userId);
  const eventMessage = {
    event_type: 'form_submitted',
    submission_id: status.id,
    conversation_id: status.conversation_id,
    workflow_id: status.workflow_id,
    form_id: formId,
    user_id: userId
  };
  await MessageUtil.sendEvent(eventMessage);
  if (status.step.type === 'form' && status.step.form_id === formId) {
    await resumeMethod({ id: status.id }, userId);
  }
  return status;
}

async function reviewMethod(event, userId) {
  const { id, approve } = event;
  const status = await DatabaseUtil.execute({ resource: 'submission', operation: 'getState' },
    { submission: { id } });
  if (status.step.type === 'review') {
    if (!approve) {
      await DatabaseUtil.execute({ resource: 'submission', operation: 'rollback' },
        { submission: { id, rollback: status.step.data.rollback } });
    }
    const eventMessage = {
      event_type: approve ? 'review_approved' : 'review_rejected',
      submission_id: id,
      conversation_id: status.conversation_id,
      workflow_id: status.workflow_id,
      user_id: userId,
      data: status.step.data
    };
    await MessageUtil.sendEvent(eventMessage);
    const response = await resumeMethod(event, userId, !approve);
    return response;
  }
  return {};
}

async function lockMethod(event, userId) {
  // const [[submission]] = await dbDriver.getItems('submission', body.submission_id);
  // submission.lock = user.id;
  // const response = await dbDriver.putItem('submission', submission);
  // constructMessage(submission, 'lock');
  // return response;
  console.info('Not Implemented', event, userId);
}

async function unlockMethod(event, userId) {
  // const [[submission]] = await dbDriver.getItems('submission', body.submission_id);
  // submission.lock = false;
  // const response = await dbDriver.putItem('submission', submission);
  // constructMessage(submission, 'unlock');
  // return response;
  console.info('Not Implemented', event, userId);
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

  const operation = operations[event.operation];
  const data = await operation(event, event.context.user_id);
  return data;
}

exports.handler = handler;
