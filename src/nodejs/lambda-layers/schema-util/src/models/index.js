const Action = require('./action.js');
const ActionInvokeRequest = require('./action-invoke-request.js');
const ActionRegisterRequest = require('./action-register-request.js');
const BasicResponse = require('./basic-response.js');
const CodeValidation = require('./code-validation.js');
const Conversation = require('./conversation.js');
const ConversationAddRemoveUser = require('./conversation-add-remove-user.js');
const ConversationEdpuser = require('./conversation-edpuser.js');
const ConversationList = require('./conversation-list.js');
const ConversationNotes = require('./conversation-notes.js');
const DAAC = require('./daac.js');
const DataRequest = require('./data-request.js');
const FileListResponse = require('./file-list-response.js');
const FileUploadResponse = require('./file-upload-response.js');
const Form = require('./form.js');
const FormCreate = require('./form-create.js');
const FormSections = require('./form-sections.js');
const FormUpdate = require('./form-update.js');
const Group = require('./group.js');
const GroupDetails = require('./group-details.js');
const Id = require('./id.js');
const LogEvent = require('./log-event.js');
const LogEventList = require('./log-event-list.js');
const LogEventRequest = require('./log-event-request.js');
const Note = require('./note.js');
const NoteAddViewers = require('./note-add-viewers.js');
const NoteRemoveViewer = require('./note-remove-viewer.js');
const NoteAddViewerRoles = require('./note-add-viewer-roles.js');
const NoteRemoveViewerRole = require('./note-remove-viewer-role.js');
const NoteScope = require('./note-scope.js');
const NotificationReplyRequest = require('./notification-reply-request.js');
const NotificationSendRequest = require('./notification-send-request.js');
const MetricsEventCount = require('./metrics-event-count.js');
const MetricsGenerateReport = require('./metrics-generate-report.js');
const MetricsGenerateReportResp = require('./metrics-generate-report-resp.js');
const MetricsGetDaacsResp = require('./metrics-get-daacs-resp.js');
const MfaVerifyRequest = require('./mfa-verify-request.js');
const Page = require('./page.js');
const Permission = require('./permission.js');
const Question = require('./question.js');
const QuestionList = require('./question-list.js');
const QuestionAdd = require('./question-add.js');
const QuestionInputs = require('./question-inputs.js');
const QuestionUpdate = require('./question-update.js');
const Input = require('./input.js');
const InputUpdate = require('./input-update.js');
const Role = require('./role.js');
const RoleDetails = require('./role-details.js');
const Service = require('./service.js');
const StepReview = require('./step-review.js');
const StepReviewCreateDelete = require('./stepreview-create-delete.js');
const StepReviewCreateResponse = require('./step-review-create-resp.js');
const StepReviewDeleteResponse = require('./step-review-delete-resp.js');
const Submission = require('./submission.js');
const SubmissionOperationAll = require('./submission-operation-all.js');
const SubmissionDetails = require('./submission-details.js');
const SubmissionOperationAddContributors = require('./submission-operation-add-contributors.js');
const SubmissionOperationApply = require('./submission-operation-apply.js');
const SubmissionOperationChangeStep = require('./submission-operation-change-step.js');
const SubmissionOperationCopySubmission = require('./submission-operation-copy-submission.js');
const SubmissionOperationCustomResponse = require('./submission-operation-custom-response.js');
const SubmissionOperationMetadata = require('./submission-operation-metadata.js');
const SubmissionOperationRemoveContributor = require('./submission-operation-remove-contributor.js');
const SubmissionOperationRequest = require('./submission-operation-request.js');
const SubmissionOperationReview = require('./submission-operation-review.js');
const SubmissionOperationSubmit = require('./submission-operation-submit.js');
const SubmissionOperationAssignDaacs = require('./submission-operation-assign-daacs.js');
const SubmissionOperationEsdisReview = require('./submission-operation-esdis-review.js');
const SubmissionInitializationRequest = require('./submission-initialization-request.js');
const SubmissionState = require('./submission-state.js');
const SubmissionStatus = require('./submission-status.js');
const SubmissionStepReview = require('./submission-step-review.js');
const SubscribeRequest = require('./subscribe-request.js');
const Subscription = require('./subscription.js');
const TokenRefreshResponse = require('./token-refresh-response.js');
const UploadStep = require('./upload-step.js');
const User = require('./user.js');
const UserAddRemoveGroup = require('./user-add-remove-group.js');
const UserAddRemoveRole = require('./user-add-remove-role.js');
const UserAllFields = require('./user-all-fields.js');
const UserCreate = require('./user-create.js');
const UserDetails = require('./user-details.js');
const UserGetUsersRequest = require('./user-get-users-request.js');
const UserGetUsersResponse = require('./user-get-users-response.js');
const UserGroup = require('./edpuser-edpgroup.js');
const UserRole = require('./edpuser-edprole.js');
const UserUpdateName = require('./user-update-name.js');
const UUID = require('./uuid.js');
const Version = require('./version.js');
const Workflow = require('./workflow.js');
const WorkflowActionStep = require('./workflow-action-step.js');
const WorkflowCloseStep = require('./workflow-close-step.js');
const WorkflowCreate = require('./workflow-create.js');
const WorkflowFormStep = require('./workflow-form-step.js');
const WorkflowInitStep = require('./workflow-init-step.js');
const WorkflowReviewStep = require('./workflow-review-step.js');
const WorkflowServiceStep = require('./workflow-service-step.js');
const WorkflowSteps = require('./workflow-steps.js');
const UMMC = require('./umm-c.js');
const UMMCMN = require('./umm-cmn.js');
const Upload = require('./upload.js');
const GroupUpload = require('./group-upload.js');
const Step = require('./step.js');
const StepUpdate = require('./step-update.js');
const Section = require('./section.js');
const AttachmentUpload = require('./attachment-upload.js');
const StepUpload = require('./step-upload.js');

