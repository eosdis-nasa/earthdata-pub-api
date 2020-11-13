/**
 * Lambda that serves as the core component of the Workflow System. This lambda
 * processes incoming SNS messages, progresses the specified Submission to the
 * next step in its Workflow, and sends an SNS notification, and if needed an
 * SQS message to invoke an Action.
 * an SNS message to notify of successful completion.
 * @module WorkflowHandler
 * @see module:ActionHandler
 */

const PgAdapter = require('database-driver');

const MessageDriver = require('message-driver');

async function actionMethod(status) {
  const eventMessage = {
    event_type: 'action_request',
    action_id: status.action_id,
    submission_id: status.id,
    workflow_id: status.workflow_id,
    step_name: status.step_name,
    data: status.data
  };
  await MessageDriver.sendEvent(eventMessage);
}

async function formMethod(status) {
  const eventMessage = {
    event_type: 'form_request',
    form_id: status.form_id,
    submission_id: status.id,
    workflow_id: status.workflow_id,
    step_name: status.step_name,
    data: status.data
  };
  await MessageDriver.sendEvent(eventMessage);
}

async function reviewMethod(status) {
  const eventMessage = {
    event_type: 'review_request',
    submission_id: status.id,
    workflow_id: status.workflow_id,
    step_name: status.step_name,
    data: status.data
  };
  await MessageDriver.sendEvent(eventMessage);
}

async function serviceMethod(status) {
  const eventMessage = {
    event_type: 'service_call',
    service_id: status.service_id,
    submission_id: status.id,
    workflow_id: status.workflow_id,
    step_name: status.step_name,
    data: status.data
  };
  await MessageDriver.sendEvent(eventMessage);
}

async function closeMethod(status) {
  const eventMessage = {
    event_type: 'workflow_completed',
    submission_id: status.id,
    workflow_id: status.workflow_id,
    step_name: status.step_name,
    data: status.data
  };
  await MessageDriver.sendEvent(eventMessage);
}

const stepMethods = {
  action: actionMethod,
  form: formMethod,
  review: reviewMethod,
  service: serviceMethod,
  close: closeMethod
};

async function processRecord(record) {
  const { eventMessage } = MessageDriver.parseRecord(record);
  const { submission_id: id } = eventMessage;
  await PgAdapter.execute({ resource: 'submission', operation: 'promoteStep' },
    { submission: { id } });
  const status = await PgAdapter.execute({ resource: 'submission', operation: 'getState' },
    { submission: { id } });
  const method = stepMethods[status.type];
  await method(status);
}

async function handler(event) {
  const records = event.Records;
  const promises = records.map((record) => processRecord(record));
  await Promise.all(promises);
  return {
    statusCode: 200
  };
}

exports.handler = handler;
