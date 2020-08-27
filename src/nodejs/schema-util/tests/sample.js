module.exports.workflow = {
  id: '4bc927f2-f34a-4033-afe3-02520cc7dcf7',
  version: 1,
  workflow_name: 'sample_workflow',
  daac_id: '15df4fda-ed0d-417f-9124-558fb5e5b561',
  entry: '1',
  steps: {
    1: {
      type: 'form',
      form_id: '6c544723-241c-4896-a38c-adbc0a364293',
      next_step: '2'
    },
    2: {
      type: 'action',
      action_id: '3a92a22a-b47d-4c54-b075-bfe348b8de98',
      input: {},
      next_step: '3',
      prev_step: '1'
    },
    3: {
      type: 'review',
      step: '2',
      reviewer_id: '54ce2972-39a7-49d4-af07-6b014a3bddfe',
      prev_step: '2'
    }
  }
};

module.exports.submission = {
  id: '5268441e-3bdb-49a5-8fe6-cd853bfaa829',
  workflow_id: '4bc927f2-f34a-4033-afe3-02520cc7dcf7',
  workflow: {
    id: '4bc927f2-f34a-4033-afe3-02520cc7dcf7',
    version: 1,
    workflow_name: 'sample_workflow',
    initiator_id: '54ce2972-39a7-49d4-af07-6b014a3bddfe',
    daac_id: '15df4fda-ed0d-417f-9124-558fb5e5b561',
    entry: '1',
    steps: {
      1: {
        type: 'form',
        form_id: '6c544723-241c-4896-a38c-adbc0a364293',
        next_step: '2'
      },
      2: {
        type: 'action',
        action_id: '3a92a22a-b47d-4c54-b075-bfe348b8de98',
        input: {},
        next_step: '3',
        prev_step: '1'
      },
      3: {
        type: 'review',
        step: '2',
        reviewer: '54ce2972-39a7-49d4-af07-6b014a3bddfe',
        prev_step: '2'
      }
    }
  },
  completed: {
    1: false,
    2: false,
    3: false
  },
  step: '1',
  lock: false,
  form_data: {},
  action_data: {}
};

