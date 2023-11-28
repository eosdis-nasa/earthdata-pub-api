const sql = require('./sql-builder.js');

const refs = {
  submission_status: {
    type: 'left_join',
    src:{
      type: 'select',
      fields: [
        'last_change',
        'id',
        'step_name'
      ],
      from: { base: 'submission_status' },
    },
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

const getSubmissions = (params) => `
SELECT 
  submission.*,
  submission_status.*, 
  AGE(last_change, created_at) as time_to_publish
FROM submission 
JOIN submission_status
ON submission_status.id = submission.id
WHERE submission_status.step_name = 'close'
${params.start_date? `AND submission.created_at >= '${params.start_date}'`: ''}
${params.end_date? `AND submission.created_at <= '${params.end_date}'`: ''}
`

module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.metricsFilter = metricsFilter;
module.exports.metricsStats = metricsStats;
module.exports.putMetric = putMetric;
module.exports.getSubmissions = getSubmissions;
