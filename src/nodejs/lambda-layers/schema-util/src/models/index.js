const Action = require('./action.js');
const ActionInvokeRequest = require('./action-invoke-request.js');
const BasicResponse = require('./basic-response.js');
const CodeValidation = require('./code-validation.js');
const Conversation = require('./conversation.js');
const ConversationAddRemoveUser = require('./conversation-add-remove-user.js');
const ConversationEdpuser = require('./conversation-edpuser.js');
const ConversationList = require('./conversation-list.js');
const ConversationNotes = require('./conversation-notes.js');
const CreateTempUploadFile = require('./create-file-upload.js');
const CreateTempUploadFileResponse = require('./create-file-upload-response.js');
const DAAC = require('./daac.js');
const FileListResponse = require('./file-list-response.js');
const FileUploadResponse = require('./file-upload-response.js');
const Form = require('./form.js');
const FormCreate = require('./form-create.js');
const FormSections = require('./form-sections.js');
const FormUpdate = require('./form-update.js');
const Group = require('./group.js');
const GetPartUrl = require('./get-part-url.js');
const GetPartUrlResponse = require('./get-part-url-response.js');
const GroupDetails = require('./group-details.js');
const Id = require('./id.js');
const Note = require('./note.js');
const NoteAddViewers = require('./note-add-viewers.js');
const NoteRemoveViewer = require('./note-remove-viewer.js');
const NoteAddViewerRoles = require('./note-add-viewer-roles.js');
const NoteRemoveViewerRole = require('./note-remove-viewer-role.js');
const NoteScope = require('./note-scope.js');
const NotificationReplyRequest = require('./notification-reply-request.js');
const NotificationSendRequest = require('./notification-send-request.js');
const MetricsGenerateReport = require('./metrics-generate-report.js');
const MetricsGenerateReportResp = require('./metrics-generate-report-resp.js');
const MetricsGetDaacsResp = require('./metrics-get-daacs-resp.js');
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
const SubmissionOperationFindAllResponse = require('./submission-operation-find-all-result.js');
const SubmissionOperationMetadata = require('./submission-operation-metadata.js');
const SubmissionOperationRemoveContributor = require('./submission-operation-remove-contributor.js');
const SubmissionOperationReview = require('./submission-operation-review.js');
const SubmissionOperationSubmit = require('./submission-operation-submit.js');
const SubmissionOperationAssignDaacs = require('./submission-operation-assign-daacs.js');
const SubmissionOperationEsdisReview = require('./submission-operation-esdis-review.js');
const SubmissionInitializationRequest = require('./submission-initialization-request.js');
const SubmissionState = require('./submission-state.js');
const SubmissionStatus = require('./submission-status.js');
const SubmissionStepReview = require('./submission-step-review.js');
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
const Upload = require('./upload.js');
const GroupUpload = require('./group-upload.js');
const Step = require('./step.js');
const StepUpdate = require('./step-update.js');
const Section = require('./section.js');
const AttachmentUpload = require('./attachment-upload.js');
const StepUpload = require('./step-upload.js');
const SubmissionCountByWorkflow = require('./submission-count-by-workflow.js');
const UploadComplete = require('./upload-complete.js');
const UploadMultipartStart = require('./upload-multipart-start.js');

const models = {
  Action,
  ActionInvokeRequest,
  BasicResponse,
  CodeValidation,
  Conversation,
  ConversationAddRemoveUser,
  ConversationEdpuser,
  ConversationList,
  ConversationNotes,
  CreateTempUploadFile,
  CreateTempUploadFileResponse,
  DAAC,
  FileListResponse,
  FileUploadResponse,
  Form,
  FormCreate,
  FormSections,
  FormUpdate,
  Group,
  GroupDetails,
  GetPartUrl,
  GetPartUrlResponse,
  Id,
  Note,
  NoteAddViewers,
  NoteRemoveViewer,
  NoteAddViewerRoles,
  NoteRemoveViewerRole,
  NoteScope,
  NotificationReplyRequest,
  NotificationSendRequest,
  MetricsGenerateReport,
  MetricsGenerateReportResp,
  MetricsGetDaacsResp,
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
  SubmissionCountByWorkflow,
  SubmissionOperationAll,
  SubmissionDetails,
  SubmissionOperationAddContributors,
  SubmissionOperationApply,
  SubmissionOperationChangeStep,
  SubmissionOperationCopySubmission,
  SubmissionOperationCustomResponse,
  SubmissionOperationFindAllResponse,
  SubmissionOperationMetadata,
  SubmissionOperationRemoveContributor,
  SubmissionOperationReview,
  SubmissionOperationSubmit,
  SubmissionOperationEsdisReview,
  SubmissionInitializationRequest,
  SubmissionOperationAssignDaacs,
  SubmissionState,
  SubmissionStatus,
  SubmissionStepReview,
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
  StepUpload,
  UploadComplete,
  UploadMultipartStart
};

function allModels(basePath) {
  return Object.entries(models).reduce((acc, [name, { model }]) => {
    acc[name] = model(basePath);
    return acc;
  }, {});
}

function getModel(name) {
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