module.exports.form = {
  id: 'f1f11ff1-f1f1-41ff-bfff-1ff1f1f1ff11',
  version: 1,
  form_name: 'VALID_FORM',
  text: 'A sample form with valid question foreign key.',
  sections: [
    {
      heading: 'First Section',
      questions: [
        {
          id: 'a1a11aa1-a1a1-41aa-baaa-1aa1a1a1aa11',
          version: 1,
          unique_name: 'poc_info',
          title: 'Point of Contact',
          text: 'A question for contact information may look like this. Name and Email are required, but for this example Organization is optional.',
          help: 'This is a helpful tooltip with more information about the question.',
          inputs: [
            {
              type: 'text',
              id: 'poc_info_name',
              label: 'Name',
              validation_error_msg: 'Please enter a name for the point of contact.',
              required: true
            },
            {
              type: 'text',
              id: 'poc_info_organization',
              label: 'Organization',
              validation_error_msg: 'Please enter an organization.'
            },
            {
              type: 'email',
              id: 'poc_info_email',
              label: 'Email',
              validator: 'not_null',
              validation_error_msg: 'Please enter an email.',
              required: true
            }
          ]
        }
      ]
    }
  ]
};
module.exports.questions = [
  {
    id: {
      S: 'a1a11aa1-a1a1-41aa-baaa-1aa1a1a1aa11'
    },
    version: {
      N: '1'
    },
    question_name: {
      S: 'poc_info'
    },
    title: {
      S: 'Point of Contact'
    },
    text: {
      S: 'A question for contact information may look like this. Name and Email are required, but for this example Organization is optional.'
    },
    help: {
      S: 'This is a helpful tooltip with more information about the question.'
    },
    inputs: {
      L: [
        {
          M: {
            type: {
              S: 'text'
            },
            id: {
              S: 'poc_info_name'
            },
            label: {
              S: 'Name'
            },
            validation_error_msg: {
              S: 'Please enter a name for the point of contact.'
            },
            required: {
              BOOL: true
            }
          }
        },
        {
          M: {
            type: {
              S: 'text'
            },
            id: {
              S: 'poc_info_organization'
            },
            label: {
              S: 'Organization'
            },
            validation_error_msg: {
              S: 'Please enter an organization.'
            }
          }
        },
        {
          M: {
            type: {
              S: 'email'
            },
            id: {
              S: 'poc_info_email'
            },
            label: {
              S: 'Email'
            },
            validator: {
              S: 'not_null'
            },
            validation_error_msg: {
              S: 'Please enter an email.'
            },
            required: {
              BOOL: true
            }
          }
        }
      ]
    }
  },
  {
    id: {
      S: 'a2a22aa2-a2a2-42aa-baaa-2aa2a2a2aa22'
    },
    version: {
      N: '2'
    },
    question_name: {
      S: 'poc_info'
    },
    title: {
      S: 'Point of Contact'
    },
    text: {
      S: 'A question for contact information may look like this. Name and Email are required, but for this example Organization is optional.'
    },
    help: {
      S: 'This is a helpful tooltip with more information about the question.'
    },
    inputs: {
      L: [
        {
          M: {
            type: {
              S: 'text'
            },
            id: {
              S: 'poc_info_name'
            },
            label: {
              S: 'Full Name'
            },
            validation_error_msg: {
              S: 'Please enter a name for the point of contact.'
            },
            required: {
              BOOL: true
            }
          }
        },
        {
          M: {
            type: {
              S: 'text'
            },
            id: {
              S: 'poc_info_organization'
            },
            label: {
              S: 'Organization'
            },
            validation_error_msg: {
              S: 'Please enter an organization.'
            }
          }
        },
        {
          M: {
            type: {
              S: 'email'
            },
            id: {
              S: 'poc_info_email'
            },
            label: {
              S: 'Email'
            },
            validator: {
              S: 'not_null'
            },
            validation_error_msg: {
              S: 'Please enter an email.'
            },
            required: {
              BOOL: true
            }
          }
        }
      ]
    }
  },
  {
    id: {
      S: 'b1b11bb1-b1b1-41bb-bbbb-1bb1b1b1bb11'
    },
    version: {
      N: '1'
    },
    question_name: {
      S: 'checkboxes'
    },
    title: {
      S: 'Checkbox Example'
    },
    text: {
      S: 'These are a lot of checkboxes. Please check them.'
    },
    help: {
      S: 'Checkboxes can be used where 0 or more choices should be made from given options.'
    },
    inputs: {
      L: [
        {
          M: {
            type: {
              S: 'checkbox'
            },
            id: {
              S: 'checkboxes_banana'
            },
            label: {
              S: 'Banana'
            }
          }
        },
        {
          M: {
            type: {
              S: 'checkbox'
            },
            id: {
              S: 'checkboxes_apple'
            },
            label: {
              S: 'Apple'
            }
          }
        },
        {
          M: {
            type: {
              S: 'checkbox'
            },
            id: {
              S: 'checkboxes_strawberry'
            },
            label: {
              S: 'Strawberry'
            }
          }
        },
        {
          M: {
            type: {
              S: 'checkbox'
            },
            id: {
              S: 'checkboxes_potato'
            },
            label: {
              S: 'Potato'
            }
          }
        }
      ]
    }
  }
];

module.exports.action = {
  id: '3a92a22a-b47d-4c54-b075-bfe348b8de98',
  action_name: 'console_log',
  description: 'A sample action that simply logs the submission entity in its current state.',
  version: 1,
  file_key: '1734c8d3b028f603483d60ab3ab8a61cf6a41f93709cf47fa01d30a90ee2282c',
  input_schema: {
    type: 'object',
    properties: {
      submission_id: { type: 'string' }
    }
  }
};

module.exports.invalid_schema = {
  id: 3870298740329847,
  action_name: 'console_log',
  description: 'A sample action with an invalid id.',
  version: 1,
  file_key: '1734c8d3b028f603483d60ab3ab8a61cf6a41f93709cf47fa01d30a90ee2282c',
  input_schema: {
    type: 'object',
    properties: {
      submission_id: { type: 'string' }
    }
  }
};
