/**
 * Lambda that exposes Submission API to AWS API Gateway. This lambda
 * is used for most direct interactions with a Submission including the
 * following operations:
 * initialize, submit, review, lock, unlock, status
 * @module Submission
 */

const db = require('database-util');

const msg = require('message-util');

async function statusMethod(event, user) {
  const hidden = event.operation === 'inactive';
  if (user.user_privileges.includes('REQUEST_ADMINREAD') || user.user_privileges.includes('ADMIN')
  || user.user_groups.some((group) => group.short_name === 'root_group')) {
    return db.submission.getAdminSubmissions({ hidden });
  }
  if (user.user_privileges.includes('REQUEST_DAACREAD')) {
    return db.submission.getDaacSubmissions({ user_id: user.id, hidden, daac: true });
  }
  if (user.user_privileges.includes('REQUEST_READ')) {
    return db.submission.getUsersSubmissions({ user_id: user.id, hidden });
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
  const approvedUserRoles = ['admin', 'coordinator'];
  const { id, workflow_id: workflowId } = event;
  let status = await db.submission.getState({ id });
  if (user.user_roles.some((role) => approvedUserRoles.includes(role.short_name))) {
    await db.submission.reassignWorkflow({ id, workflowId });
    await db.submission.promoteStep({ id });
    status = await db.submission.getState({ id });
    const eventMessage = {
      event_type: 'workflow_started',
      submission_id: id,
      conversation_id: status.conversation_id,
      workflow_id: workflowId,
      step_name: status.step.name,
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
  const eventMessage = {
    event_type: approve && approve !== 'false' ? 'review_approved' : 'review_rejected',
    submission_id: id,
    conversation_id: status.conversation_id,
    workflow_id: status.workflow_id,
    user_id: user.id,
    data: status.step.data
  };
  await msg.sendEvent(eventMessage);
  return status;
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

async function withdrawMethod(event, user) {
  const { id } = event;
  const approvedUserPrivileges = ['REQUEST_ADMINREAD', 'ADMIN', 'REQUEST_DAACREAD'];
  if (approvedUserPrivileges.some((privilege) => user.user_privileges.includes(privilege))) {
    return db.submission.withdrawSubmission({ id });
  }
  return db.submission.findById({ id });
}

async function restoreMethod(event, user) {
  const { id } = event;
  const approvedUserRoles = ['admin', 'coordinator'];
  if (user.user_roles.some((role) => approvedUserRoles.includes(role.short_name))) {
    return db.submission.restoreSubmission({ id });
  }
  return db.submission.findById({ id });
}

async function changeStepMethod(event, user) {
  // eslint-disable-next-line
  const { id, step_name } = event;
  const validStep = await db.submission.checkWorkflow({ step_name, id });
  const approvedUserRoles = ['admin', 'coordinator'];
  if (user.user_roles.some((role) => approvedUserRoles.includes(role.short_name))
   && await validStep.step_name) {
    return db.submission.setStep({ step_name, id });
  }
  return db.submission.findById({ id });
}

async function addContributorsMethod(event, user) {
  const { id, contributor_ids: contributorIds } = event;
  const approvedUserPrivileges = ['ADMIN', 'REQUEST_ADDUSER'];
  if (user.user_privileges.some((privilege) => approvedUserPrivileges.includes(privilege))) {
    const { conversation_id: conversationId } = await db.submission.getConversationId({ id });
    await db.note.addUsersToConversation({
      conversation_id: conversationId,
      user_list: contributorIds
    });
    return db.submission.addContributors({ id, contributor_ids: contributorIds });
  }
  return db.submission.findById({ id });
}

async function removeContributorMethod(event, user) {
  const { id, contributor_id: contributorId } = event;
  const approvedUserPrivileges = ['ADMIN', 'REQUEST_REMOVEUSER'];
  if (user.user_privileges.some((privilege) => approvedUserPrivileges.includes(privilege))) {
    const { conversation_id: conversationId } = await db.submission.getConversationId({ id });
    await db.note.removeUserFromConversation({
      conversation_id: conversationId,
      user_id: contributorId
    });
    return db.submission.removeContributor({ id, contributor: contributorId });
  }
  return db.submission.findById({ id });
}

async function copySubmissionMethod(event, user) {
  const { id: originId, context } = event;
  const { form_data: formData, daac_id: daacId } = await db.submission.findById({ id: originId });
  const { id } = await initializeMethod({ daac_id: daacId }, user);

  formData.data_product_name_value = formData.data_product_name_value
    ? `Copy of ${formData.data_product_name_value}` : '';
  await db.submission.copyFormData({ id, data: JSON.stringify(formData), origin_id: originId });

  await db.submission.copyActionData({ origin_id: originId, id });
  await db.submission.setSubmissionCopy({
    id, edpuser_id: user.id, origin_id: originId, context
  });

  return db.submission.findById({ id });
}

const operations = {
  initialize: initializeMethod,
  active: statusMethod,
  inactive: statusMethod,
  apply: applyMethod,
  metadata: metadataMethod,
  submit: submitMethod,
  save: saveMethod,
  review: reviewMethod,
  resume: resumeMethod,
  lock: lockMethod,
  unlock: unlockMethod,
  withdraw: withdrawMethod,
  restore: restoreMethod,
  changeStep: changeStepMethod,
  addContributors: addContributorsMethod,
  removeContributor: removeContributorMethod,
  copySubmission: copySubmissionMethod
};

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const user = await db.user.findById({ id: event.context.user_id });
  const operation = operations[event.operation];
  const data = await operation(event, user);
  return data;
}

exports.handler = handler;
