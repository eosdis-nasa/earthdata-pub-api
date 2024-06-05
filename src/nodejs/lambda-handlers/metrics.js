/**
 * Lambda to post metrics from client such as errors
 * @module Data
 */

const path = require('path');
const { S3 } = require('@aws-sdk/client-s3');
const db = require('database-util');
const msg = require('message-util');

const bucket = process.env.METRICS_BUCKET;
const region = process.env.REGION;

const s3 = new S3({ region });

async function getReport({ key }) {
  const params = { Bucket: bucket, Key: `${key}.png` };
  try {
    const data = await s3.getObject(params);
    return { image: `data:image/png;base64,${data.Body.toString('base64')}` };
  } catch (err) {
    console.error(`Error getting report for key ${key}:`, err);
    return { error: 'Error getting report' };
  }
}

async function listReports() {
  try {
    const list = await s3.listObjectsV2({ Bucket: bucket });
    const keys = list.Contents.map((object) => path.parse(object.Key).name);
    return keys;
  } catch (err) {
    console.error('Error listing reports:', err);
    return { error: 'Error listing reports' };
  }
}

async function search({ filter }) {
  if (filter.count) {
    const response = await db.metrics.metricsStats();
    return response;
  }
  return { message: 'Not Implemented' };
}

async function put({ payload, context }) {
  const eventMessage = {
    event_type: 'client_event',
    user_id: context.user_id,
    ...(payload.action_id && { action_id: payload.action_id }),
    ...(payload.conversation_id && { conversation_id: payload.conversation_id }),
    ...(payload.daac_id && { daac_id: payload.daac_id }),
    ...(payload.form_id && { form_id: payload.form_id }),
    ...(payload.group_id && { group_id: payload.group_id }),
    ...(payload.question_id && { question_id: payload.question_id }),
    ...(payload.role_id && { role_id: payload.role_id }),
    ...(payload.service_id && { service_id: payload.service_id }),
    ...(payload.submission_id && { submission_id: payload.submission_id }),
    ...(payload.workflow_id && { workflow_id: payload.workflow_id }),
    ...(payload.data && { data: payload.data })
  };
  await msg.sendEvent(eventMessage);
  return { message: 'Success!' };
}

async function getSubmissions({ payload, context }) {
  // gets using information and checks for minimum permissions
  const { user_id: userId } = context;
  const user = await db.user.findById({ id: userId });
  if (!(user.user_privileges.includes('ADMIN') || user.user_privileges.includes('REQUEST_DAACREAD'))) {
    return { message: 'Invalid Permissions' };
  }
  // convers user groups to daacs for more granular permissions
  const userGroupIds = user.user_groups.map((group) => group.id);
  const userDaac = (await db.daac.getIds({ group_ids: userGroupIds }))
    .map((daac) => daac.id);

  // parses the payload for filters and sets up variables
  const {
    start_date: startDate, end_date: endDate, daac_id: reqDaacId, workflow_id: workflowId,
    submission_id: submissionId, role_id: roleId, accession_rejected: accessionRejected,
    privilege, metric, state
  } = payload;
  let daacIds;
  let userCount;
  let timeToPublish;
  let stepMetrics;
  let submissions;
  const rootGroupId = '4daa6b22-f015-4ce2-8dac-8b3510004fca';
  const zeroUUID = '00000000-0000-0000-0000-000000000000';// exits to prevent non admin users from seeing all daacs

  // Establishes daac level permissions
  if (!(user.user_privileges.includes('ADMIN') || userGroupIds.includes(rootGroupId))) {
    if (reqDaacId) {
      daacIds = [zeroUUID, ...(userDaac.filter((daacId) => daacId === reqDaacId))];
    } else {
      daacIds = [zeroUUID, ...userDaac];
    }
  } else {
    daacIds = reqDaacId ? [reqDaacId] : null;
  }

  // queries for user count if needed bassed on filters
  if ((!metric || metric?.includes('user_count'))
    && !(startDate || endDate || workflowId || submissionId || accessionRejected || state)) {
    userCount = (await db.metrics.getUserCount({
      daac_ids: daacIds,
      role_id: roleId,
      privilege
    })).count;
  }
  // queries for average time to publish if needed bassed on filters
  if ((!metric || metric?.includes('submission'))
    && !(workflowId || submissionId || accessionRejected || state)) {
    timeToPublish = await db.metrics.getAverageTimeToPublish({
      ...startDate ? { start_date: startDate } : {},
      ...endDate ? { end_date: endDate } : {},
      ...daacIds ? { daac_ids: daacIds } : {}
    });
  }
  // queries for step metrics if needed bassed on filters
  if ((!metric || metric?.includes('step_metrics'))
    && !(roleId || privilege || metric || state || accessionRejected)) {
    stepMetrics = await db.metrics.getStepMetrics({
      ...startDate ? { start_date: startDate } : {},
      ...endDate ? { end_date: endDate } : {},
      ...daacIds ? { daac_ids: daacIds } : {},
      ...workflowId ? { workflow_id: workflowId } : {},
      ...submissionId ? { submission_id: submissionId } : {}
    });
  }
  // queries for submission metrics if needed bassed on filters
  if ((!metric || metric?.includes('submission'))
    && !(roleId || privilege)) {
    submissions = await db.metrics.getSubmissions({
      ...startDate ? { start_date: startDate } : {},
      ...endDate ? { end_date: endDate } : {},
      ...daacIds ? { daac_ids: daacIds } : {},
      ...workflowId ? { workflow_id: workflowId } : {},
      ...submissionId ? { submission_id: submissionId } : {},
      ...accessionRejected ? { accession_rejected: accessionRejected } : {},
      ...state ? { state } : {}
    });
  }
  // builds response object bassed on what was queried
  const resp = {
    ...submissions ? { submission_count: submissions.length } : {},
    ...submissions ? { submissions } : {},
    ...timeToPublish ? { avg_time_to_publish: timeToPublish } : {},
    ...userCount ? { user_count: userCount } : {},
    ...stepMetrics ? { step_metrics: stepMetrics } : {}
  };
  return resp;
}

async function getDaacs() {
  const daacs = await db.daac.getActiveDaacs();
  const resp = { daac_count: daacs.length, daacs };
  return resp;
}

const operations = {
  search,
  put,
  get_report: getReport,
  list_reports: listReports,
  get_submissions: getSubmissions,
  get_daacs: getDaacs
};

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const { operation } = event;
  const data = await operations[operation](event);
  return data;
}

module.exports.handler = handler;
