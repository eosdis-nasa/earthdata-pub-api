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
  const data = await s3.getObject(params);
  return { image: `data:image/png;base64,${data.Body.toString('base64')}` };
}

async function listReports() {
  const list = await s3.listObjectsV2({ Bucket: bucket });
  const keys = list.Contents.map((object) => path.parse(object.Key).name);
  return keys;
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
  const { user_id: userId} = context;

  const user =  await db.user.findById({ id: null });
  console.log(user);
  const groupIds = user.user_groups.map((group) => group.id);
  const userDaac = (await db.daac.getIds({ group_ids: groupIds }))
    .map((daac) => daac.id);

  const {
    start_date: startDate, end_date: endDate, daac_id: reqDaacId, workflow_id: workflowId,
    submission_id: submissionId, role_id: roleId, privilege, metric, state
  } = payload;
  let daacIds;
  let userCount;
  let timeToPublish;
  const zeroUUID = '00000000-0000-0000-0000-000000000000';

  if (!user.user_privileges.includes('ADMIN')) {
    if(reqDaacId) {
      daacIds = [zeroUUID, ...(userDaac.filter((daacId) => daacId === reqDaacId))];
    } else {
      daacIds = [zeroUUID, ...userDaac];
    }
    console.log('here')
  }else{
    daacIds = reqDaacId? [reqDaacId] : null;
  }
  console.log(daacIds);

  if (metric === 'user_count' || (Object.keys(payload).length === 0)) {
    //needs group filter logic.
    userCount = (await db.metrics.getUserCount({
      daac_ids: daacIds,
      role_id: roleId,
      privilege
    })).count;
  }
  if (((metric === 'time_to_publish' || (Object.keys(payload).length === 0)) && !(
    daacIds || workflowId || submissionId))
    || (Object.keys(payload).length === 0)) {
      //add daac logic
    timeToPublish = await db.metrics.getAverageTimeToPublish({});
  }
  const submissions = await db.metrics.getSubmissions({
    ...startDate ? { start_date: startDate } : {},
    ...endDate ? { end_date: endDate } : {},
    ...daacIds ? { daac_ids: daacIds } : {},
    ...workflowId ? { workflow_id: workflowId } : {},
    ...submissionId ? { submission_id: submissionId } : {},
    ...state ? { state } : {}
  });

  const resp = {
    ...submissions ? { submission_count: submissions.length } : {},
    ...submissions ? { submissions } : {},
    ...userCount ? { user_count: userCount } : {},
    ...timeToPublish ? { avg_time_to_publish: timeToPublish } : {}
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
