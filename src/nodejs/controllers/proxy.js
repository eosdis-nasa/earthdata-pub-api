const latency = parseInt(process.env.SIMULATED_LATENCY || '0');
const handlers = require('./handlers.js');

module.exports.actionFindById = function actionFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'action',
    operation: 'findById',
    params: { id: params.id.value },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.actionFindAll = function actionFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'action',
    operation: 'findAll',
    params: {
      query: {
        sort: params.sort.value,
        order: params.order.value,
        per_page: params.per_page.value,
        page: params.page.value
      }
    },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.daacFindById = function daacFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'daac',
    operation: 'findById',
    params: { id: params.id.value },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.daacFindAll = function daacFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'daac',
    operation: 'findAll',
    params: {
      query: {
        sort: params.sort.value,
        order: params.order.value,
        per_page: params.per_page.value,
        page: params.page.value
      }
    },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.formFindById = function formFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'form',
    operation: 'formFindById',
    form_id: params.id.value,
    params: {
      daac_id: params.daac_id.value
    },
    context: { user_id: req.user_id }
  };
  handlers.form(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.createForm = function createForm(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'form',
    operation: 'createForm',
    params: params.payload.value,
    context:  { user_id: req.user_id }
  };
  handlers.form(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.updateForm = function updateForm(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'form',
    operation: 'updateForm',
    params: params.payload.value,
    context:  { user_id: req.user_id }
  };
  handlers.form(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.formFindAll = function formFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'form',
    operation: 'formFindAll',
    params: {
      short_name: params.short_name.value,
      version: params.version.value,
      long_name: params.long_name.value,
      created_after: params.created_after.value,
      created_before: params.created_before.value,
      sort: params.sort.value,
      order: params.order.value,
      per_page: params.per_page.value,
      page: params.page.value
    },
    context: { user_id: req.user_id }
  };
  handlers.form(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.groupFindById = function groupFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'group',
    operation: 'findById',
    params: { id: params.id.value },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.groupFindAll = function groupFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'group',
    operation: 'findAll',
    params: {
      short_name: params.short_name.value,
      long_name: params.long_name.value,
      sort: params.sort.value,
      order: params.order.value,
      per_page: params.per_page.value,
      page: params.page.value
    },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.roleFindById = function roleFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'role',
    operation: 'findById',
    params: { id: params.id.value },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.roleFindAll = function roleFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'role',
    operation: 'findAll',
    params: {
      short_name: params.short_name.value,
      long_name: params.long_name.value,
      sort: params.sort.value,
      order: params.order.value,
      per_page: params.per_page.value,
      page: params.page.value
    },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.noteFindById = function noteFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'note',
    operation: 'findById',
    params: { id: params.id.value },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.questionFindById = function questionFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'question',
    operation: 'findById',
    params: { id: params.id.value },
    context: { user_id: req.user_id }
  };
  handlers.questions(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.questionUpdate = function questionUpdate(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'question',
    operation: 'update',
    params: { payload: params.payload.value },
    context: { user_id: req.user_id }
  };
  handlers.questions(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.questionAdd = function questionAdd(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'question',
    operation: 'add',
    params: { payload: params.payload.value },
    context: { user_id: req.user_id }
  };
  handlers.questions(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency)
  });
};

module.exports.questionFindAll = function questionFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'question',
    operation: 'findAll',
    params: {
      query: {
        sort: params.sort.value,
        order: params.order.value,
        per_page: params.per_page.value,
        page: params.page.value
      }
    },
    context: { user_id: req.user_id }
  };
  handlers.questions(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.questionInputUpdate = function questionInputUpdate(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'question',
    operation: 'updateInputs',
    params: {
      questionId: params.id.value,
      inputs: params.payload.value
    },
    context: { user_id: req.user_id }
  };
  handlers.questions(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency)
  });
};

module.exports.inputFindById = function inputFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'question',
    operation: 'inputFindById',
    params: { id: params.id.value, control_id: params.controlId.value },
    context: { user_id: req.user_id }
  };
  handlers.questions(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.inputFindAll = function inputFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'question',
    operation: 'inputFindAll',
    params: {
      query: {  
      }
    },
    context: { user_id: req.user_id }
  };
  handlers.questions(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};


module.exports.createInput = function createInput(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'question',
    operation: 'createInput',
    params: params.payload.value,
    context: { user_id: req.user_id }
  };
  handlers.questions(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency)
  });
};

module.exports.updateInput = function updateInput(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'question',
    operation: 'updateInput',
    params: params.payload.value,
    context: { user_id: req.user_id }
  };
  handlers.questions(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency)
  });
};

