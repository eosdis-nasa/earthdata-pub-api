module.exports = {
  UUID: {
    description: 'UUID assigned to an item.',
    type: 'string',
    pattern: '^[a-f|0-9]{8}-[a-f|0-9]{4}-4[a-f|0-9]{3}-[89ab][a-f|0-9]{3}-[a-f|0-9]{12}$'
  },
  DashboardRequest: {
    description: 'Request body sent to Dashboard endpoint.',
    type: 'object'
  },
  InformationRequest: {
    description: 'Request body sent to Information endpoint.',
    oneOf: [
      { $ref: '#/Form' },
      { $ref: '#/Question' },
      { $ref: '#/Workflow' }
    ]
  },
  InvokeRequest: {
    description: 'Request body sent to external action request handler.',
    type: 'object',
    properties: {
      submission_id: { $ref: '#/UUID' },
      action_id: { $ref: '#/UUID' },
      input: { type: 'object' }
    }
  },
  NotifyRequest: {
    description: 'Request body sent to external notification request handler.',
    type: 'object',
    properties: {
      subject: { type: 'string' },
      text: { type: 'string' },
      to: {
        type: 'object',
        properties: {
          submission_id: { $ref: '#/UUID' },
          user_id: { $ref: '#/UUID' },
          group_id: { $ref: '#/UUID' }
        }
      }
    }
  },
  SubmissionRequest: {
    description: 'Request body sent to external Submission endpoint.',
    type: 'object'
  },
  SubscriptionRequest: {
    description: 'Request body sent to external Subscription endpoint.',
    type: 'object',
    properties: {
      action: { type: 'string', enum: ['subscribe', 'unsubscribe'] },
      source_id: { $ref: '#/UUID' },
      table_name: { type: 'string' }
    }
  },
  RegisterRequest: {
    description: 'Request body sent to external notification request handler.',
    type: 'object'
  },
  Response: {
    description: 'Response from Information endpoint',
    type: 'object',
    properties: {
      data: {
        oneOf: [
          { type: 'array', items: { $ref: '#/Form' } },
          { type: 'array', items: { $ref: '#/Question' } },
          { type: 'array', items: { $ref: '#/Workflow' } },
          { type: 'boolean' }
        ]
      },
      err: { type: 'string', nullable: true }
    }
  },
  Action: {
    description: 'The action table schema',
    type: 'object',
    properties: {
      id: { $ref: '#/UUID' },
      action_name: { type: 'string' },
      version: { type: 'number' },
      description: { type: 'string' },
      file_key: { type: 'string' },
      input_schema: { type: 'object' }
    }
  },
  Communication: {
    description: 'The communication table schema',
    type: 'object',
    properties: {
      id: { $ref: '#/UUID' },
      recipient_id: { $ref: '#/UUID' },
      source_id: { $ref: '#/UUID' },
      source_type: { type: 'string' },
      subject: { type: 'string' },
      text: { type: 'string' },
      timestamp: { type: 'string' }
    }
  },
  DAAC: {
    description: 'The daac table schema',
    type: 'object',
    properties: {
      id: { $ref: '#/UUID' },
      short_name: { type: 'string' },
      long_name: { type: 'string' },
      url: { type: 'string' },
      description: { type: 'string' }
    }
  },
  Form: {
    description: 'A template for a form with a collection of sections containing questions.',
    type: 'object',
    properties: {
      id: { $ref: '#/UUID' },
      version: { type: 'number' },
      form_name: { type: 'string' },
      text: { type: 'string' },
      sections: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            heading: { type: 'string' },
            questions: {
              type: 'array',
              items: { $ref: '#/Question' }
            }
          }
        }
      }
    }
  },
  Group: {
    description: 'The group table schema',
    type: 'object',
    properties: {
      id: {
        $ref: '#/UUID'
      },
      group_name: {
        type: 'string'
      }
    }
  },
  Membership: {
    description: 'The membership table schema',
    type: 'object',
    properties: {
      id: { $ref: '#/UUID' },
      group_id: { $ref: '#/UUID' }
    }
  },
  Note: {
    description: 'The note table schema',
    type: 'object',
    properties: {
      id: { $ref: '#/UUID' },
      recipient_id: { $ref: '#/UUID' },
      source_id: { $ref: '#/UUID' },
      source_type: { type: 'string' },
      subject: { type: 'string' },
      text: { type: 'string' },
      timestamp: { type: 'string' }
    }
  },
  Permission: {
    description: 'The permission table schema',
    type: 'object',
    properties: {
      id: { $ref: '#/UUID' },
      action_id: { $ref: '#/UUID' },
      daac_id: { $ref: '#/UUID' },
      form_id: { $ref: '#/UUID' },
      question_id: { $ref: '#/UUID' },
      submission_id: { $ref: '#/UUID' },
      workflow_id: { $ref: '#/UUID' }
    }
  },
  Question: {
    description: 'A grouping of related inputs to be displayed on a form',
    type: 'object',
    properties: {
      id: { $ref: '#/UUID' },
      version: { type: 'number' },
      question_name: { type: 'string' },
      title: { type: 'string' },
      text: { type: 'string' },
      help: { type: 'string' },
      inputs: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string' },
            id: { type: 'string' },
            label: { type: 'string' },
            required: { type: 'boolean' },
            attributes: { type: 'object' }
          }
        }
      }
    }
  },
  Service: {
    description: 'An external service connected with the EDPUB API.',
    type: 'object',
    properties: {
      id: { $ref: '#/UUID' },
      service_name: { type: 'string' },
      endpoint: { type: 'string' }
    }
  },
  Submission: {
    description: 'An archival request submission.',
    type: 'object',
    properties: {
      id: { $ref: '#/UUID' },
      initiator_id: { $ref: '#/UUID' },
      workflow: { $ref: '#/Workflow' },
      daac_id: { $ref: '#/UUID' },
      step: { type: 'string' },
      form_data: { type: 'object' },
      action_data: { type: 'object' },
      lock: {
        oneOf: [
          { $ref: '#/UUID' },
          { type: 'boolean' }
        ]
      }
    }
  },
  Subscription: {
    description: 'The subscription table schema',
    type: 'object',
    properties: {
      id: { $ref: '#/UUID' },
      action_id: { $ref: '#/UUID' },
      daac_id: { $ref: '#/UUID' },
      submission_id: { $ref: '#/UUID' },
      workflow_id: { $ref: '#/UUID' }
    }
  },
  User: {
    description: 'The user table schema',
    type: 'object',
    properties: {
      id: {
        $ref: '#/UUID'
      },
      user_name: {
        type: 'string'
      },
      email: {
        type: 'string'
      }
    }
  },
  Workflow: {
    description: 'A series of steps for processing a Submission',
    type: 'object',
    properties: {
      id: { $ref: '#/UUID' },
      version: { type: 'number' },
      workflow_name: { type: 'string' },
      daac_id: { $ref: '#/UUID' },
      entry: { type: 'string' },
      steps: {
        type: 'object',
        properties: {
          _numericKey: {
            oneOf: [
              { $ref: '#/ActionStep' },
              { $ref: '#/FormStep' },
              { $ref: '#/ReviewStep' },
              { $ref: '#/Service' }
            ]
          }
        }
      }
    }
  },
  ActionStep: {
    description: "An action step for constructing a Workflow. Value for type will always be 'action'.",
    type: 'object',
    properties: {
      type: { type: 'string' },
      action_id: { $ref: '#/UUID' },
      input: { type: 'object' },
      next_step: { type: 'string' },
      prev_step: { type: 'string' }
    }
  },
  FormStep: {
    description: "A form step for constructing a Workflow. Value for type will always be 'form'.",
    type: 'object',
    properties: {
      type: { type: 'string' },
      form_id: { $ref: '#/UUID' },
      next_step: { type: 'string' },
      prev_step: { type: 'string' }
    }
  },
  ReviewStep: {
    description: "A review step for constructing a Workflow. Value for type will always be 'review'.",
    type: 'object',
    properties: {
      type: { type: 'string' },
      user_id: { $ref: '#/UUID' },
      group_id: { $ref: '#/UUID' },
      next_step: { type: 'string' },
      prev_step: { type: 'string' }
    }
  },
  ServiceStep: {
    description: "A service step for constructing a Workflow. Value for type will always be 'service'.",
    type: 'object',
    properties: {
      type: { type: 'string' },
      service_id: { $ref: '#/UUID' },
      next_step: { type: 'string' },
      prev_step: { type: 'string' }
    }
  }
};
