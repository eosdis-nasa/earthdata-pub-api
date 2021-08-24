/**
 * Lambda to post metrics from client such as errors
 * @module Data
 */

const path = require('path');

const { S3 } = require('aws-sdk');

const db = require('database-util');

const msg = require('message-util');

const bucket = process.env.METRICS_BUCKET;

const region = process.env.REGION;

const s3 = new S3({ region });

async function getReport({ key }) {
  const params = { Bucket: bucket, Key: `${key}.png` };
  const data = await s3.getObject(params).promise();
  return { image: `data:image/png;base64,${data.Body.toString('base64')}` };
}

async function listReports() {
  const list = await s3.listObjectsV2({ Bucket: bucket }).promise();
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

const operations = {
  search,
  put,
  get_report: getReport,
  list_reports: listReports
};

async function handler(event) {
  console.info(`[EVENT]\n${JSON.stringify(event)}`);
  const { operation } = event;
  const data = await operations[operation](event);
  return data;
}

module.exports.handler = handler;
