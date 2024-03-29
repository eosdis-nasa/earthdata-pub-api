/**
 * Lambda that exposes Submission API to AWS API Gateway. This lambda
 * is used for most direct interactions with a Submission including the
 * following operations:
 * initialize, submit, review, lock, unlock, status
 * @module Submission
 */

const db = require('database-util');

const msg = require('message-util');

const { mapEDPubToUmmc } = require('./submission/metadata-mapper.js');

function filterObject(base, filter) {
  const filtered = Object.keys(base)
    .filter((key) => filter.includes(key))
    .reduce((obj, key) => {
      obj[key] = base[key];
      return obj;
    }, {});
  return filtered;
}

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
  if (status.workflow_id === '3335970e-8a9b-481b-85b7-dfaaa3f5dbd9') {
    const staff = await db.user.getUnknownStaffIds();
    const staffIds = staff.map((usr) => usr.id);
    await db.note.addUsersToConversation({
      conversation_id: status.conversation_id,
      user_list: staffIds
    });
    db.submission.addContributors({ id: status.id, contributor_ids: staffIds });
  }
  await msg.sendEvent(eventMessage);
  return status;
}

async function applyMethod(event, user) {
  const approvedUserRoles = ['admin', 'manager', 'staff'];
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

async function saveMethod(event) {
  const { form_id: formId, daac_id: daacId, data } = event;
  const { id } = event;
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
    user_id: user.id,
    step_name: status.step.name
  };
  if (status.step.step_message) eventMessage.step_message = status.step.step_message;
  await msg.sendEvent(eventMessage);
  return status;
}

async function reviewMethod(event, user) {
  const { id, approve } = event;
  const status = await db.submission.getState({ id });
  const stepType = status.step.type;
  let eventType;
  if (approve === 'false' || !approve) {
    eventType = 'review_rejected';
  } else if (stepType === 'review') {
    eventType = 'review_approved';
  } else {
    eventType = 'workflow_promote_step';
  }
  const eventMessage = {
    event_type: eventType,
    submission_id: id,
    conversation_id: status.conversation_id,
    workflow_id: status.workflow_id,
    user_id: user.id,
    data: status.step.data,
    step_name: status.step_name
  };
  if (status.step.step_message) eventMessage.step_message = status.step.step_message;
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
  const approvedUserPrivileges = ['REQUEST_ADMINREAD', 'ADMIN', 'REQUEST_DAACREAD'];
  if (user.user_privileges.some((privilege) => approvedUserPrivileges.includes(privilege))) {
    return db.submission.restoreSubmission({ id });
  }
  return db.submission.findById({ id });
}

async function changeStepMethod(event, user) {
  // eslint-disable-next-line
  const { id, step_name } = event;
  const validStep = await db.submission.checkWorkflow({ step_name, id });
  const approvedUserPrivileges = ['REQUEST_ADMINREAD', 'ADMIN', 'REQUEST_DAACREAD'];
  if (user.user_privileges.some((privilege) => approvedUserPrivileges.includes(privilege))
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
  const {
    id: originId, copy_context: copyContext, copy_filter: copyFilter, action_copy: actionCopy
  } = event;
  const { form_data: formData, daac_id: daacId } = await db.submission.findById({ id: originId });
  const { id } = await initializeMethod({ daac_id: daacId }, user);

  const filteredFormData = !copyFilter ? formData
    : filterObject(formData, copyFilter);

  filteredFormData.data_product_name_value = filteredFormData.data_product_name_value
    ? `Copy of ${filteredFormData.data_product_name_value}` : '';
  await db.submission.copyFormData({
    id,
    data: JSON.stringify(filteredFormData),
    origin_id: originId
  });

  if (actionCopy) await db.submission.copyActionData({ origin_id: originId, id });
  await db.submission.setSubmissionCopy({
    id, edpuser_id: user.id, origin_id: originId, context: copyContext
  });

  return db.submission.findById({ id });
}

async function getDetailsMethod(event, user) { // eslint-disable-line no-unused-vars
  const { params: { id } } = event;
  return db.submission.getSubmissionDetailsById({ id });
}

async function mapMetadataMethod(event, user) {
  const { id: submissionId } = event;
  const approvedUserPrivileges = ['ADMIN', 'REQUEST_DAACREAD', 'REQUEST_ADMINREAD'];
  let mappedMetadata = {};
  if (!user.user_privileges.some((privilege) => approvedUserPrivileges.includes(privilege))) {
    return { error: 'Not Authorized' };
  }
  const formData = await db.submission.getFormData({ id: submissionId });
  try {
    mappedMetadata = await mapEDPubToUmmc(formData.data);
  } catch (e) {
    return { error: 'Invalid form data. Data publication form must be complete' };
  }

  return mappedMetadata;
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
  copySubmission: copySubmissionMethod,
  getDetails: getDetailsMethod,
  mapMetadata: mapMetadataMethod
};

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const user = await db.user.findById({ id: event.context.user_id });
  const operation = operations[event.operation];
  const data = await operation(event, user);
  return data;
}

exports.handler = handler;
