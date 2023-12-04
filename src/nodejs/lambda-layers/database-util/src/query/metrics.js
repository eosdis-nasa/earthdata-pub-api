const sql = require('./sql-builder.js');

const allFields = [];
const fieldMap = {};


const refs = {
  submission_status: {
    type: 'left_join',
    src: 'submission_status',
    on: {left: 'submission_status.id', right: 'submission.id'}
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

const getSubmissions = (params) => sql.select({
  fields: fields(allFields),
  from:{
    base: 'submission',
    joins: [refs.submission_status]
  },
  where:{
    filters: [
      ...allFields(params.start_date ? [{field: 'submission.created_at', op: 'gte', param: 'start_date'}] : []),
      ...allFields(params.end_date ? [{field: 'submission.created_at', op: 'lte', param: 'end_date'}] : []),
      ...allFields(params.published ? [{field: 'submission_status.step_name', op: 'eq', value: 'close'}] : []),
      ...allFields(params.unpublished ? [{field: 'submission_status.step_name', op: 'neq', value: 'close'}] : []),
      ...allFields(params.daac_id ? [{field: 'submission.daac_id', op: 'eq', param: 'daac_id'}] : []),
    ]
  }
})

// const getSubmissions = (params) => `
// SELECT 
//   submission.*,
//   submission_status.*, 
//   AGE(last_change, created_at) as time_to_publish
// FROM submission 
// JOIN submission_status
// ON submission_status.id = submission.id
// WHERE submission_status.step_name = 'close'
// ${params.start_date? `AND submission.created_at >= '${params.start_date}'`: ''}
// ${params.end_date? `AND submission.created_at <= '${params.end_date}'`: ''}
// `

module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.metricsFilter = metricsFilter;
module.exports.metricsStats = metricsStats;
module.exports.putMetric = putMetric;
module.exports.getSubmissions = getSubmissions;
