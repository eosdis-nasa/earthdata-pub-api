'use strict'
const dataHandler = require('data').handler;


module.exports.actionfindById = function actionfindById(req, res, next) {
  const lambdaEvent = {
    resource: 'action',
    operation: 'findById',
    params: { path: { id: req.id.value }}
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.actionfindAll = function actionfindAll(req, res, next) {
  const lambdaEvent = {
    resource: 'action',
    operation: 'findAll'
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.daacfindById = function daacfindById(req, res, next) {
  const lambdaEvent = {
    resource: 'daac',
    operation: 'findById',
    params: { path: { id: req.id.value }}
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.daacfindAll = function daacfindAll(req, res, next) {
  const lambdaEvent = {
    resource: 'daac',
    operation: 'findAll'
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.formfindById = function formfindById(req, res, next) {
  const lambdaEvent = {
    resource: 'form',
    operation: 'findById',
    params: { path: { id: req.id.value }}
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.formput = function formput(req, res, next) {
  res.send({
    message: 'This is the mockup controller for formput'
  });
};

module.exports.formfindAll = function formfindAll(req, res, next) {
  const lambdaEvent = {
    resource: 'form',
    operation: 'findAll'
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.groupfindById = function groupfindById(req, res, next) {
  const lambdaEvent = {
    resource: 'group',
    operation: 'findById',
    params: { path: { id: req.id.value }}
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.groupfindAll = function groupfindAll(req, res, next) {
  res.send({
    message: 'This is the mockup controller for groupfindAll'
  });
};

module.exports.notefindById = function notefindById(req, res, next) {
  const lambdaEvent = {
    resource: 'note',
    operation: 'findById',
    params: { path: { id: req.id.value }}
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.notefindAll = function notefindAll(req, res, next) {
  const lambdaEvent = {
    resource: 'note',
    operation: 'findAll'
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.questionfindById = function questionfindById(req, res, next) {
  const lambdaEvent = {
    resource: 'question',
    operation: 'findById',
    params: { path: { id: req.id.value }}
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.questionput = function questionput(req, res, next) {
  res.send({
    message: 'This is the mockup controller for questionput'
  });
};

module.exports.questionfindAll = function questionfindAll(req, res, next) {
  const lambdaEvent = {
    resource: 'question',
    operation: 'findAll'
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.servicefindById = function servicefindById(req, res, next) {
  const lambdaEvent = {
    resource: 'service',
    operation: 'findById',
    params: { path: { id: req.id.value }}
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.servicefindAll = function servicefindAll(req, res, next) {
  const lambdaEvent = {
    resource: 'service',
    operation: 'findAll'
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.submissionfindById = function submissionfindById(req, res, next) {
  const lambdaEvent = {
    resource: 'submission',
    operation: 'findById',
    params: { path: { id: req.id.value }}
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.submissionfindAll = function submissionfindAll(req, res, next) {
  const lambdaEvent = {
    resource: 'submission',
    operation: 'findAll'
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.userfindById = function userfindById(req, res, next) {
  const lambdaEvent = {
    resource: 'user',
    operation: 'findById',
    params: { path: { id: req.id.value }}
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.userfindAll = function userfindAll(req, res, next) {
  const lambdaEvent = {
    resource: 'user',
    operation: 'findAll'
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.workflowfindById = function workflowfindById(req, res, next) {
  const lambdaEvent = {
    resource: 'workflow',
    operation: 'findById',
    params: { path: { id: req.id.value }}
  }
  dataHandler(lambdaEvent).then((body) => {
    res.send(body);
  });
};

module.exports.workflowput = function workflowput(req, res, next) {
  res.send({
    message: 'This is the mockup controller for workflowput'
  });
};

module.exports.workflowfindAll = function workflowfindAll(req, res, next) {
  const lambdaEvent = {
    resource: 'workflow',
    operation: 'findAll'
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

module.exports.Invoke = function Invoke(req, res, next) {
  res.send({
    message: 'This is the mockup controller for Invoke'
  });
};

module.exports.RegisterAction = function RegisterAction(req, res, next) {
  res.send({
    message: 'This is the mockup controller for RegisterAction'
  });
};

module.exports.SubmissionOperation = function SubmissionOperation(req, res, next) {
  res.send({
    message: 'This is the mockup controller for SubmissionOperation'
  });
};

module.exports.Dashboard = function Dashboard(req, res, next) {
  res.send({
    message: 'This is the mockup controller for Dashboard'
  });
};

module.exports.getMetrics = function getMetrics(req, res, next) {
  res.send({
    message: 'This is the mockup controller for getMetrics'
  });
};

module.exports.putMetric = function putMetric(req, res, next) {
  res.send({
    message: 'This is the mockup controller for putMetric'
  });
};
