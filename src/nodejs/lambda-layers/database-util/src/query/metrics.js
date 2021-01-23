const findAll = `
SELECT * FROM metrics`;

const findById = `
${findAll} WHERE metrics.id = {{metrics.id}}`;

const metricsFilter = `
${findAll}`;

const metricsStats = `
SELECT
  metrics.event->>'event_type' event_type,
  COUNT(metrics.event->>'event_type') count
FROM metrics GROUP BY metrics.event->>'event_type'`;

const putMetric = `
INSERT INTO metrics(event)
VALUES ({{metrics.event}}::JSONB)`;

module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.metricsFilter = metricsFilter;
module.exports.metricsStats = metricsStats;
module.exports.putMetric = putMetric;
