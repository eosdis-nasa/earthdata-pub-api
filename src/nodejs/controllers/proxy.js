const handlers = require('./handlers.js');

module.exports.actionFindById = function actionFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'action',
    operation: 'findById',
    params: { id: params.id.value },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.actionFindAll = function actionFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'action',
    operation: 'findAll',
    params: {
      query: {
        sort: params.sort.value,
        order: params.order.value,
        per_page: params.per_page.value,
        page: params.page.value
      }
    },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.daacFindById = function daacFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'daac',
    operation: 'findById',
    params: { id: params.id.value },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.daacFindAll = function daacFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'daac',
    operation: 'findAll',
    params: {
      query: {
        sort: params.sort.value,
        order: params.order.value,
        per_page: params.per_page.value,
        page: params.page.value
      }
    },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.formFindById = function formFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'form',
    operation: 'findById',
    params: { id: params.id.value },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.formPut = function formPut(req, res, next) {
  res.send({
    message: 'This is the mockup controller for formput'
  });
};

module.exports.formFindAll = function formFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'form',
    operation: 'findAll',
    params: {
      short_name: params.short_name.value,
      version: params.version.value,
      long_name: params.long_name.value,
      created_after: params.created_after.value,
      created_before: params.created_before.value,
      sort: params.sort.value,
      order: params.order.value,
      per_page: params.per_page.value,
      page: params.page.value
    },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.groupFindById = function groupFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'group',
    operation: 'findById',
    params: { id: params.id.value },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.groupFindAll = function groupFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'group',
    operation: 'findAll',
    params: {
      query: {
        sort: params.sort.value,
        order: params.order.value,
        per_page: params.per_page.value,
        page: params.page.value
      }
    },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.roleFindById = function roleFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'role',
    operation: 'findById',
    params: { id: params.id.value },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.roleFindAll = function roleFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'role',
    operation: 'findAll',
    params: {
      query: {
        sort: params.sort.value,
        order: params.order.value,
        per_page: params.per_page.value,
        page: params.page.value
      }
    },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.noteFindById = function noteFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'note',
    operation: 'findById',
    params: { id: params.id.value },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.noteFindAll = function noteFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'note',
    operation: 'findAll',
    params: {
      query: {
        sort: params.sort.value,
        order: params.order.value,
        per_page: params.per_page.value,
        page: params.page.value
      }
    },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.questionFindById = function questionFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'question',
    operation: 'findById',
    params: { id: params.id.value },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.questionPut = function questionPut(req, res, next) {
  const { params } = req.swagger;
  res.send({
    message: 'This is the mockup controller for questionput'
  });
};

module.exports.questionFindAll = function questionFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'question',
    operation: 'findAll',
    params: {
      query: {
        sort: params.sort.value,
        order: params.order.value,
        per_page: params.per_page.value,
        page: params.page.value
      }
    },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.serviceFindById = function serviceFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'service',
    operation: 'findById',
    params: { id: params.id.value },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.serviceFindAll = function serviceFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'service',
    operation: 'findAll',
    params: {
      query: {
        sort: params.sort.value,
        order: params.order.value,
        per_page: params.per_page.value,
        page: params.page.value
      }
    },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.submissionFindById = function submissionFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'submission',
    operation: 'findById',
    params: { id: params.id.value },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.submissionFindAll = function submissionFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'submission',
    operation: 'findAll',
    params: {
      name: params.name.value,
      user_id: params.user_id.value,
      daac_id: params.daac_id.value,
      workflow_id: params.workflow_id.value,
      workflow_name: params.workflow_name.value,
      step_name: params.step_name.value,
      step_type: params.step_type.value,
      status: params.status.value,
      created_after: params.created_after.value,
      created_before: params.created_before.value,
      last_change_after: params.last_change_after.value,
      last_change_before: params.last_change_before.value,
      sort: params.sort.value,
      order: params.order.value,
      per_page: params.per_page.value,
      page: params.page.value
    },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.userFindById = function userFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'user',
    operation: 'findById',
    params: { id: params.id.value },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.userFindAll = function userFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'user',
    operation: 'findAll',
    params: {
      query: {
        sort: params.sort.value,
        order: params.order.value,
        per_page: params.per_page.value,
        page: params.page.value
      }
    },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.workflowFindById = function workflowFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'workflow',
    operation: 'findById',
    params: { id: params.id.value },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.workflowPut = function workflowPut(req, res, next) {
  const { params } = req.swagger;
  res.send({
    message: 'This is the mockup controller for workflowput'
  });
};

