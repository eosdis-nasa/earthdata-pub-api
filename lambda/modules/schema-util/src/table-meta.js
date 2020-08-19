module.exports.action = {
  schema: '#/Action',
  remap: false,
  versioned: 'action_name'
};

module.exports.communication = {
  schema: '#/Communication',
  remap: false
};

module.exports.daac = {
  schema: '#/DAAC',
  remap: false
};

module.exports.form = {
  schema: '#/Form',
  remap: false,
  versioned: 'form_name',
  foreign: {
    nested: {
      question: ['sections', 'n', 'questions', 'n']
    }
  }
};

module.exports.group = {
  schema: '#/Group',
  remap: false
};

module.exports.membership = {
  schema: '#/Membership',
  remap: false,
  foreign: {
    ref: {
      user: ['id'],
      group: ['group_id']
    }
  }
};

module.exports.note = {
  schema: '#/Note',
  remap: false
};

module.exports.permission = {
  schema: '#/Permission',
  remap: true,
  foreign: {
    ref: {
      action: ['action_id'],
      daac: ['daac_id'],
      form: ['form_id'],
      question: ['question_id'],
      submission: ['submission_id'],
      workflow: ['workflow_id']
    }
  }
};

module.exports.question = {
  schema: '#/Question',
  remap: false,
  versioned: 'question_name'
};

module.exports.service = {
  schema: '#/Service',
  remap: false
}

module.exports.submission = {
  schema: '#/Submission',
  remap: false,
  foreign: {
    nested: {
      workflow: ['workflow']
    },
    ref: {
      workflow: ['workflow_id']
    }
  }
};

module.exports.subscription = {
  schema: '#/Subscription',
  remap: true,
  foreign: {
    ref: {
      action: ['action_id'],
      submission: ['submission_id'],
      workflow: ['workflow_id'],
      daac: ['daac_id']
    }
  }
};

module.exports.user = {
  schema: '#/User',
  remap: false
};

module.exports.workflow = {
  schema: '#/Workflow',
  remap: false,
  versioned: 'workflow_name',
  foreign: {
    ref: {
      daac: ['daac_id'],
      action: ['steps', '*', 'action_id'],
      form: ['steps', '*', 'form_id'],
      service: ['steps', '*', 'service_id'],
      user: ['steps', '*', 'user_id'],
      group: ['steps', '*', 'group_id']
    }
  }
};
