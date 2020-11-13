'use strict'

var proxyService = require('./proxyService');

module.exports.actionFindById = function actionFindById(req, res, next) {
  proxyService.actionFindById(req.swagger.params, res, next);
};

module.exports.actionFindAll = function actionFindAll(req, res, next) {
  proxyService.actionFindAll(req.swagger.params, res, next);
};

module.exports.daacFindById = function daacFindById(req, res, next) {
  proxyService.daacFindById(req.swagger.params, res, next);
};

module.exports.daacFindAll = function daacFindAll(req, res, next) {
  proxyService.daacFindAll(req.swagger.params, res, next);
};

module.exports.formFindById = function formFindById(req, res, next) {
  proxyService.formFindById(req.swagger.params, res, next);
};

module.exports.formPut = function formPut(req, res, next) {
  proxyService.formPut(req.swagger.params, res, next);
};

module.exports.formFindAll = function formFindAll(req, res, next) {
  proxyService.formFindAll(req.swagger.params, res, next);
};

module.exports.groupFindById = function groupFindById(req, res, next) {
  proxyService.groupFindById(req.swagger.params, res, next);
};

module.exports.groupFindAll = function groupFindAll(req, res, next) {
  proxyService.groupFindAll(req.swagger.params, res, next);
};

module.exports.roleFindById = function roleFindById(req, res, next) {
  proxyService.roleFindById(req.swagger.params, res, next);
};

module.exports.roleFindAll = function roleFindAll(req, res, next) {
  proxyService.roleFindAll(req.swagger.params, res, next);
};

module.exports.noteFindById = function noteFindById(req, res, next) {
  proxyService.noteFindById(req.swagger.params, res, next);
};

module.exports.noteFindAll = function noteFindAll(req, res, next) {
  proxyService.noteFindAll(req.swagger.params, res, next);
};

module.exports.questionFindById = function questionFindById(req, res, next) {
  proxyService.questionFindById(req.swagger.params, res, next);
};

module.exports.questionPut = function questionPut(req, res, next) {
  proxyService.questionPut(req.swagger.params, res, next);
};

module.exports.questionFindAll = function questionFindAll(req, res, next) {
  proxyService.questionFindAll(req.swagger.params, res, next);
};

module.exports.serviceFindById = function serviceFindById(req, res, next) {
  proxyService.serviceFindById(req.swagger.params, res, next);
};

module.exports.serviceFindAll = function serviceFindAll(req, res, next) {
  proxyService.serviceFindAll(req.swagger.params, res, next);
};

module.exports.submissionFindById = function submissionFindById(req, res, next) {
  proxyService.submissionFindById(req.swagger.params, res, next);
};

module.exports.submissionFindAll = function submissionFindAll(req, res, next) {
  proxyService.submissionFindAll(req.swagger.params, res, next);
};

module.exports.userFindById = function userFindById(req, res, next) {
  proxyService.userFindById(req.swagger.params, res, next);
};

module.exports.userFindAll = function userFindAll(req, res, next) {
  proxyService.userFindAll(req.swagger.params, res, next);
};

module.exports.workflowFindById = function workflowFindById(req, res, next) {
  proxyService.workflowFindById(req.swagger.params, res, next);
};

module.exports.workflowPut = function workflowPut(req, res, next) {
  proxyService.workflowPut(req.swagger.params, res, next);
};

module.exports.workflowFindAll = function workflowFindAll(req, res, next) {
  proxyService.workflowFindAll(req.swagger.params, res, next);
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

module.exports.actionInvoke = function actionInvoke(req, res, next) {
  proxyService.actionInvoke(req.swagger.params, res, next);
};

module.exports.actionRegister = function actionRegister(req, res, next) {
  proxyService.actionRegister(req.swagger.params, res, next);
};

module.exports.submissionOperation = function submissionOperation(req, res, next) {
  proxyService.submissionOperation(req.swagger.params, res, next);
};

module.exports.getLogEvents = function getLogEvents(req, res, next) {
  proxyService.getLogEvents(req.swagger.params, res, next);
};

module.exports.putLogEvent = function putLogEvent(req, res, next) {
  proxyService.putLogEvent(req.swagger.params, res, next);
};

module.exports.getModel = function getModel(req, res, next) {
  proxyService.getModel(req.swagger.params, res, next);
};