const models = {
  Action,
  ActionInvokeRequest,
  ActionRegisterRequest,
  BasicResponse,
  CodeValidation,
  Conversation,
  ConversationAddRemoveUser,
  ConversationEdpuser,
  ConversationList,
  ConversationNotes,
  DAAC,
  DataRequest,
  FileListResponse,
  FileUploadResponse,
  Form,
  FormCreate,
  FormSections,
  FormUpdate,
  Group,
  GroupDetails,
  Id,
  LogEvent,
  LogEventList,
  LogEventRequest,
  Note,
  NoteAddViewers,
  NoteRemoveViewer,
  NoteAddViewerRoles,
  NoteRemoveViewerRole,
  NoteScope,
  NotificationReplyRequest,
  NotificationSendRequest,
  MetricsEventCount,
  MetricsGenerateReport,
  MetricsGenerateReportResp,
  MetricsGetDaacsResp,
  MfaVerifyRequest,
  Page,
  Permission,
  Question,
  QuestionList,
  QuestionAdd,
  QuestionInputs,
  QuestionUpdate,
  Input,
  InputUpdate,
  Role,
  RoleDetails,
  Service,
  StepReview,
  StepReviewCreateDelete,
  StepReviewCreateResponse,
  StepReviewDeleteResponse,
  Submission,
  SubmissionOperationAll,
  SubmissionDetails,
  SubmissionOperationAddContributors,
  SubmissionOperationApply,
  SubmissionOperationChangeStep,
  SubmissionOperationCopySubmission,
  SubmissionOperationCustomResponse,
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
  SubmissionStepReview,
  Subscription,
  TokenRefreshResponse,
  UploadStep,
  User,
  UserAddRemoveGroup,
  UserAddRemoveRole,
  UserAllFields,
  UserCreate,
  UserDetails,
  UserGetUsersRequest,
  UserGetUsersResponse,
  UserGroup,
  UserRole,
  UserUpdateName,
  UUID,
  Version,
  Workflow,
  WorkflowActionStep,
  WorkflowCloseStep,
  WorkflowCreate,
  WorkflowFormStep,
  WorkflowInitStep,
  WorkflowReviewStep,
  WorkflowServiceStep,
  WorkflowSteps,
  Upload,
  GroupUpload,
  Step,
  StepUpdate,
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
