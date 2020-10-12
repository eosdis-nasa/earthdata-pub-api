'use strict'

var proxyService = require('./proxyService');

module.exports.actionfindById = function actionfindById(req, res, next) {
  proxyService.actionfindById(req.swagger.params, res, next);
};

module.exports.actionfindAll = function actionfindAll(req, res, next) {
  proxyService.actionfindAll(req.swagger.params, res, next);
};

module.exports.daacfindById = function daacfindById(req, res, next) {
  proxyService.daacfindById(req.swagger.params, res, next);
};

module.exports.daacfindAll = function daacfindAll(req, res, next) {
  proxyService.daacfindAll(req.swagger.params, res, next);
};

module.exports.formfindById = function formfindById(req, res, next) {
  proxyService.formfindById(req.swagger.params, res, next);
};

module.exports.formput = function formput(req, res, next) {
  proxyService.formput(req.swagger.params, res, next);
};

module.exports.formfindAll = function formfindAll(req, res, next) {
  proxyService.formfindAll(req.swagger.params, res, next);
};

module.exports.groupfindById = function groupfindById(req, res, next) {
  proxyService.groupfindById(req.swagger.params, res, next);
};

module.exports.groupfindAll = function groupfindAll(req, res, next) {
  proxyService.groupfindAll(req.swagger.params, res, next);
};

module.exports.notefindById = function notefindById(req, res, next) {
  proxyService.notefindById(req.swagger.params, res, next);
};

module.exports.notefindAll = function notefindAll(req, res, next) {
  proxyService.notefindAll(req.swagger.params, res, next);
};

module.exports.questionfindById = function questionfindById(req, res, next) {
  proxyService.questionfindById(req.swagger.params, res, next);
};

module.exports.questionput = function questionput(req, res, next) {
  proxyService.questionput(req.swagger.params, res, next);
};

module.exports.questionfindAll = function questionfindAll(req, res, next) {
  proxyService.questionfindAll(req.swagger.params, res, next);
};

module.exports.servicefindById = function servicefindById(req, res, next) {
  proxyService.servicefindById(req.swagger.params, res, next);
};

module.exports.servicefindAll = function servicefindAll(req, res, next) {
  proxyService.servicefindAll(req.swagger.params, res, next);
};

module.exports.submissionfindById = function submissionfindById(req, res, next) {
  proxyService.submissionfindById(req.swagger.params, res, next);
};

module.exports.submissionfindAll = function submissionfindAll(req, res, next) {
  proxyService.submissionfindAll(req.swagger.params, res, next);
};

module.exports.userfindById = function userfindById(req, res, next) {
  proxyService.userfindById(req.swagger.params, res, next);
};

module.exports.userfindAll = function userfindAll(req, res, next) {
  proxyService.userfindAll(req.swagger.params, res, next);
};

module.exports.workflowfindById = function workflowfindById(req, res, next) {
  proxyService.workflowfindById(req.swagger.params, res, next);
};

module.exports.workflowput = function workflowput(req, res, next) {
  proxyService.workflowput(req.swagger.params, res, next);
};

module.exports.workflowfindAll = function workflowfindAll(req, res, next) {
  proxyService.workflowfindAll(req.swagger.params, res, next);
};

module.exports.notify = function notify(req, res, next) {
  proxyService.notify(req.swagger.params, res, next);
};

module.exports.getSubscriptions = function getSubscriptions(req, res, next) {
  proxyService.getSubscriptions(req.swagger.params, res, next);
};

module.exports.subscribe = function subscribe(req, res, next) {
  proxyService.subscribe(req.swagger.params, res, next);
};

module.exports.Invoke = function Invoke(req, res, next) {
  proxyService.Invoke(req.swagger.params, res, next);
};

module.exports.RegisterAction = function RegisterAction(req, res, next) {
  proxyService.RegisterAction(req.swagger.params, res, next);
};

module.exports.SubmissionOperation = function SubmissionOperation(req, res, next) {
  proxyService.SubmissionOperation(req.swagger.params, res, next);
};

module.exports.Dashboard = function Dashboard(req, res, next) {
  proxyService.Dashboard(req.swagger.params, res, next);
};

module.exports.getMetrics = function getMetrics(req, res, next) {
  proxyService.getMetrics(req.swagger.params, res, next);
};

module.exports.putMetric = function putMetric(req, res, next) {
  proxyService.putMetric(req.swagger.params, res, next);
};
