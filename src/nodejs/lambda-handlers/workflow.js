/**
 * Lambda that exposes User API to AWS API Gateway. This lambda
 * is used for handling workflow tasks like editing workflows.
 * @module Workflow
 * @see module:WorkflowHandler
 */

const db = require('database-util');
const { CognitoIdentityServiceProvider } = require('aws-sdk');

const idp = new CognitoIdentityServiceProvider({ region: process.env.REGION });
const userPoolId = process.env.CUP_ID;
const dev = process.env.DEVELOPMENT || false;

async function editWorkflowMethod(params, user){
    const { workflow } = params
    const { workflow_id } = workflow
    var activeStep = workflow.steps.init
    const approvedUserRoles = ['admin'];
    if (user.user_roles.some((role) => approvedUserRoles.includes(role.short_name))) {
        await db.workflow.clearSteps({ id:workflow_id })
        while (activeStep.next_step_name){
            const { step_name, next_step_name } = activeStep
            await db.workflow.addStep({ workflow_id, step_name, next_step_name })
        }
        db.workflow.addClose({ workflow_id })
    }
}

const operations = {
    edit_Workflow: editWorkflowMethod
  };
  
async function handler(event) {
    console.info(`[EVENT]\n${JSON.stringify(event)}`);
    const user = await db.user.findById({ id: event.context.user_id });
    const operation = operations[event.operation];
    const data = await operation(event, user);
    return data;
}
  
  exports.handler = handler;