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
  const activeSubmissions = await DatabaseUtil.execute({ resource: 'submission', operation: 'getUsersSubmissions'},
    {
      user_id: userId
    }
  );
  return activeSubmissions;
}

async function resumeMethod(event, userId) {
  const { id } = event;
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

async function initializeMethod(event, userId) {
  const submission = await DatabaseUtil.execute({ resource: 'submission', operation: 'initialize' },
    { user_id: userId, ...event });
  const eventMessage = {
    event_type: 'submission_initialized',
    submission_id: submission.id,
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
    event_type: 'submission_workflow_started',
    submission_id: id,
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
  const submission = await DatabaseUtil.execute({ resource: 'submission', operation: 'findShortById' },
    { submission: { id } });
  const eventMessage = {
    event_type: 'submission_metadata_updated',
    submission_id: id,
    user_id: userId
  };
  await MessageUtil.sendEvent(eventMessage);
  return response;
}

async function saveMethod(event, userId) {
  let { id, form_id: formId, data: data } = event;
  if (!id) {
    const submission = await initializeMethod(event, userId);
    id = submission.id;
  }
  const response = await DatabaseUtil.execute({ resource: 'submission', operation: 'updateFormData' }, { submission: { id }, form: { id: formId, data: JSON.stringify(data) } });
  return response;
}

async function submitMethod(event, userId) {
  let { id, form_id: formId } = event;
  const response = await saveMethod(event, userId);
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
    await resumeMethod(event, userId);
  }
  return response;
}

async function reviewMethod(event, userId) {
  // Similar to submit, but for reviews. In case of rejecting a Submission
  // during review users can send a comment with reason for rejection.
  // const [[submission]] = await dbDriver.getItems('submission', body.submission_id);
  // if (body.approval) {
  //   const message = constructMessage(submission, 'review', true);
  //   await msgDriver.sendSns(message);
  //   return [true];
  // }
  // return [false, 'Bad request.'];
  console.info('Not Implemented', event, userId);
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
