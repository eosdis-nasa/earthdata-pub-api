
var form = {
    "id": "6c544723-241c-4896-a38c-adbc0a364293",
    "version": 1,
    "unique_name": "FAKEDAAC",
    "text": "This is an example form with example questions. Some of them are silly, some are not.",
    "sections": [
      {
        "heading": "First Section",
        "questions": [
          {
            "id": "b4e35cb9-d1e5-44cf-9ffb-6ad9d3f8ae34",
            "f_ref": "question"
          },
          {
            "id": "a9cdc22c-4532-47b3-863d-58f2fd07cdcf",
            "f_ref": "question"
          }
        ]
      },
      {
        "heading": "Second Section",
        "questions": [
          {
            "id": "5ae650df-548a-4a9f-80fa-920c9c48286b",
            "f_ref": "question"
          },
          {
            "id": "72803fee-e8b2-4d5e-87f5-5900e238b75a",
            "f_ref": "question"
          },
          {
            "id": "a9cdc22c-4532-47b3-863d-58f2fd07cdcf",
            "f_ref": "question"
          },
          {
            "id": "cff0d2ef-448a-4f9a-92d3-f2a8bc684dbe",
            "f_ref": "question"
          }
        ]
      },
      {
        "heading": "Third Section",
        "questions": [
          {
            "id": "dd60e9e0-a5a7-4f09-bbac-b00053041061",
            "f_ref": "question"
          },
          {
            "id": "917ffb7e-753e-483c-b499-f21864dbd52d",
            "f_ref": "question"
          },
          {
            "id": "f607e1a3-8f22-4d4f-9947-0d4a7651d56d",
            "f_ref": "question"
          }
        ]
      }
    ]
  }

