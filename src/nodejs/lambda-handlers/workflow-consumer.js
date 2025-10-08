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

const uuid = require('uuid');
const {
  GetSecretValueCommand,
  SecretsManagerClient
} = require('@aws-sdk/client-secrets-manager');

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
  if (status.step.step_message) eventMessage.step_message = status.step.step_message;
  Object.keys(eventMessage).forEach((key) => (
    eventMessage[key] === undefined && delete eventMessage[key]));
  await msg.sendEvent(eventMessage);
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
  if (status.step.step_message) eventMessage.step_message = status.step.step_message;
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
  if (status.step.step_message) eventMessage.step_message = status.step.step_message;
  await msg.sendEvent(eventMessage);
}

async function getServiceAuthSecret(secretName) {
  const client = new SecretsManagerClient();
  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: secretName
    })
  );
  return response.SecretString;
}

async function sendSecret(service, submissionSecret, submissionId) {
  const response = await fetch(service.endpoint, {
    method: service.method,
    headers: service.headers,
    body: JSON.stringify({ ...service.payload, ...{ submissionId, submissionSecret } })
  });
  if (response.ok) return response.text();
  throw new Error(`Error Sending Submission Secret:\n\nResponse Status Code: ${response.status}\nResponse Text: ${await response.text()}`);
}

async function serviceMethod(status) {
  const service = await db.service.findById({ id: status.step.service_id });
  const submissionSecret = uuid.v4();
  await db.service.createSecret({
    id: service.id,
    secret: submissionSecret,
    submission_id: status.id
  });
  const headersAuthKey = Object.keys(service.headers).find((key) => key.toLowerCase() === 'authorization');
  if (headersAuthKey) {
    service.headers[headersAuthKey] = await getServiceAuthSecret(service.headers[headersAuthKey]);
  }
  if (process.env.DEBUG === 'true') {
    // eslint-disable-next-line
    console.debug('Service Secret Info - SubmissionId: ', status.id, ' SubmissionSecret: ', submissionSecret);
  }
  await sendSecret(service, submissionSecret, status.id);
  const eventMessage = {
    event_type: 'service_call',
    service_id: status.step.service_id,
    submission_id: status.id,
    conversation_id: status.conversation_id,
    workflow_id: status.workflow_id,
    step_name: status.step.name,
    data: status.step.data
  };
  if (status.step.step_message) eventMessage.step_message = status.step.step_message;
  await msg.sendEvent(eventMessage);
  // eslint-disable-next-line no-use-before-define
  await promoteStepMethod(eventMessage);
}

async function uploadMethod(status) {
  const eventMessage = {
    event_type: 'upload_step_completed',
    submission_id: status.id,
    conversation_id: status.conversation_id,
    workflow_id: status.workflow_id,
    step_name: status.step.name,
    data: status.step.data
  };
  if (status.step.step_message) eventMessage.step_message = status.step.step_message;
  await msg.sendEvent(eventMessage);
}

async function closeMethod(status) {
  await db.service.deleteSubmissionSecrets({ submissionId: status.id });
  const submissionMetrics = await db.metrics.getSubmissions({
    submissionId: status.id
  });
  const eventMessage = {
    event_type: 'workflow_completed',
    submission_id: status.id,
    conversation_id: status.conversation_id,
    workflow_id: status.workflow_id,
    step_name: status.step.name,
    data: status.step.data,
    time_to_publish: Math.round(submissionMetrics[0].time_to_publish)
  };
  if (status.step.step_message) eventMessage.step_message = status.step.step_message;
  await msg.sendEvent(eventMessage);
}

const stepMethods = {
  action: actionMethod,
  form: formMethod,
  review: reviewMethod,
  service: serviceMethod,
  upload: uploadMethod,
  close: closeMethod
};

