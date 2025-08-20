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
const NoteAddViewers = require('./note-add-viewers.js');
const NoteRemoveViewer = require('./note-remove-viewer.js');
const NoteAddViewerRoles = require('./note-add-viewer-roles.js');
const NoteRemoveViewerRole = require('./note-remove-viewer-role.js');
const NotificationReplyRequest = require('./notification-reply-request.js');
const NotificationSendRequest = require('./notification-send-request.js');
const MetricsGenerateReport = require('./metrics-generate-report.js');
const MetricsGenerateReportResp = require('./metrics-generate-report-resp.js');
const MetricsGetDaacsResp = require('./metrics-get-daacs-resp.js');
const Page = require('./page.js');
const Permission = require('./permission.js');
const Question = require('./question.js');
const QuestionList = require('./question-list.js');
const QuestionAdd = require('./question-add.js');
const QuestionInputs = require('./question-inputs.js');
const Input = require('./input.js')
const Role = require('./role.js');
const Service = require('./service.js');
const StepReview = require('./step-review.js');
const StepReviewCreateDelete = require('./stepreview-create-delete.js')
const StepReviewCreateResponse = require('./step-review-create-resp.js');
const StepReviewDeleteResponse = require('./step-review-delete-resp.js');
const Submission = require('./submission.js');
const SubmissionDetails = require('./submission-details.js');
const SubmissionOperationAddContributors = require('./submission-operation-add-contributors.js');
const SubmissionOperationApply = require('./submission-operation-apply.js');
const SubmissionOperationChangeStep = require('./submission-operation-change-step.js');
const SubmissionOperationCopySubmission = require('./submission-operation-copy-submission.js');
const SubmissionOperationCustomResponse = require('./submission-operation-custom-response.js')
const SubmissionOperationId = require('./submission-operation-id.js');
const SubmissionOperationMetadata = require('./submission-operation-metadata.js');
const SubmissionOperationRemoveContributor = require('./submission-operation-remove-contributor.js')
const SubmissionOperationRequest = require('./submission-operation-request.js');
const SubmissionOperationReview = require('./submission-operation-review.js')
const SubmissionOperationSubmit = require('./submission-operation-submit.js');
const SubmissionOperationAssignDaacs = require('./submission-operation-assign-daacs.js');
const SubmissionOperationEsdisReview = require('./submission-operation-esdis-review.js');
const SubmissionInitializationRequest = require('./submission-initialization-request.js');
const SubmissionState = require('./submission-state.js');
const SubmissionStatus = require('./submission-status.js');
const SubscribeRequest = require('./subscribe-request.js');
const Subscription = require('./subscription.js');
const User = require('./user.js');
const UserAllFields = require('./user-all-fields.js');
const UserDetails = require('./user-details.js');
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
const Upload = require('./upload.js');
const GroupUpload = require('./group-upload.js');
const Step = require('./step.js');
const Section = require('./section.js');
const AttachmentUpload = require('./attachment-upload.js');
const StepUpload = require('./step-upload.js');

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
  NoteAddViewers,
  NoteRemoveViewer,
  NoteAddViewerRoles,
  NoteRemoveViewerRole,
  NotificationReplyRequest,
  NotificationSendRequest,
  MetricsGenerateReport,
  MetricsGenerateReportResp,
  MetricsGetDaacsResp,
  Page,
  Permission,
  Question,
  QuestionList,
  QuestionAdd,
  QuestionInputs,
  Input,
  Role,
  Service,
  StepReview,
  StepReviewCreateDelete,
  StepReviewCreateResponse,
  StepReviewDeleteResponse,
  Submission,
  SubmissionDetails,
  SubmissionOperationAddContributors,
  SubmissionOperationApply,
  SubmissionOperationChangeStep,
  SubmissionOperationCopySubmission,
  SubmissionOperationCustomResponse,
  SubmissionOperationId,
  SubmissionOperationMetadata,
  SubmissionOperationRemoveContributor,
  SubmissionOperationRequest,
  SubmissionOperationReview,
  SubmissionOperationSubmit,
  SubmissionOperationEsdisReview,
  SubmissionInitializationRequest,
  SubscribeRequest,
  SubmissionOperationAssignDaacs,
  SubmissionState,
  SubmissionStatus,
  Subscription,
  User,
  UserAllFields,
  UserDetails,
  UUID,
  Version,
  Workflow,
  WorkflowActionStep,
  WorkflowCloseStep,
  WorkflowFormStep,
  WorkflowInitStep,
  WorkflowReviewStep,
  WorkflowServiceStep,
  Upload,
  GroupUpload,
  Step,
  Section,
  AttachmentUpload,
  StepUpload

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