var questions = {
  "b4e35cb9-d1e5-44cf-9ffb-6ad9d3f8ae34": {
    "id": "b4e35cb9-d1e5-44cf-9ffb-6ad9d3f8ae34",
    "version": 1,
    "unique_name": "poc_info",
    "title": "Point of Contact",
    "text": "A question for contact information may look like this. Name and Email are required, but for this example Organization is optional.",
    "help": "This is a helpful tooltip with more information about the question.",
    "inputs": [
      {
        "type": "text",
        "id": "poc_info_name",
        "label": "Name",
        "validation_error_msg": "Please enter a name for the point of contact.",
        "required": true
      },
      {
        "type": "text",
        "id": "poc_info_organization",
        "label": "Organization",
        "validation_error_msg": "Please enter an organization."
      },
      {
        "type": "email",
        "id": "poc_info_email",
        "label": "Email",
        "validator": "not_null",
        "validation_error_msg": "Please enter an email.",
        "required": true
      }
    ]
  },
  "a9cdc22c-4532-47b3-863d-58f2fd07cdcf": {
    "id": "a9cdc22c-4532-47b3-863d-58f2fd07cdcf",
    "version": 1,
    "unique_name": "checkboxes",
    "title": "Checkbox Example",
    "text": "These are a lot of checkboxes. Please check them.",
    "help": "Checkboxes can be used where 0 or more choices should be made from given options.",
    "inputs": [
      {
        "type": "checkbox",
        "id": "checkboxes_banana",
        "label": "Banana"
      },
      {
        "type": "checkbox",
        "id": "checkboxes_apple",
        "label": "Apple"
      },
      {
        "type": "checkbox",
        "id": "checkboxes_strawberry",
        "label": "Strawberry"
      },
      {
        "type": "checkbox",
        "id": "checkboxes_potato",
        "label": "Potato"
      }
    ]
  },
  "5ae650df-548a-4a9f-80fa-920c9c48286b": {
    "id": "5ae650df-548a-4a9f-80fa-920c9c48286b",
    "version": 1,
    "unique_name": "more_words",
    "title": "More Words",
    "text": "Can you enter some words in a single text input, and then more words in a multiline textarea?",
    "help": "This is a text input and a text area together. Attributes like rows and cols can be set explicitly here, or done client-side through styles.",
    "inputs": [
      {
        "type": "text",
        "id": "more_words_title",
        "label": "Title",
        "required": true,
        "validation_error_msg": "Please enter a title."
      },
      {
        "type": "textarea",
        "id": "more_words_description",
        "label": "Description",
        "validator": "not_null",
        "validation_error_msg": "Please enter a description.",
        "attributes": {
          "rows": 10,
          "cols": 80
        }
      }
    ]
  },
  "72803fee-e8b2-4d5e-87f5-5900e238b75a": {
    "id": "72803fee-e8b2-4d5e-87f5-5900e238b75a",
    "version": 1,
    "unique_name": "radios",
    "title": "Radios and Numbers",
    "text": "This is a question? Radio groups are good for when there should be exactly one choice made from predefined options.",
    "help": "This a number input coupled with a radio group. The positive validator checks that the input is a positive number.",
    "inputs": [
      {
        "type": "number",
        "id": "radios_amount",
        "label": "Amount",
        "required": true,
        "validator": "positive",
        "validation_error_msg": "You must enter a positive value."
      },
      {
        "type": "radio",
        "id": "radios_choice",
        "label": "Choice",
        "enums": [ "Choice 1", "Choice 2", "Choice 3", "Choice 4"]
      }
    ]
  },
  "a9cdc22c-4532-47b3-863d-58f2fd07cdcf": {
    "id": "a9cdc22c-4532-47b3-863d-58f2fd07cdcf",
    "version": 1,
    "unique_name": "dataset_restrictions",
    "title": "Dataset Restrictions",
    "text": "Can this data product be publicly released in compliance with NASA's Open Data Policy?",
    "help": "NASA Open Data Policy https://earthdata.nasa.gov/collaborate/open-data-services-and-software/data-information-policy",
    "required": true,
    "inputs": [
      {
        "type": "checkbox",
        "id": "dataset_restrictions_public",
        "label": "Releasable to public"
      }
    ]
  },
  "cff0d2ef-448a-4f9a-92d3-f2a8bc684dbe": {
    "id": "cff0d2ef-448a-4f9a-92d3-f2a8bc684dbe",
    "version": 1,
    "unique_name": "multiselect",
    "help": "You can select up to 2 items",
    "text": "Select the options to apply?",
    "title": "Multiselect Option",
    "inputs": [
      {
        "type": "select",
        "id": "multiselect_choice",
        "label": "Choose Carefully",
        "attributes": {
          "min": "1",
          "max": "2"
        },
        "enums": [
            "This is the first option",
            "This is the second option",
            "This is the third option"
        ],
        "validation_error_msg": "At least 1 and at most 2 should be selected."
      }
    ]
  },
  "dd60e9e0-a5a7-4f09-bbac-b00053041061": {
    "id": "dd60e9e0-a5a7-4f09-bbac-b00053041061",
    "version": 1,
    "unique_name": "example_file",
    "title": "Example File",
    "text": "This is an example of a file input.",
    "help": "This allows a user to specify a local file to upload.",
    "required": true,
    "inputs": [
      {
        "type": "file",
        "id": "example_file_upload",
        "label": "Upload File"
      }
    ]
  },
  "917ffb7e-753e-483c-b499-f21864dbd52d": {
    "id": "917ffb7e-753e-483c-b499-f21864dbd52d",
    "version": 1,
    "unique_name": "example_date",
    "title": "Example Date",
    "text": "This is an example of a data input.",
    "help": "This allows a user to select a date. Two date inputs could be combined in a question for a start and end date.",
    "required": true,
    "inputs": [
      {
        "type": "date",
        "id": "example_date_when",
        "label": "When"
      }
    ]
  },
  "f607e1a3-8f22-4d4f-9947-0d4a7651d56d": {
    "id": "f607e1a3-8f22-4d4f-9947-0d4a7651d56d",
    "version": 1,
    "unique_name": "example_spatial",
    "title": "Example Spatial Extent",
    "text": "This is an example for the spatial extent widget.",
    "help": "This will be a graphical widget for defining the geographical spatial extent of a dataset.",
    "required": true,
    "inputs": [
      {
        "type": "spatial",
        "id": "example_spatial_where",
        "label": "Where"
      }
    ]
  }
}

const getItemById = async (table, id) => {
  return questions[id];
}

const expandKeys = (item) => {
  let promises = [];
  for (let key of Object.keys(item)) {
    const promise = new Promise((resolve) => {
      if (typeof item[key] == 'object') {
        if (item[key].hasOwnProperty("f_ref")) {
          promises.push(getItemById(item[key].f_ref, item[key].id)
            .then((nestedItem) => {
              item[key] = nestedItem;
              resolve();
            }
          ));
        }
        else {
          expandKeys(item[key]);
        }
      }
    });
  }
  return Promise.all(promises);
}
