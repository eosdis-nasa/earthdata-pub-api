/**
 * Lambda that exposes Workflow API to AWS API Gateway. This lambda
 * is used for handling workflow tasks like editing workflows.
 * @module Workflow
 * @see module:WorkflowHandler
 */

const db = require('database-util');

async function createStep(step, stepName, rollbackInfo) {
  return db.workflow.createStep({
    step_name: stepName,
    type: step.type,
    step_status_label: step.step_status_label,
    action_id: step.action_id,
    form_id: step.form_id,
    service_id: step.service_id,
    data: rollbackInfo
  });
}

async function addSteps(steps, workflowId) {
  const STEP_MAX = 100;
  let activeStepName = 'init';
  let activeStep = steps[activeStepName];
  let i = 0;

  while (activeStep.next_step_name) {
    const nextStepName = activeStep.next_step_name;
    const nextStep = steps[nextStepName];

    if (nextStepName !== 'close') {
      if (
        (i > STEP_MAX)
        || (!nextStepName)
        || (!nextStep)
      ) { return false; }

      const nextStepRollbackInfo = {
        rollback: activeStepName,
        type: activeStep.type,
        form_id: activeStep.form_id
      };
      await createStep(steps[nextStepName], nextStepName, nextStepRollbackInfo);

      i += 1;
    }
    await db.workflow.addStep({
      workflow_id: workflowId,
      step_name: activeStepName,
      next_step_name: nextStepName,
      step_message: activeStep.step_message
    });

    activeStepName = nextStepName;
    activeStep = nextStep;
  }
  return true;
}

async function createWorkflowMethod(params, user) {
  const {
    short_name: shortName, version, long_name: longName, description, steps
  } = params;
  const approvedUserPrivileges = ['ADMIN', 'WORKFLOW_CREATE'];

  if (user.user_privileges.some((privilege) => approvedUserPrivileges.includes(privilege))) {
    const { id } = await db.workflow.initialize({
      short_name: shortName, version, long_name: longName, description
    });
    if (!await addSteps(steps, id)) {
      await db.workflow.clearSteps({ id });
      await db.workflow.deleteWorkflow({ id });
      return ({ status: 'Invalid Workflow' });
    }
    await db.workflow.addClose({ workflow_id: id });

    return (db.workflow.findById({ id }));
  }

  return ({ status: 'Invalid Permissions' });
}

async function editWorkflowMethod(params, user) {
  const {
    id, version, description, steps
  } = params;

  const approvedUserPrivileges = ['ADMIN'];
  if (user.user_privileges.some((privilege) => approvedUserPrivileges.includes(privilege))) {
    const { steps: oldSteps } = await db.workflow.findById({ id });
    await db.workflow.clearSteps({ id });
    if (!await addSteps(steps, id)) {
      await db.workflow.clearSteps({ id });
      await addSteps(oldSteps, id);
      return (db.workflow.findById({ id }));
    }
    await db.workflow.addClose({ workflow_id: id });
    return (db.workflow.updateWorkflowMetaData({
      version,
      description,
      id
    }));
  }
  return ({ status: 'Invalid Permissions' });
}

async function createNewStep(params, user) {
  const approvedUserPrivileges = ['ADMIN', 'WORKFLOW_CREATE'];

  if (user.user_privileges.some((privilege) => approvedUserPrivileges.includes(privilege))) {
    const result = await db.step.create(params);
    return result;
  }
  return { status: 'Invalid Permissions' };
}

async function stepFindAll(params, user) {
  const approvedUserPrivileges = ['ADMIN', 'WORKFLOW_CREATE'];

  if (user.user_privileges.some((privilege) => approvedUserPrivileges.includes(privilege))) {
    const result = await db.step.findAll(params);
    return result;
  }
  return { status: 'Invalid Permissions' };
}

async function stepFindById(params, user) {
  const approvedUserPrivileges = ['ADMIN', 'WORKFLOW_CREATE'];

  if (user.user_privileges.some((privilege) => approvedUserPrivileges.includes(privilege))) {
    const result = await db.step.findById(params);
    return result;
  }
  return { status: 'Invalid Permissions' };
}

const operations = {
  editWorkflow: editWorkflowMethod,
  createWorkflow: createWorkflowMethod,
  createStep: createNewStep,
  stepFindAll,
  stepFindById
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
