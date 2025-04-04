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
  if (user.user_privileges.includes('ADMIN')
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
  const authorizerRegex = /service-authorizer-(.*)/g;
  const serviceId = authorizerRegex.exec(user.id)[1];
  await db.service.deleteSecret({ submissionId: id, serviceId });
  const status = await db.submission.getState({ id });
  const eventMessage = {
    event_type: 'request_resumed',
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
  const staff = await db.user.getManagerIds({ daac_id: event.daac_id });
  const staffIds = staff.map((usr) => usr.id);
  await db.note.addUsersToConversation({
    conversation_id: status.conversation_id,
    user_list: staffIds
  });
  db.submission.addContributors({ id: status.id, contributor_ids: staffIds });
  await msg.sendEvent(eventMessage);
  return status;
}

async function applyMethod(event, user) {
  const approvedUserPrivileges = ['ADMIN', 'REQUEST_REASSIGN'];
  const { id, workflow_id: workflowId } = event;
  if (user.id?.includes('service-authorizer') || user.user_privileges.some((privilege) => approvedUserPrivileges.includes(privilege))) {
    await db.submission.reassignWorkflow({ id, workflowId });
    await db.submission.promoteStep({ id });
    const status = await db.submission.getState({ id });
    const eventMessage = {
      event_type: 'workflow_started',
      submission_id: id,
      conversation_id: status.conversation_id,
      workflow_id: workflowId,
      step_name: status.step.name,
      user_id: user.id
    };
    await msg.sendEvent(eventMessage);
    return status;
  }
  return { error: 'Not Authorized' };
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
  const { data_product_name_value: dataProduct, data_producer_info_name: dataProducer } = data;
  await db.submission.updateFormData({ id, form_id: formId, data: JSON.stringify(data) });
  await db.submission.updateSubmissionData({ id, dataProduct, dataProducer });
  await db.submission.updateMetadata({ id, metadata: JSON.stringify(await mapEDPubToUmmc(data)) });
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
  const approvedUserPrivileges = ['ADMIN', 'REQUEST_REVIEW', 'REQUEST_REVIEW_MANAGER'];
  const { id, approve } = event;
  const userId = user.id;
  if (user.id?.includes('service-authorizer') || user.user_privileges.some((privilege) => approvedUserPrivileges.includes(privilege))) {
    const status = await db.submission.getState({ id });
    const stepType = status.step.type;
    let eventType;
    let param;
    if (approve === 'false' || !approve) {
      param = {
        submission_id: id,
        user_id: userId,
        approve: 'rejected',
        step_name: status.step_name
      };
      const rejectionCount = await db.submission.updateStatusStepReviewApproval(param);
      if (!rejectionCount.error) {
        return status;
      }
      eventType = 'review_rejected';
    } else if (stepType === 'review') {
      param = {
        submission_id: id,
        user_id: userId,
        approve: 'approved',
        step_name: status.step_name
      };
      await db.submission.updateStatusStepReviewApproval(param);
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
  return { error: 'Not Authorized' };
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

  const approvedUserPrivileges = ['ADMIN', 'REQUEST_DAACREAD'];
  if (user.id?.includes('service-authorizer') || approvedUserPrivileges.some((privilege) => user.user_privileges.includes(privilege))) {
    const submission = await db.submission.withdrawSubmission({ id });
    const submissionMetrics = await db.metrics.getSubmissions({ submissionId: id });
    await msg.sendEvent({
      event_type: 'workflow_completed',
      submission_id: id,
      conversation_id: submission.conversation_id,
      workflow_id: submissionMetrics.workflow_id,
      step_name: 'withdrawn',
      time_to_publish: Math.round(submissionMetrics[0].time_to_publish)
    });
    return submission;
  }
  return db.submission.findById({ id, user_id: user.id });
}

async function restoreMethod(event, user) {
  const { id } = event;
  const approvedUserPrivileges = ['ADMIN', 'REQUEST_DAACREAD'];
  if (user.id?.includes('service-authorizer') || user.user_privileges.some((privilege) => approvedUserPrivileges.includes(privilege))) {
    return db.submission.restoreSubmission({ id });
  }
  return db.submission.findById({ id, user_id: user.id });
}

async function changeStepMethod(event, user) {
  // eslint-disable-next-line
  const { id, step_name } = event;
  const validStep = await db.submission.checkWorkflow({ step_name, id });
  const approvedUserPrivileges = ['ADMIN', 'REQUEST_DAACREAD'];
  if ((user.id?.includes('service-authorizer') || user.user_privileges.some((privilege) => approvedUserPrivileges.includes(privilege)))
                                               && await validStep.step_name) {
    return db.submission.setStep({ step_name, id });
  }
  return db.submission.findById({ id, user_id: user.id });
}

async function addContributorsMethod(event, user) {
  const { id, contributor_ids: contributorIds } = event;
  const approvedUserPrivileges = ['ADMIN', 'REQUEST_ADDUSER'];
  if (user.id?.includes('service-authorizer') || user.user_privileges.some((privilege) => approvedUserPrivileges.includes(privilege))) {
    const { conversation_id: conversationId } = await db.submission.getConversationId({ id });
    await db.note.addUsersToConversation({
      conversation_id: conversationId,
      user_list: contributorIds
    });
    return db.submission.addContributors({ id, contributor_ids: contributorIds });
  }
  return db.submission.findById({ id, user_id: user.id });
}

async function removeContributorMethod(event, user) {
  const { id, contributor_id: contributorId } = event;
  const approvedUserPrivileges = ['ADMIN', 'REQUEST_REMOVEUSER'];
  if (user.id?.includes('service-authorizer') || user.user_privileges.some((privilege) => approvedUserPrivileges.includes(privilege))) {
    const { conversation_id: conversationId } = await db.submission.getConversationId({ id });
    await db.note.removeUserFromConversation({
      conversation_id: conversationId,
      user_id: contributorId
    });
    return db.submission.removeContributor({ id, contributor: contributorId });
  }
  return db.submission.findById({ id, user_id: user.id });
}

async function copySubmissionMethod(event, user) {
  const {
    id: originId, copy_context: copyContext, copy_filter: copyFilter, action_copy: actionCopy
  } = event;
  const { form_data: formData, daac_id: daacId } = await db.submission.findById(
    { id: originId, user_id: user.id }
  );
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

  return db.submission.findById({ id, user_id: user.id });
}

async function getDetailsMethod(event, user) { // eslint-disable-line no-unused-vars
  const { params: { id } } = event;
  let privilegedUser = false;
  const approvedUserPrivileges = ['ADMIN', 'DAAC_READ'];
  if (user.user_privileges.some((privilege) => approvedUserPrivileges.includes(privilege))) {
    privilegedUser = true;
  }

  return db.submission.getSubmissionDetailsById({ id, privilegedUser });
}

async function mapMetadataMethod(event, user) {
  const { id: submissionId } = event;
  const approvedUserPrivileges = ['ADMIN', 'REQUEST_DAACREAD'];
  let mappedMetadata = {};
  if (user.user_privileges.some((privilege) => approvedUserPrivileges.includes(privilege))) {
    const formData = await db.submission.getFormData({ id: submissionId });
    try {
      mappedMetadata = await mapEDPubToUmmc(formData.data);
      return mappedMetadata;
    } catch (e) {
      console.error(e);
      return { error: 'Invalid form data. Form must be complete.' };
    }
  }
  return { error: 'Not Authorized' };
}

async function createStepReviewApprovalMethod(event, user) {
  const { submissionId, stepName, userIds } = event;
  const approvedUserPrivileges = ['ADMIN', 'CREATE_STEPREVIEW'];
  if (user.id?.includes('service-authorizer') || user.user_privileges.some((privilege) => approvedUserPrivileges.includes(privilege))) {
    const formData = await db.submission.createStepReviewApproval({
      submission_id: submissionId,
      step_name: stepName,
      user_ids: userIds,
      submitted_by: user.id
    });
    await addContributorsMethod({ id: submissionId, contributor_ids: userIds }, user);
    const eventMessage = {
      event_type: 'review_required',
      formId: formData?.length > 0 ? formData[0].form_id : '',
      userIds,
      submissionId,
      submitted_by_name: user.name,
      // Have to use string here because SNS doesn't support boolean type
      emailPayloadProvided: 'true'
    };
    await msg.sendEvent(eventMessage);
    return formData;
  }
  return { error: 'Not Authorized' };
}

async function getStepReviewApprovalMethod(event, user) {
  const { id } = event.params;
  const approvedUserPrivileges = ['ADMIN', 'REQUEST_DAACREAD', 'REQUEST_READ'];
  if (user.id?.includes('service-authorizer') || user.user_privileges.some((privilege) => approvedUserPrivileges.includes(privilege))) {
    return db.submission.getStepReviewApproval({ id });
  }
  return { error: 'Not Authorized' };
}

async function deleteStepReviewApprovalMethod(event, user) {
  const { submissionId, stepName, userIds } = event;
  const approvedUserPrivileges = ['ADMIN', 'REMOVE_STEPREVIEW'];
  if (user.id?.includes('service-authorizer') || user.user_privileges.some((privilege) => approvedUserPrivileges.includes(privilege))) {
    const formData = await db.submission.deleteStepReviewApproval({
      submission_id: submissionId,
      step_name: stepName,
      user_ids: userIds
    });
    // Only accepts 1 at time; however, this isn't an issue for the current dashboard implementation
    if (formData[0].initiator !== userIds[0]) {
      await removeContributorMethod({ id: submissionId, contributor_id: userIds[0] }, user);
    }
    return formData;
  }
  return { error: 'Not Authorized' };
}

async function validateCodeMethod(event) {
  const { code } = event.params;

  const codeData = await db.submission.checkCode({ code });
  const validationResponse = { isValid: false };

  // If we get anything but the expected return of daac_id and submission_id the validation failed
  if (codeData.daac_id) {
    validationResponse.isValid = true;
  }

  return validationResponse;
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
  mapMetadata: mapMetadataMethod,
  createStepReviewApproval: createStepReviewApprovalMethod,
  getStepReviewApproval: getStepReviewApprovalMethod,
  deleteStepReviewApproval: deleteStepReviewApprovalMethod,
  validateCode: validateCodeMethod
};

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const user = (event.context.authorizer ? { id: event.context.authorizer }
    : await db.user.findById({ id: event.context.user_id }));
  const operation = operations[event.operation];
  const data = await operation(event, user);
  return data;
}

exports.handler = handler;
