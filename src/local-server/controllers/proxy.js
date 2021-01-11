'use strict'
const dataHandler = require('data').handler;
const modelHandler = require('model').handler;
const submissionHandler = require('submission').handler;
const authHandler = require('auth').handler
const versionHandler = require('version').handler;

module.exports.actionFindById = function actionFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'action',
    operation: 'findById',
    params: { path: { id: params.id.value }},
    context: { user_id: req.user_id }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.actionFindAll = function actionFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'action',
    operation: 'findAll',
    params: { query: {
        sort: params.sort.value,
        order: params.order.value,
        per_page: params.per_page.value,
        page: params.page.value
      }
    },
    context: { user_id: req.user_id }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.daacFindById = function daacFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'daac',
    operation: 'findById',
    params: { path: { id: params.id.value }},
    context: { user_id: req.user_id }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.daacFindAll = function daacFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'daac',
    operation: 'findAll',
    params: { query: {
        sort: params.sort.value,
        order: params.order.value,
        per_page: params.per_page.value,
        page: params.page.value
      }
    },
    context: { user_id: req.user_id }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.formFindById = function formFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'form',
    operation: 'findById',
    params: { path: { id: params.id.value }},
    context: { user_id: req.user_id }
  }
  dataHandler(lambdaEvent).then((body) => {
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
    params: { query: {
        sort: params.sort.value,
        order: params.order.value,
        per_page: params.per_page.value,
        page: params.page.value
      }
    },
    context: { user_id: req.user_id }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.groupFindById = function groupFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'group',
    operation: 'findById',
    params: { path: { id: params.id.value }},
    context: { user_id: req.user_id }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.groupFindAll = function groupFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'group',
    operation: 'findAll',
    params: { query: {
        sort: params.sort.value,
        order: params.order.value,
        per_page: params.per_page.value,
        page: params.page.value
      }
    },
    context: { user_id: req.user_id }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};


module.exports.roleFindById = function roleFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'role',
    operation: 'findById',
    params: { path: { id: params.id.value }},
    context: { user_id: req.user_id }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.roleFindAll = function roleFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'role',
    operation: 'findAll',
    params: { query: {
        sort: params.sort.value,
        order: params.order.value,
        per_page: params.per_page.value,
        page: params.page.value
      }
    },
    context: { user_id: req.user_id }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.noteFindById = function noteFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'note',
    operation: 'findById',
    params: { path: { id: params.id.value }},
    context: { user_id: req.user_id }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.noteFindAll = function noteFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'note',
    operation: 'findAll',
    params: { query: {
        sort: params.sort.value,
        order: params.order.value,
        per_page: params.per_page.value,
        page: params.page.value
      }
    },
    context: { user_id: req.user_id }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.questionFindById = function questionFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'question',
    operation: 'findById',
    params: { path: { id: params.id.value }},
    context: { user_id: req.user_id }
  }
  dataHandler(lambdaEvent).then((body) => {
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
    params: { query: {
        sort: params.sort.value,
        order: params.order.value,
        per_page: params.per_page.value,
        page: params.page.value
      }
    },
    context: { user_id: req.user_id }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.serviceFindById = function serviceFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'service',
    operation: 'findById',
    params: { path: { id: params.id.value }},
    context: { user_id: req.user_id }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.serviceFindAll = function serviceFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'service',
    operation: 'findAll',
    params: { query: {
        sort: params.sort.value,
        order: params.order.value,
        per_page: params.per_page.value,
        page: params.page.value
      }
    },
    context: { user_id: req.user_id }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.submissionFindById = function submissionFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'submission',
    operation: 'findById',
    params: { path: { id: params.id.value }},
    context: { user_id: req.user_id }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.submissionFindAll = function submissionFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'submission',
    operation: 'findAll',
    params: { query: {
        sort: params.sort.value,
        order: params.order.value,
        per_page: params.per_page.value,
        page: params.page.value
      }
    },
    context: { user_id: req.user_id }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.userFindById = function userFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'user',
    operation: 'findById',
    params: { path: { id: params.id.value }},
    context: { user_id: req.user_id }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.userFindAll = function userFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'user',
    operation: 'findAll',
    params: { query: {
        sort: params.sort.value,
        order: params.order.value,
        per_page: params.per_page.value,
        page: params.page.value
      }
    },
    context: { user_id: req.user_id }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.workflowFindById = function workflowFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'workflow',
    operation: 'findById',
    params: { path: { id: params.id.value }},
    context: { user_id: req.user_id }
  }
  dataHandler(lambdaEvent).then((body) => {
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
    params: { query: {
        sort: params.sort.value,
        order: params.order.value,
        per_page: params.per_page.value,
        page: params.page.value
      }
    },
    context: { user_id: req.user_id }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.notify = function notify(req, res, next) {
  const { params } = req.swagger;
  res.send({
    message: 'This is the mockup controller for notify'
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
  res.send({
    message: 'This is the mockup controller for subscribe'
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
  console.log(req);
  const lambdaEvent = {
    operation: params.operation.value,
    payload: params.payload.value,
    context: { user_id: req.user_id }
  }
  submissionHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.getLogEvents = function getLogEvents(req, res, next) {
  const { params } = req.swagger;
  res.send({
    message: 'This is the mockup controller for getMetrics'
  });
};

module.exports.putLogEvent = function putLogEvent(req, res, next) {
  const { params } = req.swagger;
  res.send({
    message: 'This is the mockup controller for putMetric'
  });
};

module.exports.getModel = function getModel(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    model: params.model.value,
    context: { user_id: req.user_id }
  }
  modelHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.getToken = function getToken(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    code: params.code.value,
    state: params.state.value
  }
  authHandler(lambdaEvent).then((body) => {
    res.status(307)
    .set({ Location: body.redirect })
    .send('Redirecting');
  });
};

module.exports.getVersion = function getVersion(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {}
  versionHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};
