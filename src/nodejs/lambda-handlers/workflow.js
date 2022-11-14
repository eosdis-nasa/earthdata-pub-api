/**
 * Lambda that exposes Workflow API to AWS API Gateway. This lambda
 * is used for handling workflow tasks like editing workflows.
 * @module Workflow
 * @see module:WorkflowHandler
 */

const db = require('database-util');

async function findByIdMethod({ params }) {
  const { id } = params;
  return db.workflow.findById(id);
}

async function editWorkflowMethod(params, user) {
  const {
    id, version, description, steps
  } = params;
  let activeStepName = 'init';
  let activeStep = steps[activeStepName];
  const approvedUserRoles = ['admin'];
  if (user.user_roles.some((role) => approvedUserRoles.includes(role.short_name))) {
    await db.workflow.clearSteps({ id });
    while (activeStep.next_step_name) {
      const nextStepName = activeStep.next_step_name;
      await db.workflow.addStep({
        workflow_id: id,
        step_name: activeStepName,
        next_step_name: nextStepName
      });
      activeStep = steps[activeStepName = activeStep.next_step_name];
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

const operations = {
  findById: findByIdMethod,
  editWorkflow: editWorkflowMethod
};

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const user = await db.user.findById({ id: event.context.user_id });
  const operation = operations[event.operation];
  const params = event.params.payload;
  const data = await operation(params, user);
  return data;
}

exports.handler = handler;
