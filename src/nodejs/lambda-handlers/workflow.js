/**
 * Lambda that exposes User API to AWS API Gateway. This lambda
 * is used for handling workflow tasks like editing workflows.
 * @module Workflow
 * @see module:WorkflowHandler
 */

const db = require('database-util');

async function editWorkflowMethod(params, user) {
  const { workflow } = params;
  const workflowId = workflow.id;
  let activeStepName = 'init';
  let activeStep = workflow.steps[activeStepName];
  const approvedUserRoles = ['admin'];
  if (user.user_roles.some((role) => approvedUserRoles.includes(role.short_name))) {
    await db.workflow.clearSteps({ id: workflowId });
    while (activeStep.next_step_name) {
      const nextStepName = activeStep.next_step_name;
      await db.workflow.addStep({
        workflow_id: workflowId,
        step_name: activeStepName,
        next_step_name: nextStepName
      });
      activeStep = workflow.steps[activeStepName = activeStep.next_step_name];
    }
    await db.workflow.addClose({ workflow_id: workflowId });
    return (db.workflow.updateWorkflowMetaData({
      version: workflow.version,
      description: workflow.description,
      id: workflowId
    }));
  }
  return ({ status: 'Invalid Permissions' });
}
const operations = {
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
