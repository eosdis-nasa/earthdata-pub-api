/**
 * Lambda that exposes Workflow API to AWS API Gateway. This lambda
 * is used for handling workflow tasks like editing workflows.
 * @module Workflow
 * @see module:WorkflowHandler
 */

const db = require('database-util');

function validateWorkflow(steps) {
  let i = 0;
  let activeStep = steps.init;
  while (activeStep.next_step_name !== 'close') {
    if (
      (i > 100)
      || (!activeStep.next_step_name)
      // eslint-disable-next-line
      || (!(activeStep = steps[activeStep.next_step_name]))
    ) { return false; }
    i += 1;
  }
  return true;
}

async function createStep(step, stepName) {
  const type = step.type ? step.type : null;
  const actionId = step.actionId ? step.actionId : null;
  const formId = step.formId ? step.formId : null;
  const serviceId = step.service_id ? step.service_id : null;
  const data = step.prev_step ? step.prev_step : null;
  await db.workflow.createStep({
    step_name: stepName,
    type,
    action_id: actionId,
    form_id: formId,
    service_id: serviceId,
    data
  });
}
// eslint-disable-next-line
async function addSteps(steps, workflow_id) {
  let activeStepName = 'init';
  let activeStep = steps[activeStepName];
  while (activeStep.next_step_name) {
    const nextStepName = activeStep.next_step_name;
    if(nextStepName !== 'close'){await createStep(steps[nextStepName], nextStepName);}
    await db.workflow.addStep({
      workflow_id,
      step_name: activeStepName,
      next_step_name: nextStepName
    });
    activeStep = steps[activeStepName = activeStep.next_step_name];
  }
}

async function createWorkflowMethod(params, user) {
  const {
    // eslint-disable-next-line
    short_name, version, long_name, description, steps
  } = params;

  if (user.user_roles.some((role) => approvedUserRoles.includes(role.short_name))) {
    if (!validateWorkflow(steps)) { return ({ status: 'Invalid Workflow' }); }
    const { id } = await db.workflow.initialize({
      short_name, version, long_name, description
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
