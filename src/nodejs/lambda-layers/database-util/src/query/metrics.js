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
  user_daac:{
    type: 'left_join',
    src: 'daac',
    on: {left: 'daac.edpgroup_id', right: 'edpuser_edpgroup.edpgroup_id'}
  },
  submission_step: {
    type: 'left_join',
    src: 'submission',
    on: {left: 'submission.id', right: 'step_metric.submission_id'}
  },
  submission_metrics: {
    type: 'left_join',
    src: 'submission_metrics',
    on: {left: 'submission_metrics.id', right: 'submission.id'}
  }
}

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
    joins:[refs.ueser_group, refs.user_role, refs.user_privilege, refs.user_daac]
  },
  where:{
    filters: [
      ...(params.daac_ids ? [{cmd: `daac.id = ANY(ARRAY[\'${params.daac_ids.join('\',\'')}\']::UUID[])`}] : []),
      ...(params.role_id ? [{field: 'edpuser_edprole.edprole_id', op: 'eq', param: "role_id"}] : []),
      ...(params.privilege ? [{field: 'edprole_privilege.privilege', op: 'eq', param: "privilege"}] : [])
    ]
  }
});

const getSubmissions = (params) => sql.select({
  fields: [
    'submission.id',
    'submission.daac_id',
    'submission.created_at',
    'submission.hidden', 
    'submission_status.*',
    'submission_metrics.accession_rejected',
    `CASE WHEN submission_status.step_name = 'close' 
      THEN AGE(last_change, created_at) ELSE NULL END 
      as time_to_publish`
  ],
  from:{
    base: 'submission',
    joins: [refs.submission_status, refs.submission_metrics]
  },
  where:{
    filters: [
      ...(params.start_date ? [{field: 'submission.created_at', op: 'gte', param: "start_date"}] : []),
      ...(params.end_date ? [{field: 'submission.created_at', op: 'lte', param: "end_date"}] : []),
      ...(params.daac_ids ? [{cmd:`submission.daac_id = ANY(ARRAY['${params.daac_ids.join('\',\'')}']::UUID[])`}] : []),
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

//rewrite with sql-builder and daac handling
const getAverageTimeToPublish = (params) => sql.select({
  fields:[
    'submission.daac_id', 
    'AVG(AGE(last_change, created_at)) as time_to_publish'
  ],
  from:{
    base: 'submission',
    joins: [refs.submission_status]
  },
  where:{
    filters:[
      {field: 'submission_status.step_name', op: 'eq', value: "'close'"},
      ...(params.daac_ids ? [{cmd:`submission.daac_id = ANY(ARRAY['${params.daac_ids.join('\',\'')}']::UUID[])`}] : [])
    ]
  },
  group: 'submission.daac_id'
});


const temp =`
  SELECT submission.daac_id, AVG(AGE(last_change, created_at)) as time_to_publish
  FROM submission 
  LEFT JOIN submission_status 
  ON submission_status.id = submission.id 
  WHERE  
    submission_status.step_name = 'close'
  GROUP BY submission.daac_id
`

const getStepMetrics = (params) => sql.select({
  fields:[
    'AGE(step_metrics.complete_time, step_metrics.start_time) as time_for_step', 
    'step_metrics.step_name', 
    'step_metrics.submission_id', 
    'step_metrics.workflow_id'
  ],
  from:{
    base: 'step_metrics',
    joins: [refs.submission_step]
  },
  where:{
    filters:[
      ...(params.step_name ? [{field: 'step_metrics.step_name', op: 'eq', param: "step_name"}] : []),
      ...(params.submission_id ? [{field: 'step_metrics.submission_id', op: 'eq', param: "submission_id"}] : []),
      ...(params.workflow_id ? [{field: 'step_metrics.workflow_id', op: 'eq', param: "workflow_id"}] : []),
      ...(params.daac_ids ? [{cmd:`submission.daac_id = ANY(ARRAY['${params.daac_ids.join('\',\'')}']::UUID[])`}] : [])
    ]
  }
});

const setStepStartTime = () => `
  INSERT INTO step_metrics(step_name, submission_id, workflow_id)
  VALUES({{step_name}}, {{submission_id}}, {{workflow_id}})
  ON CONFLICT (step_name, submission_id) DO NOTHING
`;

const setStepStopTime = () => `
  UPDATE step_metrics
  SET complete_time = NOW()
  WHERE step_name = {{step_name}} AND submission_id = {{submission_id}}
`;

const setAccessionReversion = () => `
  INSERT INTO submission_metrics(id, accession_rejected)
  VALUES({{id}}, {{status}})
  ON CONFLICT (id) DO UPDATE SET accession_rejected = {{status}}
`


module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.metricsFilter = metricsFilter;
module.exports.metricsStats = metricsStats;
module.exports.putMetric = putMetric;
module.exports.getSubmissions = getSubmissions;
module.exports.getUserCount = getUserCount;
module.exports.getAverageTimeToPublish = getAverageTimeToPublish;
module.exports.getStepMetrics = getStepMetrics;
module.exports.setStepStartTime = setStepStartTime;
module.exports.setStepStopTime = setStepStopTime;
module.exports.setAccessionReversion = setAccessionReversion;