module.exports.serviceFindById = function serviceFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'service',
    operation: 'findById',
    params: { id: params.id.value },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.serviceFindAll = function serviceFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'service',
    operation: 'findAll',
    params: {
      query: {
        sort: params.sort.value,
        order: params.order.value,
        per_page: params.per_page.value,
        page: params.page.value
      }
    },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.submissionFindById = function submissionFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'submission',
    operation: 'findById',
    params: { id: params.id.value },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.submissionFindAll = function submissionFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'submission',
    operation: 'findAll',
    params: {
      name: params.name.value,
      user_id: params.user_id.value,
      daac_id: params.daac_id.value,
      workflow_id: params.workflow_id.value,
      workflow_name: params.workflow_name.value,
      step_name: params.step_name.value,
      step_type: params.step_type.value,
      status: params.status.value,
      created_after: params.created_after.value,
      created_before: params.created_before.value,
      last_change_after: params.last_change_after.value,
      last_change_before: params.last_change_before.value,
      hidden: params.hidden.value,
      sort: params.sort.value,
      order: params.order.value,
      per_page: params.per_page.value,
      page: params.page.value
    },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.getSubmissionDetailsById = function getSubmissionDetailsById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'submission',
    operation: 'getDetails',
    context: { user_id: req.user_id },
    params: { id: params.id.value }
  };
  handlers.submission(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.validateCode = function validateCode(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'submission',
    operation: 'validateCode',
    context: { user_id: req.user_id },
    code: params.code.value
  };
  handlers.submission(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.userFindById = function userFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'user',
    operation: 'findById',
    params: { id: params.id.value },
    context: { user_id: req.user_id }
  };
  handlers.user(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.userFindAll = function userFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'user',
    operation: 'findAll',
    params: {
          name: params.name.value,
          email: params.email.value,
          sort: params.sort.value,
          order: params.order.value,
          per_page: params.per_page.value,
          page: params.page.value,
          group_id: params.group_id.value,
          role_id: params.role_id.value
    },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.userDetails = function userDetails(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'user',
    operation: 'getDetailedUsers',
    params: {
          name: params.name.value,
          email: params.email.value,
          sort: params.sort.value,
          order: params.order.value,
          per_page: params.per_page.value,
          page: params.page.value,
          group_id: params.group_id.value,
          role_id: params.role_id.value
    },
    context: { user_id: req.user_id }
  };
  handlers.user(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.workflowFindById = function workflowFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'workflow',
    operation: 'findById',
    params: { id: params.id.value },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.createWorkflow = function workflowPut(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'workflow',
    operation: 'createWorkflow',
    params: params.payload.value,
    context:  { user_id: req.user_id }
  };
  handlers.workflow(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.workflowFindAll = function workflowFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'workflow',
    operation: 'findAll',
    params: {
      query: {
        sort: params.sort.value,
        order: params.order.value,
        per_page: params.per_page.value,
        page: params.page.value
      }
    },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.notificationSend = function notificationSend(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: 'send',
    ...params.payload.value,
    context: { user_id: req.user_id }
  };
  handlers.notification(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.notificationReply = function notificationReply(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: 'reply',
    ...params.payload.value,
    context: { user_id: req.user_id }
  };
  handlers.notification(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.notificationAddUser = function notificationAddUser(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: 'add_user',
    ...params.payload.value,
    context: { user_id: req.user_id }
  };
  handlers.notification(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.notificationRemoveUser = function notificationRemoveUser(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: 'remove_user',
    ...params.payload.value,
    context: { user_id: req.user_id }
  };
  handlers.notification(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.notificationConversations = function notificationConversations(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: 'conversations',
    context: { user_id: req.user_id }
  };
  handlers.notification(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.notificationConversation = function notificationConversation(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: 'conversation',
    conversation_id: params.id.value,
    params: {
        detailed: params.detailed.value || false,
        ...params.step_name.value && { step_name: params.step_name.value }
    },
    context: { user_id: req.user_id }
  };
  handlers.notification(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.notificationAddViewers = function notificationAddViewers(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: 'add_viewers',
    context: { user_id: req.user_id },
    ...params.payload.value
  };
  handlers.notification(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.notificationRemoveViewer = function notificationRemoveViewer(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: 'remove_viewer',
    context: { user_id: req.user_id },
    ...params.payload.value
  };
  handlers.notification(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.notificationAddViewerRoles = function notificationAddViewerRoles(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: 'add_viewer_roles',
    context: { user_id: req.user_id },
    ...params.payload.value
  };
  handlers.notification(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.notificationRemoveViewerRole = function notificationRemoveViewerRole(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: 'remove_viewer_role',
    context: { user_id: req.user_id },
    ...params.payload.value
  };
  handlers.notification(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.getSubscriptions = function getSubscriptions(req, res, next) {
  const body = { message: 'Not implemented' };
  setTimeout(() => res.send(body), latency);
};

module.exports.subscribe = function subscribe(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = params.payload.value;
  Object.assign(lambdaEvent, { context: { user_id: req.user_id } });
  handlers.subscribe(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.actionInvoke = function actionInvoke(req, res, next) {
  const body = { message: 'Not implemented' };
  setTimeout(() => res.send(body), latency);
};

module.exports.actionRegister = function actionRegister(req, res, next) {
  const body = { message: 'Not implemented' };
  setTimeout(() => res.send(body), latency);
};

module.exports.userOperationGet = function userOperationGet(req, res, next) {
  const params = Object.entries(req.swagger.params).reduce((acc, [key, value]) => {
    Object.assign(acc, { [key]: value.value });
    return acc;
  }, {});
  const { payload } = params;
  const lambdaEvent = {
    operation: params.operation.value,
    ...params,
    context: { user_id: req.user_id }
  };
  handlers.user(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.userOperationPost = function userOperationPost(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    operation: params.operation.value,
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.user(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.submissionOperationInitialize = function submissionOperationInitialize(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    operation: 'initialize',
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.submission(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.submissionOperationActive = function submissionOperationActive(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    operation: 'active',
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.submission(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.submissionOperationInactive = function submissionOperationInactive(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    operation: 'inactive',
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.submission(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.submissionOperationApply = function submissionOperationApply(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    operation: 'apply',
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.submission(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.submissionOperationMetadata = function submissionOperationMetadata(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    operation: 'metadata',
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.submission(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.submissionOperationSubmit = function submissionOperationSubmit(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    operation: 'submit',
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.submission(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.submissionOperationSave = function submissionOperationSave(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    operation: 'save',
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.submission(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.submissionOperationReview = function submissionOperationReview(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    operation: 'review',
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.submission(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.submissionOperationEsdisReview = function submissionOperationEsdisReview(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    operation: 'esdisReview',
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.submission(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.submissionOperationResume = function submissionOperationResume(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    operation: 'resume',
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.submission(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.submissionOperationLock = function submissionOperationLock(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    operation: 'lock',
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.submission(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.submissionOperationUnlock = function submissionOperationUnlock(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    operation: 'unlock',
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.submission(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.submissionOperationWithdraw = function submissionOperationWithdraw(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    operation: 'withdraw',
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.submission(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.submissionOperationRestore = function submissionOperationRestore(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    operation: 'restore',
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.submission(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.submissionOperationChangeStep = function submissionOperationChangeStep(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    operation: 'changeStep',
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.submission(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.submissionOperationPromoteStep = function submissionOperationPromoteStep(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    operation: 'promoteStep',
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.submission(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.submissionOperationAddContributors = function submissionOperationAddContributors(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    operation: 'addContributors',
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.submission(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.submissionOperationRemoveContributor = function submissionOperationRemoveContributor(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    operation: 'removeContributor',
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.submission(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.submissionOperationCopySubmission = function submissionOperationCopySubmission(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    operation: 'copySubmission',
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.submission(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.submissionOperationMapMetadata = function submissionOperationMapMetadata(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    operation: 'mapMetadata',
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.submission(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.submissionOperationAssignDaacs = function submissionOperationAssignDaacs(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    operation: 'assignDaacs',
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.submission(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.searchMetrics = function searchMetrics(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: 'search',
    filter: {
      ...(params.start && { start: params.start.value }),
      ...(params.end && { end: params.end.value }),
      ...(params.event_type && { event_type: params.event_type.value }),
      ...(params.count && { count: params.count.value })
    },
    context: { user_id: req.user_id }
  };
  handlers.metrics(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.putMetric = function putMetric(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: 'put',
    data: params.payload.value,
    context: { user_id: req.user_id }
  };
  handlers.metrics(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.getPublicationMetrics = function getPublicationMetrics(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: 'get_submissions',
    payload: params.payload.value,
    context: { user_id: req.user_id }
  };
  handlers.metrics(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.metricsGetDaacs = function metricsGetDaacs(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: 'get_daacs',
    context: { user_id: req.user_id }
  };
  handlers.metrics(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.metricsListReports = function metricsListReports(req, res, next) {
  const body = ["2021-06-20", "2021-06-21", "2021-06-22"];
  setTimeout(() => res.send(body), latency);
};

module.exports.metricsGetReport = function putMetric(req, res, next) {
  const file = `${__dirname}/static/2021-06-20.json`
  setTimeout(() => res.sendFile(file), latency);
};

module.exports.getModel = function getModel(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    model: params.model.value,
    context: { user_id: req.user_id }
  };
  handlers.model(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.moduleList = function moduleList(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: "list",
    context: { user_id: req.user_id }
  }
  handlers.module(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
}

module.exports.moduleInterface = function moduleInterface(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: "interface",
    module: params.module.value,
    context: { user_id: req.user_id }
  }
  const file = `${__dirname}/static/module-ui.html`
  setTimeout(() => res.sendFile(file), latency);
}

module.exports.moduleRequest = function moduleRequest(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: "request",
    module: params.module.value,
    payload: params.payload.value,
    context: { user_id: req.user_id }
  }
  const { payload } = lambdaEvent;
  if (payload.operation == "test") {
    const body = { message: 'Success' };
    setTimeout(() => res.send(body), latency);
  }
  else {
    const body = { error: 'Error' };
    setTimeout(() => res.send(body), latency);
  }
}

module.exports.getToken = function getToken(req, res, next) {
  const { params } = req.swagger;
  const { host } = req.headers;
  const lambdaEvent = {
    code: params.code.value,
    state: params.state.value,
    host
  };
  handlers.auth(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.refreshToken = function refreshToken(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    refresh: true,
    context: { user_id: req.user_id }
  };
  handlers.auth(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.getVersion = function getVersion(req, res, next) {
  const lambdaEvent = {};
  handlers.version(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.pageFindById = function pageFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'page',
    operation: 'findById',
    params: { page_key: params.page_key.value }
  };
  handlers.data(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.pageFindAll = function pageFindAll(req, res, next) {
  const lambdaEvent = {
    resource: 'page',
    operation: 'findAll'
  };
  handlers.data(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.pagePut = function pagePut(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'page',
    operation: 'update',
    params: {
      payload: params.payload.value,
    },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.editWorkflow = function editWorkflow(req, res, next){
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'workflow',
    operation: 'editWorkflow',
    params: params.payload.value,
    context:  { user_id: req.user_id }
  };
  handlers.workflow(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
}

module.exports.fileUpload = function fileUpload(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    resource: 'upload',
    operation: 'getPostUrl',
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.fileUpload(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.groupFileUpload = function groupFileUpload(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    resource: 'upload',
    operation: 'getGroupUploadUrl',
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.fileUpload(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.attachmentFileUpload = function attachmentFileUpload(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    resource: 'upload',
    operation: 'getAttachmentUploadUrl',
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.fileUpload(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.uploadStepUrl = function uploadStepUrl(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    resource: 'upload',
    operation: 'getUploadStepUrl',
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.fileUpload(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.listFiles = function listFiles(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: 'listFiles',
    submission_id: params.submission_id.value,
    context: { user_id: req.user_id }
  };
  handlers.fileUpload(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.listStepFiles = function listStepFiles(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: 'listStepFiles',
    submission_id: params.submission_id.value,
    context: { user_id: req.user_id }
  };
  handlers.fileUpload(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.getDownloadUrl = function getDownloadUrl(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: 'getDownloadUrl',
    key: params.key.value,
    context: { user_id: req.user_id }
  };
  handlers.fileUpload(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
}

module.exports.getUploadStep = function getUploadStep(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'upload',
    operation: 'getUploadStep',
    upload_step_id: params.upload_step_id.value,
    context: { user_id: req.user_id }
  };
  handlers.fileUpload(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.getOverviewApp = function getOverviewApp(req, res, next) {
  res.send({
    message: 'Placeholder for overview app root endpoint.'
  });
};

module.exports.getOverviewAppSubpath = function getOverviewAppSubpath(req, res, next) {
  res.send({
    message: 'Placeholder for overview app subpath endpoint.'
  });
};

module.exports.getOverviewAppGettingStarted = function getOverviewAppGettingStarted(req, res, next) {
  res.send({
    message: 'Placeholder for overview app getting_started subpath endpoint.'
  });
};

module.exports.getOverviewAppDataPublicationGuidelines = function getOverviewAppDataPublicationGuidelines(req, res, next) {
  res.send({
    message: 'Placeholder for overview app data_publication_guidelines subpath endpoint.'
  });
};

module.exports.getDashboardApp = function getDashboardApp(req, res, next) {
  res.send({
    message: 'Placeholder for dashboard app root endpoint.'
  });
};

module.exports.getGettingStartedPage = function getGettingStartedPage(req, res, next) {
  res.send({
    message: 'Placeholder for Getting Started Page.'
  });
};

module.exports.getDataPubGuidelinesPage = function getDataPubGuidelinesPage(req, res, next) {
  res.send({
    message: 'Placeholder for Data Pub Guidelines Page.'
  });
};

module.exports.getDashboardAppSubpath = function getDashboardAppSubpath(req, res, next) {
  res.send({
    message: 'Placeholder for dashboard app subpath endpoint.'
  });
};

module.exports.getFormsApp = function getFormsApp(req, res, next) {
  res.send({
    message: 'Placeholder for forms app root endpoint.'
  });
};

module.exports.getFormsAppSubpath = function getFormsAppSubpath(req, res, next) {
  res.send({
    message: 'Placeholder for forms app subpath endpoint.'
  });
};

module.exports.onboardDaac = function onboardDaac(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    operation: 'onboardDaac',
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.data(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.offboardDaac = function offboardDaac(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;
  const lambdaEvent = {
    operation: 'offboardDaac',
    context: { user_id: req.user_id },
    ...payload.value
  };
  handlers.data(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.createStep = function createStep(req, res, next){
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'step',
    operation: 'createStep',
    params: params.payload.value,
    context:  { user_id: req.user_id }
  };
  handlers.workflow(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
}

module.exports.editStep = function editStep(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'step',
    operation: 'createStep',
    params: params.payload.value,
    context:  { user_id: req.user_id }
  };
  lambdaEvent.params.step_id = params.step_id.value;
  handlers.workflow(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
}

module.exports.stepFindAll = function stepFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'step',
    operation: 'stepFindAll',
    params: {
      query: {
        sort: params.sort.value,
        order: params.order.value,
        per_page: params.per_page.value,
        page: params.page.value
      }
    },
    context: { user_id: req.user_id }
  };
  handlers.workflow(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.stepFindById = function stepFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'step',
    operation: 'stepFindById',
    params: { step_id: params.step_id.value },
    context: { user_id: req.user_id }
  };
  handlers.workflow(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.createStepReviewApproval = function createStepReviewApproval(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;

  const lambdaEvent = {
    operation: 'createStepReviewApproval',
    stepName: payload.value.step_name,
    submissionId: payload.value.id,
    userIds: payload.value.user_list,
    context: { user_id: req.user_id }
  };

  handlers.submission(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.getStepReviewApproval = function getStepReviewApproval(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: 'getStepReviewApproval',
    params: { id: params.id.value },
    context: { user_id: req.user_id }
  };

  handlers.submission(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.deleteStepReviewApproval = function deleteStepReviewApproval(req, res, next) {
  const { params } = req.swagger;
  const { payload } = params;

  const lambdaEvent = {
    operation: 'deleteStepReviewApproval',
    stepName: payload.value.step_name,
    submissionId: payload.value.id,
    userIds: payload.value.user_list,
    context: { user_id: req.user_id }
  };

  handlers.submission(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.associateMfa = function associateMfa(req, res, next) {
  res.send({
    message: 'Local placeholder for associate MFA function.'
  });
}

module.exports.verifyMfa = function verifyMfa(req, res, next) {
  res.send({
    message: 'Local placeholder for verify MFA function.'
  });
}

module.exports.editSection = function editSection(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: 'editSection',
    params: params.payload.value,
    context:  { user_id: req.user_id }
  };
  lambdaEvent.params.id = params.id.value;
  handlers.form(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
}

module.exports.addSection = function addSection(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    operation: 'addSection',
    params: params.payload.value,
    context:  { user_id: req.user_id }
  };

  handlers.form(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
}

module.exports.sectionFindAll = function sectionFindAll(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'section',
    operation: 'findAll',
    params: {
      query: {
        sort: params.sort.value,
        order: params.order.value,
        per_page: params.per_page.value,
        page: params.page.value
      }
    },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};

module.exports.sectionFindById = function sectionFindById(req, res, next) {
  const { params } = req.swagger;
  const lambdaEvent = {
    resource: 'section',
    operation: 'findById',
    params: { id: params.id.value },
    context: { user_id: req.user_id }
  };
  handlers.data(lambdaEvent).then((body) => {
    setTimeout(() => res.send(body), latency);
  });
};