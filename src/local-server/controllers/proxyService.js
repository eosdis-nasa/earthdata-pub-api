'use strict'
const dataHandler = require('data').handler;
const modelHandler = require('model').handler;
const submissionHandler = require('submission').handler;

module.exports.actionFindById = function actionFindById(req, res, next) {
  const lambdaEvent = {
    resource: 'action',
    operation: 'findById',
    params: { path: { id: req.id.value }}
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.actionFindAll = function actionFindAll(req, res, next) {
  const lambdaEvent = {
    resource: 'action',
    operation: 'findAll',
    params: { query: {
        sort: req.sort.value,
        order: req.order.value,
        per_page: req.per_page.value,
        page: req.page.value
      }
    }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.daacFindById = function daacFindById(req, res, next) {
  const lambdaEvent = {
    resource: 'daac',
    operation: 'findById',
    params: { path: { id: req.id.value }}
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.daacFindAll = function daacFindAll(req, res, next) {
  const lambdaEvent = {
    resource: 'daac',
    operation: 'findAll',
    params: { query: {
        sort: req.sort.value,
        order: req.order.value,
        per_page: req.per_page.value,
        page: req.page.value
      }
    }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.formFindById = function formFindById(req, res, next) {
  const lambdaEvent = {
    resource: 'form',
    operation: 'findById',
    params: { path: { id: req.id.value }}
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
  const lambdaEvent = {
    resource: 'form',
    operation: 'findAll',
    params: { query: {
        sort: req.sort.value,
        order: req.order.value,
        per_page: req.per_page.value,
        page: req.page.value
      }
    }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.groupFindById = function groupFindById(req, res, next) {
  const lambdaEvent = {
    resource: 'group',
    operation: 'findById',
    params: { path: { id: req.id.value }}
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.groupFindAll = function groupFindAll(req, res, next) {
  res.send({
    message: 'This is the mockup controller for groupfindAll'
  });
};


module.exports.roleFindById = function roleFindById(req, res, next) {
  const lambdaEvent = {
    resource: 'role',
    operation: 'findById',
    params: { path: { id: req.id.value }}
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.roleFindAll = function roleFindAll(req, res, next) {
  res.send({
    message: 'This is the mockup controller for groupfindAll'
  });
};

module.exports.noteFindById = function noteFindById(req, res, next) {
  const lambdaEvent = {
    resource: 'note',
    operation: 'findById',
    params: { path: { id: req.id.value }}
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.noteFindAll = function noteFindAll(req, res, next) {
  const lambdaEvent = {
    resource: 'note',
    operation: 'findAll',
    params: { query: {
        sort: req.sort.value,
        order: req.order.value,
        per_page: req.per_page.value,
        page: req.page.value
      }
    }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.questionFindById = function questionFindById(req, res, next) {
  const lambdaEvent = {
    resource: 'question',
    operation: 'findById',
    params: { path: { id: req.id.value }}
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.questionPut = function questionPut(req, res, next) {
  res.send({
    message: 'This is the mockup controller for questionput'
  });
};

module.exports.questionFindAll = function questionFindAll(req, res, next) {
  const lambdaEvent = {
    resource: 'question',
    operation: 'findAll',
    params: { query: {
        sort: req.sort.value,
        order: req.order.value,
        per_page: req.per_page.value,
        page: req.page.value
      }
    }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.serviceFindById = function serviceFindById(req, res, next) {
  const lambdaEvent = {
    resource: 'service',
    operation: 'findById',
    params: { path: { id: req.id.value }}
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.serviceFindAll = function serviceFindAll(req, res, next) {
  const lambdaEvent = {
    resource: 'service',
    operation: 'findAll',
    params: { query: {
        sort: req.sort.value,
        order: req.order.value,
        per_page: req.per_page.value,
        page: req.page.value
      }
    }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.submissionFindById = function submissionFindById(req, res, next) {
  const lambdaEvent = {
    resource: 'submission',
    operation: 'findById',
    params: { path: { id: req.id.value }}
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.submissionFindAll = function submissionFindAll(req, res, next) {
  const lambdaEvent = {
    resource: 'submission',
    operation: 'findAll',
    params: { query: {
        sort: req.sort.value,
        order: req.order.value,
        per_page: req.per_page.value,
        page: req.page.value
      }
    }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.userFindById = function userFindById(req, res, next) {
  const lambdaEvent = {
    resource: 'user',
    operation: 'findById',
    params: { path: { id: req.id.value }}
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.userFindAll = function userFindAll(req, res, next) {
  const lambdaEvent = {
    resource: 'user',
    operation: 'findAll',
    params: { query: {
        sort: req.sort.value,
        order: req.order.value,
        per_page: req.per_page.value,
        page: req.page.value
      }
    }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.workflowFindById = function workflowFindById(req, res, next) {
  const lambdaEvent = {
    resource: 'workflow',
    operation: 'findById',
    params: { path: { id: req.id.value }}
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.workflowPut = function workflowPut(req, res, next) {
  res.send({
    message: 'This is the mockup controller for workflowput'
  });
};

module.exports.workflowFindAll = function workflowFindAll(req, res, next) {
  const lambdaEvent = {
    resource: 'workflow',
    operation: 'findAll',
    params: { query: {
        sort: req.sort.value,
        order: req.order.value,
        per_page: req.per_page.value,
        page: req.page.value
      }
    }
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.notify = function notify(req, res, next) {
  res.send({
    message: 'This is the mockup controller for notify'
  });
};

module.exports.getSubscriptions = function getSubscriptions(req, res, next) {
  res.send({
    message: 'This is the mockup controller for getSubscriptions'
  });
};

module.exports.subscribe = function subscribe(req, res, next) {
  res.send({
    message: 'This is the mockup controller for subscribe'
  });
};

module.exports.actionInvoke = function actionInvoke(req, res, next) {
  res.send({
    message: 'This is the mockup controller for Invoke'
  });
};

module.exports.actionRegister = function actionRegister(req, res, next) {
  res.send({
    message: 'This is the mockup controller for RegisterAction'
  });
};

module.exports.submissionOperation = function SubmissionOperation(req, res, next) {
  const lambdaEvent = {
    operation: req.operation.value,
    payload: req.payload.value,
  }
  submissionHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.getLogEvents = function getLogEvents(req, res, next) {
  res.send({
    message: 'This is the mockup controller for getMetrics'
  });
};

module.exports.putLogEvent = function putLogEvent(req, res, next) {
  res.send({
    message: 'This is the mockup controller for putMetric'
  });
};

module.exports.getModel = function getModel(req, res, next) {
  const lambdaEvent = {
    model: req.model.value
  }
  modelHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};
