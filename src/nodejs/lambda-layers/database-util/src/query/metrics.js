const sql = require('./sql-builder.js');

const allFields = ['id',  'name', 'initiatior_edpuser_id', 'daac_id', 'contributor_ids', 'created_at', 'hidden', 'workflow_id', 'last_change', 'step_name', 'time_to_publish'];
const fieldMap = {
  id: 'submission.id',
  name: 'submission.name',
  initiatior_edpuser_id: 'submission.initiatior_edpuser_id',
  daac_id: 'submission.daac_id',
  contributor_ids: 'submission.contributor_ids',
  created_at: 'submission.created_at',
  hidden: 'submission.hidden',
  workflow_id: 'submission_status.workflow_id',
  last_change: 'submission_status.last_change',
  step_name: 'submission_status.step_name',
  time_to_publish: 'AGE(last_change, created_at) as time_to_publish'
};


const refs = {
  submission_status: {
    type: 'left_join',
    src: 'submission_status',
    on: {left: 'submission_status.id', right: 'submission.id'}
  },
  ueser_group:{
    type: 'left_join',
    src: 'edpuser_edpgroup',
    on: {left: 'edpuser_edpgroup.edpuser_id', right: 'edpuser.id'}
  },
  user_role:{
    type: 'left_join',
    src: 'edpuser_edprole',
    on: {left: 'edpuser_edprole.edpuser_id', right: 'edpuser.id'}
  },
  user_privilege:{
    type: 'left_join',
    src: 'edprole_privilege',
    on: {left: 'edprole_privilege.edprole_id', right: 'edpuser_edprole.edprole_id'}
  },
  submission_step: {
    type: 'left_join',
    src: 'submission',
    on: {left: 'submission.id', right: 'step_metric.submission_id'}
  },
  submission_metrics:{
    type: 'left_join',
    src: 'submission',
    on: {left: 'submission.id', right: 'submission_metrics.id'}
  },
  submission_status_metrics:{
    type: 'left_join',
    src: 'submission_status',
    on: {left: 'submission_status.id', right: 'submission_metrics.id'}
  },
  submission_reversion:{
    type: 'left_join',
    src: 'submission',
    on: {left: 'submission.id', right: 'submission_reversion_metrics.submission_id'}
  },
  submission_status_reversion:{
    type: 'left_join',
    src: 'submission_status',
    on: {left: 'submission_status.id', right: 'submission_metrics.submission_id'}
  }
}

const fields = (list) => list.map((field) => fieldMap[field]);

const findAll = () => `
SELECT * FROM metrics`;

const findById = () => `
${findAll()} WHERE metrics.id = {{id}}`;

const metricsFilter = () => `
${findAll()}`;

const metricsStats = () => `
 SELECT
  metrics.event->>'event_type' event_type,
  COUNT(metrics.event->>'event_type') count
FROM metrics GROUP BY metrics.event->>'event_type'`;

const putMetric = () => `
INSERT INTO metrics(event)
VALUES ({{$}}::JSONB)`;

const getUserCount = ( params ) => sql.select({
  fields: ['COUNT(DISTINCT edpuser.id) as count'],
  from: {
    base : 'edpuser',
    joins:[refs.ueser_group, refs.user_role, refs.user_privilege]
  },
  where:{
    filters: [
      ...(params.group_id ? [{field: 'edpuser_edpgroup.edpgroup_id', op: 'eq', param: "group_id"}] : []),
      ...(params.role_id ? [{field: 'edpuser_edprole.edprole_id', op: 'eq', param: "role_id"}] : []),
      ...(params.privilege ? [{field: 'edprole_privilege.privilege', op: 'eq', param: "privilege"}] : [])
    ]
  }
});

const getSubmissions = (params) => sql.select({
  fields: ['submission.*', 'submission_status.*', 'AGE(last_change, created_at) as time_to_publish'],
  from:{
    base: 'submission',
    joins: [refs.submission_status]
  },
  where:{
    filters: [
      ...(params.start_date ? [{field: 'submission.created_at', op: 'gte', param: "start_date"}] : []),
      ...(params.end_date ? [{field: 'submission.created_at', op: 'lte', param: "end_date"}] : []),
      ...(params.daac_id ? [{field: 'submission.daac_id', op: 'eq', param: "daac_id"}] : []),
      ...(params.workflow_id ? [{field: 'submission_status.workflow_id', op: 'eq', param: "workflow_id"}] : []),
      ...(params.submission_id ? [{field: 'submission.id', op: 'eq', param: "submission_id"}] : []),
      ...(params.state ? [
        ...(params.state === 'published' ? [{field: 'submission_status.step_name', op: 'eq', value: "'close'"}] : []),
        ...(params.state === 'in_progress' ? [{field: 'submission_status.step_name', op: 'ne', value: "'close'"}] : []),
        ...(params.state === 'in_progress' ? [{field: 'submission.hidden', op: 'ne', value: "TRUE"}] : []),
        ...(params.state === 'withdrawn' ? [{field: 'submission.hidden', op: 'eq', value: "TRUE"}] : [])
      ] : [])
    ]
  }
})

const getAverageTimeToPublish = (params) => `
  SELECT submission.daac_id, AVG(AGE(last_change, created_at)) as time_to_publish
  FROM submission 
  LEFT JOIN submission_status 
  ON submission_status.id = submission.id 
  WHERE  submission_status.step_name = 'close'
  GROUP BY submission.daac_id
`

const getStepMetrics = (params) => sql.select({
  fields: ['AVG(AGE(step_metrics.last_change, step_metrics.created_at)) as time_to_complete)'],
  from: {
    base: 'step_metrics',
    joins: [refs.submission]
  },
  where:{
    filters: [
      ...(params.daac_id ? [{field: 'submission.daac_id', op: 'eq', param: "daac_id"}] : []),
      ...(params.workflow_id ? [{field: 'step_metrics.workflow_id', op: 'eq', param: "workflow_id"}] : []),
      ...(params.submission_id ? [{field: 'step_metrics.submission_id', op: 'eq', param: "submission_id"}] : []),
    ]
  }
});

const getAdvSubmissionMetrics = (params) => sql.select({
  fields: ['submission_metrics.*'],
  from: {
    base: 'submission_metrics',
    joins: [refs.submission_metrics, refs.submission_status_metrics]
  },
  where: {
    filters:[
      ...(params.daac_id ? [{field: 'submission.daac_id', op: 'eq', param: "daac_id"}] : []),
      ...(params.workflow_id ? [{field: 'submission_status.workflow_id', op: 'eq', params: "workflow_id"}]: []),
      ...(params.submission_id ? [{field: 'submission_metrics.id', op: 'eq', param: "submission_id"}] : [])
    ]
  }
});

module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.metricsFilter = metricsFilter;
module.exports.metricsStats = metricsStats;
module.exports.putMetric = putMetric;
module.exports.getSubmissions = getSubmissions;
module.exports.getUserCount = getUserCount;
module.exports.getAverageTimeToPublish = getAverageTimeToPublish;
module.exports.getStepMetrics = getStepMetrics;
module.exports.getAdvSubmissionMetrics = getAdvSubmissionMetrics;
