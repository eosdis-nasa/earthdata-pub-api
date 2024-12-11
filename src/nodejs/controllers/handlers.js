module.exports.auth = require('../lambda-handlers/auth.js').handler;
module.exports.data = require('../lambda-handlers/data.js').handler;
module.exports.invoke = require('../lambda-handlers/invoke.js').handler;
module.exports.metrics = require('../lambda-handlers/metrics.js').handler;
module.exports.model = require('../lambda-handlers/model.js').handler;
module.exports.module = require('../lambda-handlers/module.js').handler;
module.exports.notification = require('../lambda-handlers/notification.js').handler;
module.exports.questions = require('../lambda-handlers/questions.js').handler;
module.exports.register = require('../lambda-handlers/register.js').handler;
module.exports.submission = require('../lambda-handlers/submission.js').handler;
module.exports.subscribe = require('../lambda-handlers/subscribe.js').handler;
module.exports.user = require('../lambda-handlers/user.js').handler;
module.exports.version = require('../lambda-handlers/version.js').handler;
module.exports.actionConsumer = require('../lambda-handlers/action-consumer.js').handler;
module.exports.metricsConsumer = require('../lambda-handlers/metrics-consumer.js').handler;
module.exports.inboundConsumer = require('../lambda-handlers/inbound-consumer.js').handler;
module.exports.notificationConsumer = require('../lambda-handlers/notification-consumer.js').handler;
module.exports.workflowConsumer = require('../lambda-handlers/workflow-consumer.js').handler;
module.exports.serviceAuthorizer = require('../lambda-handlers/service-authorizer.js').handler;
module.exports.rdsBackup = require('../lambda-handlers/rds-backup').handler;
module.exports.workflow = require('../lambda-handlers/workflow.js').handler;
module.exports.fileUpload = require('../lambda-handlers/file-upload.js').handler;
module.exports.form = require('../lambda-handlers/form.js').handler;
module.exports.form = require('../lambda-handlers/draft-cleanup.js').handler;
