/**
 * Lambda that exposes form API endpoints to the AWS API Gateway. This lambda
 * is used for fetching and updating user generated versioned databased entries
 * in the following tables:
 * Form, Section, Question, Input
 * @module Form
 */

const db = require('database-util');

async function hasPerms(uid, perms) {
  const userInfo = await db.user.findById({ id: uid });
  if (userInfo.user_privileges.some((privilege) => perms.includes(privilege))) {
    return true;
  }
  return false;
}

async function editSection({ params, context }) {
  if (await hasPerms(context.user_id, ['ADMIN', 'FORM_UPDATE'])) {
    const response = await db.section.createSection(params);
    return response;
  }
  return { error: 'Not Authorized' };
}

async function addSection({ params, context }) {
  if (await hasPerms(context.user_id, ['ADMIN', 'FORM_UPDATE'])) {
    const response = await db.section.createSection(params);
    return response;
  }
  return { error: 'Not Authorized' };
}

async function createForm({ params, context }) {
  if (await hasPerms(context.user_id, ['ADMIN', 'FORM_CREATE'])) {
    params.privileged_user = true;
  }
  return db.form.createForm(params);
}

async function updateForm({ params, context }) {
  if (await hasPerms(context.user_id, ['ADMIN', 'FORM_UPDATE'])) {
    params.privileged_user = true;
  }
  return db.form.updateForm(params);
}

async function formFindById({ params, form_id: formId, context }) {
  params.id = formId;
  if (await hasPerms(context.user_id, ['ADMIN', 'DAAC_READ'])) {
    params.privileged_user = true;
  }
  return db.form.findById(params);
}

async function formFindAll({ params, context }) {
  if (await hasPerms(context.user_id, ['ADMIN', 'DAAC_READ'])) {
    params.privileged_user = true;
  }
  return db.form.findAll(params);
}

const operations = {
  editSection,
  addSection,
  createForm,
  updateForm,
  formFindById,
  formFindAll
};

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const operation = operations[event.operation];
  const data = await operation(event);
  return data;
}

module.exports.handler = handler;
