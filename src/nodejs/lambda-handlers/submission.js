/**
 * Lambda that exposes Submission API to AWS API Gateway. This lambda
 * is used for most direct interactions with a Submission including the
 * following operations:
 * initialize, submit, review, lock, unlock, status
 * @module Submission
 */

const DatabaseUtil = require('database-util');

const MessageUtil = require('message-util');

async function resumeMethod(body, userId) {
  const { id } = body.payload;
  const status = await DatabaseUtil.execute({ resource: 'submission', operation: 'getState' },
    { submission: { id } });
  const eventMessage = {
    event_type: 'workflow_promote_step',
    submission_id: status.id,
    workflow_id: status.workflow_id,
    step_name: status.step_name,
    user_id: userId
  };
  await MessageUtil.sendEvent(eventMessage);
  return status;
}

async function initializeMethod(body, userId) {
  const submission = await DatabaseUtil.execute({ resource: 'submission', operation: 'initialize' },
    { user: userId });
  const eventMessage = {
    event_type: 'submission_initialized',
    submission_id: submission.id,
    user_id: userId
  };
  await MessageUtil.sendEvent(eventMessage);
  await resumeMethod({ payload: { id: submission.id } }, userId);
  return submission;
}

async function applyMethod(body, userId) {
  const { id, workflow_id: workflowId } = body.payload;
  const status = await DatabaseUtil.execute({ resource: 'submission', operation: 'getState' },
    { submission: { id } });
  // Check if in ready state and if the proposed workflow has been run previously
  await DatabaseUtil.execute({ resource: 'submission', operation: 'applyWorkflow' },
    { submission: { id }, workflow: { id: workflowId } });
  const eventMessage = {
    event_type: 'submission_workflow_started',
    submission_id: id,
    workflow_id: workflowId
  };
  await MessageUtil.sendEvent(eventMessage);
  await resumeMethod(body, userId);
  return status;
}

async function metadataMethod(body, userId) {
  // Update Metadata for a Submission
  const { id, metadata } = body.payload;
  const response = await DatabaseUtil.execute({ resource: 'submission', operation: 'updateMetadata' },
    { submission: { id, metadata: JSON.stringify(metadata) } });
  const submission = await DatabaseUtil.execute({ resource: 'submission', operation: 'findShortById' },
    { submission: { id } });
  const eventMessage = {
    event_type: 'submission_metadata_updated',
    submission_id: id,
    user_id: userId,
    daac_id: submission.daac_id
  };
  await MessageUtil.sendEvent(eventMessage);
  return response;
}

async function saveMethod(body, userId) {
  let { id, form_id: formId, data: data } = body.payload;
  if (!id) {
    const submission = await initializeMethod(body, userId);
    id = submission.id;
  }
  const response = await DatabaseUtil.execute({ resource: 'submission', operation: 'updateFormData' }, { submission: { id }, form: { id: formId, data: JSON.stringify(data) } });
  return response;
}

async function submitMethod(body, userId) {
  let { id, form_id: formId } = body.payload;
  const response = await saveMethod(body, userId);
  id = response.id;
  const eventMessage = {
    event_type: 'submission_form_submitted',
    submission_id: id,
    form_id: formId,
    user_id: userId
  };
  await MessageUtil.sendEvent(eventMessage);
  const status = await DatabaseUtil.execute({ resource: 'submission', operation: 'getState' },
    { submission: { id } });
  if (status.type === 'form' && status.form_id === formId) {
    await resumeMethod(body, userId);
  }
  return response;
}

async function reviewMethod(body, userId) {
  // Similar to submit, but for reviews. In case of rejecting a Submission
  // during review users can send a comment with reason for rejection.
  // const [[submission]] = await dbDriver.getItems('submission', body.submission_id);
  // if (body.approval) {
  //   const message = constructMessage(submission, 'review', true);
  //   await msgDriver.sendSns(message);
  //   return [true];
  // }
  // return [false, 'Bad request.'];
  console.info('Not Implemented', body, userId);
}

async function lockMethod(body, userId) {
  // const [[submission]] = await dbDriver.getItems('submission', body.submission_id);
  // submission.lock = user.id;
  // const response = await dbDriver.putItem('submission', submission);
  // constructMessage(submission, 'lock');
  // return response;
  console.info('Not Implemented', body, userId);
}

async function unlockMethod(body, userId) {
  // const [[submission]] = await dbDriver.getItems('submission', body.submission_id);
  // submission.lock = false;
  // const response = await dbDriver.putItem('submission', submission);
  // constructMessage(submission, 'unlock');
  // return response;
  console.info('Not Implemented', body, userId);
}

const operations = {
  initialize: initializeMethod,
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
