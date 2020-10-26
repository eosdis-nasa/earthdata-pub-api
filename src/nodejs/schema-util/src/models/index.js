const models = {
  Action: require('./action.js'),
  ActionInvokeRequest: require('./action-invoke-request.js'),
  ActionRegisterRequest: require('./action-register-request.js'),
  DAAC: require('./daac.js'),
  DataRequest: require('./data-request.js'),
  Form: require('./form.js'),
  Group: require('./group.js'),
  LogEvent: require('./log-event.js'),
  LogEventList: require('./log-event-list.js'),
  LogEventRequest: require('./log-event-request.js'),
  Note: require('./note.js'),
  NotifyRequest: require('./notify-request.js'),
  Permission: require('./permission.js'),
  Question: require('./question.js'),
  QuestionList: require('./question-list.js'),
  Service: require('./service.js'),
  Submission: require('./submission.js'),
  SubmissionOperationRequest: require('./submission-operation-request.js'),
  SubscribeRequest: require('./subscribe-request.js'),
  Subscription: require('./subscription.js'),
  User: require('./user.js'),
  UUID: require('./uuid.js'),
  Workflow: require('./workflow.js'),
  WorkflowActionStep: require('./workflow-action-step.js'),
  WorkflowCloseStep: require('./workflow-close-step.js'),
  WorkflowFormStep: require('./workflow-form-step.js'),
  WorkflowInitStep: require('./workflow-init-step.js'),
  WorkflowReviewStep: require('./workflow-review-step.js'),
  WorkflowServiceStep: require('./workflow-service-step.js')
}

function collectionMetadata() {
  const metadata = require('./umm-c.js').model('/definitions/');
  Object.assign(metadata.definitions, require('./umm-cmn.js').model('/definitions/').definitions);
  return metadata;
}

function allModels(basePath) {
  return Object.entries(models).reduce((acc, [name, { model }]) => {
    acc[name] = model(basePath);
    return acc;
  }, {});
}

function getModel(name) {
  if (name === 'UMMC') {
    return collectionMetadata();
  }
  const path = '/definitions/';
  const model = models[name].model(path);
  const refs = models[name].refs;
  model.definitions = refs.reduce((acc, ref) => {
    acc[ref] = models[ref].model(path);
    return acc;
  }, {});
  return model;
}

module.exports.allModels = allModels;
module.exports.getModel = getModel;