module.exports.workflowFindAll = function workflowFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'workflow',
    operation: 'findAll',
    params: {
      query: {
        sort: params.sort.value,
        order: params.order.value,
        per_page: params.per_page.value,
        page: params.page.value
      }
    },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.notificationSend = function notificationSend(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: 'send',
    ...params.payload.value,
    context: { user_id: req.user_id }
  };
  handlers.notification(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.notificationReply = function notificationReply(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: 'reply',
    ...params.payload.value,
    context: { user_id: req.user_id }
  };
  handlers.notification(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.notificationConversations = function notificationConversations(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: 'conversations',
    context: { user_id: req.user_id }
  };
  handlers.notification(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.notificationConversation = function notificationConversation(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: 'conversation',
    conversation_id: params.id.value,
    context: { user_id: req.user_id }
  };
  handlers.notification(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.getSubscriptions = function getSubscriptions(req, res, next) {
  const { params } = req.swagger;
  res.send({
    message: 'This is the mockup controller for getSubscriptions'
  });
};

module.exports.subscribe = function subscribe(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = params.payload.value;
  Object.assign(lambdaEvent, { context: { user_id: req.user_id } });
  handlers.subscribe(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.actionInvoke = function actionInvoke(req, res, next) {
  const { params } = req.swagger;
  res.send({
    message: 'This is the mockup controller for Invoke'
  });
};

module.exports.actionRegister = function actionRegister(req, res, next) {
  const { params } = req.swagger;
  res.send({
    message: 'This is the mockup controller for RegisterAction'
  });
};

module.exports.submissionOperation = function submissionOperation(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    operation: params.operation.value,
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.submission(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.searchMetrics = function searchMetrics(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: 'search',
    filter: {
      ...(params.start && { start: params.start.value }),
      ...(params.end && { end: params.end.value }),
      ...(params.event_type && { event_type: params.event_type.value }),
      ...(params.count && { count: params.count.value })
    },
    context: { user_id: req.user_id }
  };
  handlers.metrics(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.putMetric = function putMetric(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: 'put',
    data: params.payload.value,
    context: { user_id: req.user_id }
  };
  handlers.metrics(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.metricsListReports = function metricsListReports(req, res, next) {
  res.send(["2021-06-20", "2021-06-21", "2021-06-22"]);
};

module.exports.metricsGetReport = function putMetric(req, res, next) {
  res.status(200);
  res.sendFile(`${__dirname}/static/report_2021-06-20.jpeg`);
};

module.exports.getModel = function getModel(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    model: params.model.value,
    context: { user_id: req.user_id }
  };
  handlers.model(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.getToken = function getToken(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    code: params.code.value,
    state: params.state.value
  };
  handlers.auth(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.refreshToken = function refreshToken(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    refresh: true,
    context: { user_id: req.user_id }
  };
  handlers.auth(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.getVersion = function getVersion(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {};
  handlers.version(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.getOverviewApp = function getOverviewApp(req, res, next) {
  res.send({
    message: 'Placeholder for overview app root endpoint.'
  });
};

module.exports.getOverviewAppSubpath = function getOverviewAppSubpath(req, res, next) {
  res.send({
    message: 'Placeholder for overview app subpath endpoint.'
  });
};

module.exports.getDashboardApp = function getDashboardApp(req, res, next) {
  res.send({
    message: 'Placeholder for dashboard app root endpoint.'
  });
};

module.exports.getDashboardAppSubpath = function getDashboardAppSubpath(req, res, next) {
  res.send({
    message: 'Placeholder for dashboard app subpath endpoint.'
  });
};

module.exports.getFormsApp = function getFormsApp(req, res, next) {
  res.send({
    message: 'Placeholder for forms app root endpoint.'
  });
};

module.exports.getFormsAppSubpath = function getFormsAppSubpath(req, res, next) {
  res.send({
    message: 'Placeholder for forms app subpath endpoint.'
  });
};
