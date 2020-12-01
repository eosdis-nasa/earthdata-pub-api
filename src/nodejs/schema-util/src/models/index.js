const Action = require('./action.js');
const ActionInvokeRequest = require('./action-invoke-request.js');
const ActionRegisterRequest = require('./action-register-request.js');
const DAAC = require('./daac.js');
const DataRequest = require('./data-request.js');
const Form = require('./form.js');
const Group = require('./group.js');
const LogEvent = require('./log-event.js');
const LogEventList = require('./log-event-list.js');
const LogEventRequest = require('./log-event-request.js');
const Note = require('./note.js');
const NotifyRequest = require('./notify-request.js');
const Permission = require('./permission.js');
const Question = require('./question.js');
const QuestionList = require('./question-list.js');
const Service = require('./service.js');
const Submission = require('./submission.js');
const SubmissionOperationRequest = require('./submission-operation-request.js');
const SubscribeRequest = require('./subscribe-request.js');
const Subscription = require('./subscription.js');
const User = require('./user.js');
const UUID = require('./uuid.js');
const Version = require('./version.js');
const Workflow = require('./workflow.js');
const WorkflowActionStep = require('./workflow-action-step.js');
const WorkflowCloseStep = require('./workflow-close-step.js');
const WorkflowFormStep = require('./workflow-form-step.js');
const WorkflowInitStep = require('./workflow-init-step.js');
const WorkflowReviewStep = require('./workflow-review-step.js');
const WorkflowServiceStep = require('./workflow-service-step.js');
const UMMC = require('./umm-c.js');
const UMMCMN = require('./umm-cmn.js');

const models = {
  Action,
  ActionInvokeRequest,
  ActionRegisterRequest,
  DAAC,
  DataRequest,
  Form,
  Group,
  LogEvent,
  LogEventList,
  LogEventRequest,
  Note,
  NotifyRequest,
  Permission,
  Question,
  QuestionList,
  Service,
  Submission,
  SubmissionOperationRequest,
  SubscribeRequest,
  Subscription,
  User,
  UUID,
  Version,
  Workflow,
  WorkflowActionStep,
  WorkflowCloseStep,
  WorkflowFormStep,
  WorkflowInitStep,
  WorkflowReviewStep,
  WorkflowServiceStep
};

function collectionMetadata() {
  const metadata = UMMC.model('/definitions/');
  Object.assign(metadata.definitions, UMMCMN.model('/definitions/').definitions);
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
  const { refs } = models[name];
  model.definitions = refs.reduce((acc, ref) => {
    acc[ref] = models[ref].model(path);
    return acc;
  }, {});
  return model;
}

module.exports.allModels = allModels;
module.exports.getModel = getModel;
