/**
 * Lambda that exposes form API endpoints to the AWS API Gateway. This lambda
 * is used for fetching and updating user generated versioned databased entries
 * in the following tables:
 * Form, Section, Question, Input
 * @module Data
 */

const db = require('database-util');

const msg = require('message-util');

const formEditPerms = { privilege: ['ADMIN', 'FORM_UPDATE'] };

async function hasPerms(uid, perms) {
  const userInfo = await db.user.findById({ id: uid });
  if (userInfo.user_privileges.some((privilege) => perms.privilege.includes(privilege))) {
    return true;
  }
  return false;
}

async function editSection({ params, context }) {
    
    if (hasPerms(context.user_id, formEditPerms)){ 
      const response = await db.section.createSection(params);
      return response;
    }
    return { error: 'Not Authorized' };
  }

const operations = {
  editSection
};

async function handler(event) {
    console.info(`[EVENT]\n${JSON.stringify(event)}`);
    const operation = operations[event.operation];
    const data = await operation(event);
    return data;
  }

module.exports.handler = handler;
