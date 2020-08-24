module.exports.params = {
  get: {
    TableName: 'form',
    Index: 'form_name',
    KeyConditionExpression: 'form_name = :form_name and version = :version',
    ExpressionAttributeValues: {
      ':form_name': {
        S: 'VALID_FORM'
      },
      ':version': {
        N: '1'
      }
    }
  },
  put: {
    Item: {
      id: {
        S: 'f1f11ff1-f1f1-41ff-bfff-1ff1f1f1ff11'
      },
      version: {
        N: '1'
      },
      form_name: {
        S: 'VALID_FORM'
      },
      text: {
        S: 'A sample form with valid question foreign key.'
      },
      sections: {
        L: [
          {
            M: {
              heading: {
                S: 'First Section'
              },
              questions: {
                L: [
                  {
                    M: {
                      id: {
                        S: 'a1a11aa1-a1a1-41aa-baaa-1aa1a1a1aa11'
                      },
                      version: {
                        N: '1'
                      },
                      unique_name: {
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
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    },
    TableName: 'form'
  },
  delete: {
    TableName: 'form',
    Key: {
      id: {
        S: 'f1f11ff1-f1f1-41ff-bfff-1ff1f1f1ff11'
      }
    }
  },
  update: {
    TableName: 'form',
    Key: {
      id: {
        S: 'f1f11ff1-f1f1-41ff-bfff-1ff1f1f1ff11'
      }
    },
    ExpressionAttributeNames: {
      '#att_one': 'att_one',
      '#att_two': 'att_two'
    },
    ExpressionAttributeValues: {
      ':att_one': {
        N: '1'
      },
      ':att_two': {
        S: 'test_value'
      }
    },
    UpdateExpression: 'SET #att_one = :att_one, #att_two = :att_two'
  }
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
