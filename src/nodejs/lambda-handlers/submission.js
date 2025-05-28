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

async function validateCodeMethod(event) {
  const { code } = event;
  const codeData = await db.submission.checkCode({ code });

  // If we get anything but the expected return of daac_id and submission_id the validation failed
  if (codeData.daac_id) {
    return {
      is_valid: true,
      ...codeData
    };
  }

  return { is_valid: false };
}

async function initializeMethod(event, user, skipCopy = false) {
  const initializationData = {
    user_id: user.id,
    ...event
  };
  const codeData = event.code ? await validateCodeMethod({ code: event.code }) : null;
  const accessionSubmissionId = codeData && codeData.submission_id ? codeData.submission_id : null;

  if (codeData && codeData.is_valid === true) {
    // Add code table properties in order to populate the publication_accession_association table
    initializationData.daac_id = codeData.daac_id;
    initializationData.accession_submission_id = accessionSubmissionId;
  } else if (codeData) {
    return { error: 'Invalid Code' };
  }

  const submission = await db.submission.initialize(initializationData);
  const status = await db.submission.getState(submission);
  const eventMessage = {
    event_type: 'request_initialized',
    submission_id: status.id,
    conversation_id: status.conversation_id,
    workflow_id: status.workflow_id,
    step_name: 'init',
    user_id: user.id
  };
  let staff;
  if (!submission.daac_id) {
    staff = await db.user.getRootGroupObserverIds();
  } else {
    staff = await db.user.getManagerIds({ daac_id: submission.daac_id });
  }
  const staffIds = staff.map((usr) => usr.id);
  await db.note.addUsersToConversation({
    conversation_id: status.conversation_id,
    user_list: staffIds
  });
  db.submission.addContributors({ id: status.id, contributor_ids: staffIds });

  // If initializing a Publication Form, Pre-populate data w/ content from accession form
  if (accessionSubmissionId && !skipCopy) {
    // eslint-disable-next-line
    await copySubmissionMethod({ id: accessionSubmissionId }, user, status.id);
  }

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
  const { data_producer_info_name: dataProducer } = data;
  const dataProduct = data.data_product_name_value || data.dar_form_project_name_info;
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
    await db.service.deleteSubmissionSecrets({ submissionId: id });
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

async function promoteStepMethod(event, user) {
  const { id } = event;
  const approvedUserPrivileges = ['ADMIN', 'REQUEST_DAACREAD'];
  if ((user.id?.includes('service-authorizer') || user.user_privileges.some((privilege) => approvedUserPrivileges.includes(privilege)))) {
    const status = await db.submission.getState({ id });
    const eventMessage = {
      event_type: 'workflow_promote_step',
      submission_id: id,
      conversation_id: status.conversation_id,
      workflow_id: status.workflow_id,
      user_id: user.id,
      data: status.step.data,
      step_name: status.step_name
    };
    await msg.sendEvent(eventMessage);
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

async function copySubmissionMethod(event, user, newSubmissionId) {
  const {
    id: originId, copy_context: copyContext, copy_filter: copyFilter, action_copy: actionCopy
  } = event;
  const { form_data: formData, code } = await db.submission.findById(
    { id: originId, user_id: user.id }
  );

  /*
  This is used to handle the two ways we enter this function:
  1) From initializeMethod
    - user created a new DPR submission from the dashboard/api which triggered initializeMethod()
    - initializeMethod created the new submission so we have the new id, just need to copy the data
  2) Directly from API
    - user cloned either a DAR or DPR submission
    - Need to initialize the new submission with the code value from the base submission
  */
  let id;
  if (newSubmissionId) {
    id = newSubmissionId;
  } else {
    const result = await initializeMethod({ code }, user, true);
    id = result.id;
  }

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

async function assignDaacsMethod(event, user) {
  const { id, daacs, requires_review: requiresReview } = event;
  const approvedUserPrivileges = ['ADMIN', 'REQUEST_ASSIGNDAAC'];

  if (!user.user_privileges.some((privilege) => approvedUserPrivileges.includes(privilege))) {
    return { error: 'Invalid permissions.' };
  }

  let submission = await db.submission.findById({ id, user_id: user.id });

  if (submission.error) {
    return { error: 'Invalid permissions.' };
  }

  // Check current step - only proceed if on DAAC assignment step
  if (!submission.step_name.match(/daac_assignment(_final)?/g)) {
    return { error: 'Invalid workflow step. Unable to assign DAACs.' };
  }

  // If the submission requires a daac review - assign the daac and move to the next step
  if (requiresReview) {
    // Double check that only one DAAC was chosen
    // should not be an issue comming from the dashboard but ensure is the case from the API
    if (daacs && daacs.length > 1) {
      return { error: 'Invalid number of DAACS selected. Only 1 DAAC may be selected when needs review is true.' };
    }

    // Assign Daac to the submission
    const daacId = daacs[0];
    await db.submission.updateDaac({ id, daac_id: daacId });
  } else {
    // If the submission does not require a daac review - assign the codes for all daacs selected
    // If there are existing codes - remove any not in the new list
    if (submission.assigned_daacs !== null) {
      const removedDaacs = submission.assigned_daacs
        .filter((daacObj) => !daacs.includes(daacObj.daac_id))
        .map((daacObj) => daacObj.daac_id);
      await db.submission.deleteCodes({ submissionId: id, daacs: removedDaacs });
    }

    // Generate a code for each daac to be assigned
    // eslint-disable-next-line
    for (const daacId of daacs) {
      await db.submission.createCode({ submissionId: id, daacID: daacId });
    }

    submission = await db.submission.findById({ id, user_id: user.id });

    // Send notification emails to the following
    // - the point of contact of the submission (form response),
    // - the assigned DAAC's Data Managers,

    const userIds = [];

    // Get the assigned DAAC's Data Managers Ids
    // eslint-disable-next-line
    for (const assignedDaac of submission.assigned_daacs) {
      const managerList = await db.user.getManagerIds({ daac_id: assignedDaac.daac_id });

      if (Array.isArray(managerList)) {
        managerList.forEach((entry) => userIds.push(entry.id));
      }
    }

    const pocRecipients = [];

    // Add the POC from the first form
    if (submission.form_data.dar_form_data_submission_poc_email) {
      pocRecipients.push({
        name: submission.form_data.dar_form_data_submission_poc_name
          ? submission.form_data.dar_form_data_submission_poc_name : '',
        email: submission.form_data.dar_form_data_submission_poc_email
      });
    }

    const eventMessage = {
      event_type: 'daac_assignment',
      submission_id: submission.id,
      conversation_id: submission.conversation_id,
      submission_name: submission.form_data.dar_form_project_name_info,
      step_name: submission.step_name,
      assigned_daacs: submission.assigned_daacs,
      ...(userIds.length > 0 && { userIds }),
      ...(pocRecipients.length > 0 && { additional_recipients: pocRecipients }),
      emailPayloadProvided: 'true'
    };

    await msg.sendEvent(eventMessage);
  }

  // Promote to the next workflow step
  const eventMessage = {
    event_type: 'workflow_promote_step',
    submission_id: submission.id,
    conversation_id: submission.conversation_id,
    workflow_id: submission.workflow_id,
    user_id: user.id,
    data: submission.step_data.data,
    step_name: submission.step_name
  };
  await msg.sendEvent(eventMessage);

  return db.submission.findById({ id, user_id: user.id });
}

async function esdisReviewMethod(event, user) {
  const approvedUserPrivileges = ['ADMIN'];
  const conditionalUserPrivileges = ['REQUEST_REVIEW_ESDIS'];
  const validWorkflowSteps = ['esdis_final_review'];
  const { id, action } = event;
  if (
    user.id?.includes('service-authorizer')
    || user.user_privileges.some((privilege) => approvedUserPrivileges.includes(privilege))
    || (user.user_privileges.some((privilege) => conditionalUserPrivileges.includes(privilege))
    && user.user_groups.some((group) => group.short_name === 'root_group'))
  ) {
    const status = await db.submission.getState({ id });
    if (!validWorkflowSteps.includes(status.step_name)) {
      return { error: 'Invalid workflow step. Unable to complete review.' };
    }
    let eventType;
    let param;
    let nextStep;
    if (action === 'reject') {
      eventType = 'review_rejected';
      nextStep = 'close';
    } else if (action === 'approve') {
      eventType = 'review_approved';
    } else if (action === 'reassign') {
      eventType = 'workflow_step_change';

      // reset any current review requirements (assignees) for the DAR review step
      const currentReviewers = await db.submission.getStepReviewApproval({ id });
      const userIds = currentReviewers.map((reviewer) => reviewer.edpuser_id);
      const deleteReviewStep = 'data_evaluation_request_form_review';

      // eslint-disable-next-line
      for (const userId of userIds) {
        const eventData = {
          submissionId: id,
          userIds: [userId],
          stepName: deleteReviewStep
        };
        await deleteStepReviewApprovalMethod(eventData, user);
      }

      // remove the currently assigned DAAC value
      await db.submission.updateDaac({ id, daac_id: null });

      // reset the current step to the DAAC Assignment Prompt step
      param = {
        id,
        step_name: 'daac_assignment'
      };
      await changeStepMethod(param, user);
    } else {
      return { error: 'Invalid review action' };
    }
    const eventMessage = {
      event_type: eventType,
      submission_id: id,
      conversation_id: status.conversation_id,
      workflow_id: status.workflow_id,
      user_id: user.id,
      data: status.step.data,
      step_name: status.step_name,
      ...(nextStep && { next_step: nextStep })
    };
    if (status.step.step_message) eventMessage.step_message = status.step.step_message;
    await msg.sendEvent(eventMessage);
    return db.submission.getState({ id });
  }
  return { error: 'Not Authorized' };
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
  esdisReview: esdisReviewMethod,
  resume: resumeMethod,
  lock: lockMethod,
  unlock: unlockMethod,
  withdraw: withdrawMethod,
  restore: restoreMethod,
  changeStep: changeStepMethod,
  promoteStep: promoteStepMethod,
  addContributors: addContributorsMethod,
  removeContributor: removeContributorMethod,
  copySubmission: copySubmissionMethod,
  getDetails: getDetailsMethod,
  mapMetadata: mapMetadataMethod,
  createStepReviewApproval: createStepReviewApprovalMethod,
  getStepReviewApproval: getStepReviewApprovalMethod,
  deleteStepReviewApproval: deleteStepReviewApprovalMethod,
  validateCode: validateCodeMethod,
  assignDaacs: assignDaacsMethod
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
