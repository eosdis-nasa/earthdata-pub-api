/**
 * Lambda that exposes Workflow API to AWS API Gateway. This lambda
 * is used for handling workflow tasks like editing workflows.
 * @module Workflow
 * @see module:WorkflowHandler
 */

const db = require('database-util');

function validateWorkflow(steps) {
  const STEP_MAX = 100;
  let i = 0;
  let activeStep = steps.init;
  while (activeStep.next_step_name !== 'close') {
    const nextStepName = activeStep.next_step_name;
    const nextStep = steps[activeStep.next_step_name];
    if (
      (i > STEP_MAX)
      || (!nextStepName)
      || (!nextStep)
    ) { return false; }
    i += 1;
    activeStep = nextStep;
  }
  return true;
}

async function createStep(step, stepName) {
  const output = await db.workflow.createStep({
    step_name: stepName,
    type: step.type,
    action_id: step.action_id,
    form_id: step.form_id,
    service_id: step.service_id,
    data: step.prev_step
  });
  console.log(output)
}

async function addSteps(steps, workflowId) {
  let activeStepName = 'init';
  let activeStep = steps[activeStepName];
  while (activeStep.next_step_name) {
    const nextStepName = activeStep.next_step_name;
    if (nextStepName !== 'close') { await createStep(steps[nextStepName], nextStepName); }
    await db.workflow.addStep({
      workflow_id: workflowId,
      step_name: activeStepName,
      next_step_name: nextStepName
    });
    activeStepName = activeStep.next_step_name;
    activeStep = steps[activeStepName];
  }
}

async function createWorkflowMethod(params, user) {
  const {
    short_name: shortName, version, long_name: longName, description, steps
  } = params;
  const approvedUserRoles = ['admin'];

  if (user.user_roles.some((role) => approvedUserRoles.includes(role.short_name))) {
    if (!validateWorkflow(steps)) { return ({ status: 'Invalid Workflow' }); }
    const { id } = await db.workflow.initialize({
      short_name: shortName, version, long_name: longName, description
    });
    await addSteps(steps, id);
    await db.workflow.addClose({ workflow_id: id });

    return (db.workflow.findById({ id }));
  }

  return ({ status: 'Invalid Permissions' });
}

async function editWorkflowMethod(params, user) {
  const {
    id, version, description, steps
  } = params;

  const approvedUserRoles = ['admin'];
  if (user.user_roles.some((role) => approvedUserRoles.includes(role.short_name))) {
    if (!validateWorkflow(steps)) { return ({ status: 'Invalid Workflow' }); }

    await db.workflow.clearSteps({ id });
    await addSteps(steps, id);
    await db.workflow.addClose({ workflow_id: id });
    return (db.workflow.updateWorkflowMetaData({
      version,
      description,
      id
    }));
  }
  return ({ status: 'Invalid Permissions' });
}

const operations = {
  editWorkflow: editWorkflowMethod,
  createWorkflow: createWorkflowMethod
};

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const user = await db.user.findById({ id: event.context.user_id });
  const operation = operations[event.operation];
  const { params } = event;
  const data = await operation(params, user);
  return data;
}

exports.handler = handler;