async function promoteStepMethod(eventMessage) {
  const { submission_id: id } = eventMessage;
  await db.submission.promoteStep({ id });
  const status = await db.submission.getState({ id });
  if (!(status.step_name === 'close')) {
    await db.metrics.setStepStartTime({
      step_name: status.step_name,
      submission_id: id,
      workflow_id: status.workflow_id
    });
  }
  if (!['init', 'close'].includes(eventMessage.step_name)) {
    await db.metrics.setStepStopTime({
      step_name: eventMessage.step_name,
      submission_id: id
    });
  }
  const method = stepMethods[status.step.type];
  await method(status);
}

async function workflowStartedMethod(eventMessage) {
  const status = await db.submission.getState({ id: eventMessage.submission_id });
  const method = stepMethods[status.step.type];
  await method(status);
}

async function requestInitializedMethod(eventMessage) {
  const newEvent = { ...eventMessage, event_type: 'workflow_promote_step_direct' };
  await promoteStepMethod(eventMessage);
  await msg.sendEvent(newEvent);
}

async function formSubmittedMethod(eventMessage) {
  const { submission_id: id, form_id: formId, user_id: userId } = eventMessage;
  const status = await db.submission.getState({ id });
  if (status.step.type === 'form' && status.step.form_id === formId) {
    await promoteStepMethod(eventMessage);
    const newEvent = {
      event_type: 'workflow_promote_step_direct',
      submission_id: status.id,
      conversation_id: status.conversation_id,
      workflow_id: status.workflow_id,
      step_name: status.step.name,
      user_id: userId
    };
    if (status.step.step_message) newEvent.step_message = status.step.step_message;
    await msg.sendEvent(newEvent);
  }
}

async function reviewApprovedMethod(eventMessage) {
  const param = { submission_id: eventMessage.submission_id, step_name: eventMessage.step_name };
  const stepReview = await db.submission.checkCountStepReviewApproved(param);
  // if unapproved is 0 means all assigned users have approved the form
  if (stepReview.unapproved && parseInt(stepReview.unapproved, 10) === 0) {
    const newEvent = { ...eventMessage, event_type: 'workflow_promote_step_direct' };
    if (eventMessage.step_name === 'data_evaluation_request_form_review') {
      await db.metrics.setAccessionReversion({
        id: eventMessage.submission_id,
        status: 'FALSE'
      });
    }
    await promoteStepMethod(eventMessage);
    await msg.sendEvent(newEvent);
  }
}

async function reviewRejectedMethod(eventMessage) {
  const {
    submission_id: id,
    step_name: stepName,
    user_id: userId,
    next_step: nextStep
  } = eventMessage;
  // Did this because of lint error. This line has a length of 104. Maximum allowed is 100
  const stepReview = await db.submission.checkCountStepReviewRejected({
    submission_id: id, step_name: stepName, user_id: userId
  });
  if (stepReview.unapproved && parseInt(stepReview.unapproved, 10) === 0) {
    if (eventMessage.step_name === 'data_evaluation_request_form_review') {
      await db.metrics.setAccessionReversion({
        id: eventMessage.submission_id,
        status: 'TRUE'
      });
    }
    if (typeof nextStep !== 'undefined') {
      const validStep = await db.submission.checkWorkflow({ step_name: nextStep, id });
      if (validStep.step_name || nextStep === 'close') {
        await db.submission.setStep({ id, step_name: nextStep });

        if (nextStep === 'close') {
          const status = await db.submission.getState({ id });
          const method = stepMethods[nextStep];
          await method(status);
        }
      }
    } else {
      await db.submission.rollback({ id, step_name: stepName });
    }
  }
}

const eventMethods = {
  workflow_promote_step: promoteStepMethod,
  workflow_started: workflowStartedMethod,
  request_initialized: requestInitializedMethod,
  form_submitted: formSubmittedMethod,
  review_approved: reviewApprovedMethod,
  review_rejected: reviewRejectedMethod
};

async function processRecord(record) {
  const { eventMessage } = msg.parseRecord(record);
  const method = eventMethods[eventMessage.event_type];
  await method(eventMessage);
}

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const records = event.Records;
  const promises = records.map((record) => processRecord(record));
  await Promise.all(promises);
  return {
    statusCode: 200
  };
}

exports.handler = handler;
