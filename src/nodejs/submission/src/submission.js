/**
 * Lambda that exposes Submission API to AWS API Gateway. This lambda
 * is used for most direct interactions with a Submission including the
 * following operations:
 * initialize, submit, review, lock, unlock, status
 * @module Submission
 */

const PgAdapter = require('database-driver');

const MessageDriver = require('message-driver');

async function resumeMethod(body, user) {
  const { id } = body.payload;
  const status = await PgAdapter.execute({ resource: 'submission', operation: 'getState' },
    { submission: { id } });
  const eventMessage = {
    event_type: 'workflow_promote_step',
    submission_id: status.id,
    workflow_id: status.workflow_id,
    step_name: status.step_name,
    user_id: user.id
  };
  await MessageDriver.sendEvent(eventMessage);
  return status;
}

async function initializeMethod(body, user) {
  const submission = await PgAdapter.execute({ resource: 'submission', operation: 'initialize' },
    { user });
  const eventMessage = {
    event_type: 'submission_initialized',
    submission_id: submission.id,
    user_id: user.id
  };
  await MessageDriver.sendEvent(eventMessage);
  await resumeMethod({ payload: { id: submission.id } }, user);
  return submission;
}

async function applyMethod(body, user) {
  const { id, workflow_id: workflowId } = body.payload;
  const status = await PgAdapter.execute({ resource: 'submission', operation: 'getState' },
    { submission: { id } });
  // Check if in ready state and if the proposed workflow has been run previously
  await PgAdapter.execute({ resource: 'submission', operation: 'applyWorkflow' },
    { submission: { id }, workflow: { id: workflowId } });
  const eventMessage = {
    event_type: 'submission_workflow_started',
    submission_id: id,
    workflow_id: workflowId
  };
  await MessageDriver.sendEvent(eventMessage);
  await resumeMethod(body, user);
  return status;
}

async function metadataMethod(body, user) {
  // Update Metadata for a Submission
  const { id, metadata } = body.payload;
  const response = await PgAdapter.execute({ resource: 'submission', operation: 'updateMetadata' },
    { submission: { id, metadata: JSON.stringify(metadata) } });
  const submission = await PgAdapter.execute({ resource: 'submission', operation: 'findShortById' },
    { submission: { id } });
  const eventMessage = {
    event_type: 'submission_metadata_updated',
    submission_id: id,
    user_id: user.id,
    daac_id: submission.daac_id
  };
  await MessageDriver.sendEvent(eventMessage);
  return response;
}

async function saveMethod(body, user) {
  const { id, form_id: formId, data: data } = body.payload;
  const response = await PgAdapter.execute({ resource: 'submission', operation: 'updateFormData' }, { submission: { id }, form: { id: formId, data: JSON.stringify(data) } });
  return response;
}

async function submitMethod(body, user) {
  const { id, form_id: formId } = body.payload;
  const response = await saveMethod(body, user);
  const eventMessage = {
    event_type: 'submission_form_submitted',
    submission_id: id,
    form_id: formId,
    user_id: user.id
  };
  await MessageDriver.sendEvent(eventMessage);
  const status = await PgAdapter.execute({ resource: 'submission', operation: 'getState' },
    { submission: { id } });
  if (status.type === 'form' && status.form_id === formId) {
    await resumeMethod(body, user);
  }
  return response;
}

async function reviewMethod(body, user) {
  // Similar to submit, but for reviews. In case of rejecting a Submission
  // during review users can send a comment with reason for rejection.
  // const [[submission]] = await dbDriver.getItems('submission', body.submission_id);
  // if (body.approval) {
  //   const message = constructMessage(submission, 'review', true);
  //   await msgDriver.sendSns(message);
  //   return [true];
  // }
  // return [false, 'Bad request.'];
  console.info('Not Implemented', body, user);
}

async function lockMethod(body, user) {
  // const [[submission]] = await dbDriver.getItems('submission', body.submission_id);
  // submission.lock = user.id;
  // const response = await dbDriver.putItem('submission', submission);
  // constructMessage(submission, 'lock');
  // return response;
  console.info('Not Implemented', body, user);
}

async function unlockMethod(body, user) {
  // const [[submission]] = await dbDriver.getItems('submission', body.submission_id);
  // submission.lock = false;
  // const response = await dbDriver.putItem('submission', submission);
  // constructMessage(submission, 'unlock');
  // return response;
  console.info('Not Implemented', body, user);
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
  const user = await PgAdapter.execute(
    { resource: 'user', operation: 'findById' },
    { user: { id: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' } }
  );
  // After integration of auth, user will be pulled from context

  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  console.info(`[USER]\n${JSON.stringify(user)}`);

  const operation = operations[event.operation];
  const data = await operation(event, user);
  return data;
}

exports.handler = handler;
