const qIns = [];
const iIns = [];
const qsIns = [];
const sIns = [];
const fIns = [];

function parseQuestion(question) {
  let insertQ = `INSERT INTO question VALUES ('${question.id}', '${question.question_name}', ${question.version}, '${question.title}', '${question.text}', '${question.help}');`
  qIns.push(insertQ);
  question.inputs.forEach((input, idx) => {
    let insertI = `INSERT INTO input VALUES ('${question.id}', '${input.id}', ${idx}, '${input.label}', '${input.type}', '${JSON.stringify(input.enums||{})}', '${JSON.stringify(input.attributes||{})}', ${input.required?'True':'False'});`;
    iIns.push(insertI);
  });
}

function parseSection(section, i) {
  let insertS = `INSERT INTO section VALUES ('${section.id}', '${form.id}', '${section.heading}', ${i});`;
  sIns.push(insertS);
  section.questions.forEach((question, idx) => {
    let insertSQ = `INSERT INTO section_question VALUES ('${section.id}', '${question.id}', ${idx});`
    qsIns.push(insertSQ);
  })
}

function parseForm(form) {
  let insertF = `INSERT INTO form VALUES ('${form.id}', '${form.form_name}', ${form.version}, '${form.description}', '${form.text}');`;
  fIns.push(insertF);
}

function parse() {
  parseForm(form);
  questions.forEach((question) => {
    parseQuestion(question);
  });
  sections.forEach((section, idx) => {
    parseSection(section, idx);
  });
}

const form = {
  "id": "6c544723-241c-4896-a38c-adbc0a364293",
  "version": 1,
  "form_name": "archival_interest",
  "description": "The archival interest form is used to get high level information about a dataset, typically this will be submitted by the data provider or an appropriate agent.",
  "text": "To express interest in archiving a data product, please fill out the following form."
}

const questions = [
  {
    "question_name": "data_producer_info",
    "title": "Primary Data Producer",
    "text": "Who is the primary person responsible for the collection or creation of this data product?",
    "help": "Often this is the Principle Investigator, Project Scientist, or Project Manager",
    "inputs": [
      {
        "type": "text",
        "id": "data_producer_info_name",
        "label": "Name",
        "validation_error_msg": "Please enter a name for the point of contact.",
        "required": true
      },
      {
        "type": "text",
        "id": "data_producer_info_organization",
        "label": "Organization",
        "validation_error_msg": "Please enter an organization."
      },
      {
        "type": "email",
        "id": "data_producer_info_email",
        "label": "Email",
        "validation_error_msg": "Please enter an email.",
        "required": true
      }
    ],
    "id": "80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e2",
    "version": 1
  },
  {
    "question_name": "archival_interest_poc",
    "title": "Archival Request Point of Contact",
    "text": "Who should the DAAC contact with questions regarding this data archival request?",
    "help": "This person should have in-depth knowledge of this data product, allowing them to provide additional information as needed.",
    "inputs": [
      {
        "type": "text",
        "id": "archival_interest_poc_name",
        "label": "Name",
        "validation_error_msg": "Please enter a name for the point of contact.",
        "required": true
      },
      {
        "type": "text",
        "id": "archival_interest_poc_organization",
        "label": "Organization",
        "validation_error_msg": "Please enter an organization."
      },
      {
        "type": "email",
        "id": "archival_interest_poc_email",
        "label": "Email",
        "validation_error_msg": "Please enter an email.",
        "required": true
      }
    ],
    "id": "f3e2eab9-6375-4e53-9cc2-3d16f318d332",
    "version": 1
  },
  {
    "question_name": "funding_organization",
    "title": "Funding Source: Organization",
    "text": "What organization(s) funded the creation of this data product?",
    "help": "This the organization that funded the creation of the data product.",
    "inputs": [
      {
        "type": "radio",
        "id": "funding_organization_name",
        "label": "Organization",
        "enums": [
          "NASA",
          "NOAA",
          "NSF",
          "USGS",
          "University",
          "Other"
        ]
      },
      {
        "type": "text",
        "id": "funding_organization_other",
        "label": "University or Other"
      }
    ],
    "id": "8a364184-42ac-48fe-b831-acb2eb08c728",
    "version": 1
  },
  {
    "question_name": "funding_program",
    "title": "Funding source: Program/Program Element",
    "text": "Under what program or program element within the funding organization was this data product created?",
    "help": "For example, NASA programs such as MEaSUREs, Terrestrial Hydrology, Earth Venture, ACCESS, or AIST.",
    "inputs": [
      {
        "type": "text",
        "id": "funding_program_name",
        "label": "Program",
        "validation_error_msg": "Please enter a name for the program.",
        "required": true
      }
    ],
    "id": "4ecc885f-daf8-4bc6-a8cd-d30c2a54d085",
    "version": 1
  },
  {
    "question_name": "data_product_name",
    "title": "Data Product Name",
    "text": "How do you refer to this data product?",
    "help": "This is how the DAAC will refer to this data product during the Archival Interest process.",
    "inputs": [
      {
        "type": "text",
        "id": "data_product_name_value",
        "label": "Name",
        "validation_error_msg": "Please enter a name for the data product.",
        "required": true
      }
    ],
    "id": "f74c6c20-7483-40f9-a63e-58cc20ae8c8f",
    "version": 1
  },
  {
    "question_name": "data_product_description",
    "title": "Data Product Description",
    "text": "Please provide a brief description of this data product following the guidance in the help text.",
    "help": "The description should mimic a journal abstract and should provide a reader with the information needed to quickly understand the relevance and usefulness of the data.",
    "inputs": [
      {
        "type": "textarea",
        "id": "data_product_description_value",
        "label": "Description",
        "validation_error_msg": "Please enter a description.",
        "attributes": {
          "rows": 10,
          "cols": 80
        },
        "required": true
      }
    ],
    "id": "9767336b-a9a9-41d2-8d2d-4fc2858c9b6f",
    "version": 1
  },
  {
    "question_name": "publication",
    "title": "Publication Describing Data Product",
    "text": "Please provide the citation or Digital Object Identifier (DOI) for any publications describing this data product.",
    "help": "For example, a overview paper describing the research, methods, or initial results related to this data product.",
    "inputs": [
      {
        "type": "text",
        "id": "publication_dois",
        "label": "Publication",
        "validation_error_msg": "Please enter Digital Object Identifiers.",
        "required": true
      }
    ],
    "id": "ab57f5e8-9ec5-46c9-978e-d06125346d36",
    "version": 1
  },
  {
    "question_name": "science_value",
    "title": "Science Value of Data Product",
    "text": "Please describe the science value of this data product.",
    "help": "For example, how will this data product benefit the science community? What are the strengths and the limitations of this data product? What other data products does it compliment?",
    "inputs": [
      {
        "type": "textarea",
        "id": "science_value_description",
        "label": "Description",
        "validation_error_msg": "Please enter a description.",
        "attributes": {
          "rows": 10,
          "cols": 80
        },
        "required": true
      }
    ],
    "id": "7fd7bccf-5065-4033-9956-9e80bc99c205",
    "version": 1
  },
  {
    "question_name": "archival_reason",
    "title": "Reason for Submitting Data Product",
    "text": "Please briefly explain your reasons for requesting archival of this data product at the DAAC.",
    "help": "For example, are you attempting to publish a paper which requires data to be archived in a trusted repository? Have you been instructed by a NASA program manager to submit your data to the DAAC? Do you want this data product archived with related data?",
    "inputs": [
      {
        "type": "textarea",
        "id": "archival_reason_description",
        "label": "Description",
        "validation_error_msg": "Please enter a description.",
        "attributes": {
          "rows": 10,
          "cols": 80
        },
        "required": true
      }
    ],
    "id": "bd00dbb7-1d3c-46fa-82a4-734236f4e06c",
    "version": 1
  },
  {
    "question_name": "archival_approval_dependencies",
    "title": "Dependencies for Archival Approval",
    "text": "Do you have any dependencies related to this data product being approved for archival at the DAAC? If Yes, please provide a brief explanation.",
    "help": "For example, are you hoping to have this data product approved for archival at the DAAC prior publishing a paper or presenting at a conference? Does your project have a defined timeline in which this data product needs to be published?",
    "inputs": [
      {
        "type": "checkbox",
        "id": "archival_approval_dependencies_has_dependencies",
        "label": "Has Dependencies",
        "required": true
      },
      {
        "type": "text",
        "id": "archival_approval_dependencies_explanation",
        "label": "If there are dependencies, provide explanation"
      }
    ],
    "id": "f40956c3-9af8-400e-8dd8-c5e2965dcb8a",
    "version": 1
  },
  {
    "question_name": "data_product_restrictions",
    "title": "Data Product Restrictions",
    "text": "Can this data product be publicly released in compliance with NASA''s Open Data Policy? If No, please provide a brief explanation.",
    "help": "For a description policy, please refer to the NASA Earthdata Data and Information Policy web page (https://earthdata.nasa.gov/collaborate/open-data-services-and-software/data-information-policy).",
    "inputs": [
      {
        "type": "checkbox",
        "id": "data_product_restrictions_public",
        "label": "Releasable to public",
        "required": true
      },
      {
        "type": "text",
        "id": "data_product_restrictions_explanation",
        "label": "If not releasable, provide explanation"
      }
    ],
    "id": "2dd6c8b1-22a8-4866-91c3-da9b4ce849dc",
    "version": 1
  },
  {
    "question_name": "data_product_documentation",
    "title": "Data Product Additional Documentation",
    "text": "Please upload additional documents that describe this data product or provide URLs to additional documents.",
    "help": "For example, these documents may include descriptions of the variables, filename conventions, processing steps, and/or data quality.",
    "inputs": [
      {
        "type": "file",
        "id": "data_product_documentation_upload",
        "label": "Upload Additional Documentation"
      },
      {
        "type": "text",
        "id": "data_product_documentation_url",
        "label": "Additional Documentation URL"
      }
    ],
    "id": "ad568b2f-89fe-4afd-a0bf-9e5832b71ce9",
    "version": 1
  },
  {
    "question_name": "data_product_doi",
    "title": "Publication Describing Data Product",
    "text": "If a Digital Object Identifier (DOI) already exists for this data product, please provide it.",
    "help": "This would be a DOI for this data product and not for a publication related to this data product.",
    "inputs": [
      {
        "type": "checkbox",
        "id": "data_product_doi_exists",
        "label": "Has DOI"
      },
      {
        "type": "text",
        "id": "data_product_doi_value",
        "label": "If yes, provide DOI",
        "validation_error_msg": "Please enter Digital Object Identifiers."
      }
    ],
    "id": "c9c73e88-837a-42d2-aa1a-50874a333607",
    "version": 1
  },
  {
    "question_name": "data_product_temporal_coverage",
    "title": "Data Product Temporal Coverage",
    "text": "What period of time is covered by the entire data product?",
    "help": "The temporal coverage should encompass the beginning date of the first data file and the ending date of the last data file, even if there are time gaps.",
    "required": true,
    "inputs": [
      {
        "type": "date",
        "id": "data_product_temporal_coverage_start",
        "label": "Start"
      },
      {
        "type": "date",
        "id": "data_product_temporal_coverage_end",
        "label": "End"
      }
    ],
    "id": "4f2dd369-d865-47ba-8504-8694493f128f",
    "version": 1
  },
  {
    "question_name": "data_product_status",
    "title": "Data Product Status",
    "text": "Once this data product is publicly accessible, will you continue to create data to extend this data product? What is the anticipated frequency of additional data deliveries to the DAAC?",
    "help": "This is the frequency of updates to the dataset if it is still being updated.",
    "inputs": [
      {
        "type": "radio",
        "id": "data_product_volume_units",
        "label": "Unit",
        "enums": [
          "No Updates",
          "Daily",
          "Weekly",
          "Monthly",
          "Quarterly",
          "Yearly",
          "Ad Hoc"
        ],
        "required": true
      }
    ],
    "id": "f4d8ab9d-0959-41b8-8449-430986ddfe84",
    "version": 1
  },
  {
    "question_name": "data_product_spatial_coverage",
    "title": "Data Product Spatial Coverage",
    "text": "What is the general geographic region covered by this data product?",
    "help": "For example, Global, Northern Hemisphere, Alaska, Korean Peninsula, East Tropical Pacific, or Gulf Stream.",
    "inputs": [
      {
        "type": "text",
        "id": "data_product_spatial_coverage_area",
        "label": "Coverage",
        "validation_error_msg": "Please enter a spatial coverage.",
        "required": true
      }
    ],
    "id": "ebeab400-b3d7-4943-8d09-d1236afc5de0",
    "version": 1
  },
  {
    "question_name": "data_format",
    "title": "Data Format",
    "text": "What is the format(s) of the files within this data product? If selecting Other, please upload code to read the data or provide a URL to code to read the data.",
    "help": "NASA Open Data Policy https://earthdata.nasa.gov/collaborate/open-data-services-and-software/data-information-policy",
    "required": true,
    "inputs": [
      {
        "type": "checkbox",
        "id": "data_format_ascii",
        "label": "ASCII"
      },
      {
        "type": "checkbox",
        "id": "data_format_geotiff",
        "label": "GeoTIFF"
      },
      {
        "type": "checkbox",
        "id": "data_format_hdf5",
        "label": "HDF-5"
      },
      {
        "type": "checkbox",
        "id": "data_format_hdf_eos",
        "label": "HDF-EOS-5"
      },
      {
        "type": "checkbox",
        "id": "data_format_ogc_kml",
        "label": "OGC KML"
      },
      {
        "type": "checkbox",
        "id": "data_format_netcdf_4",
        "label": "NetCDF-4"
      },
      {
        "type": "checkbox",
        "id": "data_format_netcdf_classic",
        "label": "NetCDF Classic"
      },
      {
        "type": "checkbox",
        "id": "data_format_other",
        "label": "Other"
      },
      {
        "type": "text",
        "id": "data_format_other_info",
        "label": "If Other"
      }
    ],
    "id": "50e8d566-b9ab-4bd9-9adc-92a3c8fb5d27",
    "version": 1
  },
  {
    "question_name": "data_product_volume",
    "title": "Data Product Volume",
    "text": "What is the estimated or actual total volume of this data product?",
    "help": "The DAAC uses the total volume of the final data product to plan data storage requirements. If the final data product is not complete, please provide your best estimate.",
    "inputs": [
      {
        "type": "number",
        "id": "data_product_volume_amount",
        "label": "Amount",
        "required": true,
        "validation_error_msg": "You must enter a positive value."
      },
      {
        "type": "radio",
        "id": "data_product_volume_units",
        "label": "Unit",
        "enums": [
          "KB",
          "MB",
          "GB",
          "TB",
          "PB"
        ],
        "required": true
      }
    ],
    "id": "40672516-2220-4edc-8c1b-fd9f7e0b978e",
    "version": 1
  },
  {
    "question_name": "sample_data_file",
    "title": "Sample Data File",
    "text": "Please upload a sample data file(s) or provide a URL to a location where a sample data file(s) can be accessed.",
    "help": "Providing data files that are representative of the range of data within this data product will help the DAAC to better understand the data format, structure, and content.",
    "inputs": [
      {
        "type": "file",
        "id": "example_file_upload",
        "label": "Upload Sample File"
      },
      {
        "type": "text",
        "id": "example_file_url",
        "label": "Sample File URL"
      }
    ],
    "id": "53a0faa7-f7d4-4ce9-a9dc-a13cef44e1f3",
    "version": 1
  }
]

const sections = [
  {
    "id": "458aa77d-8313-4093-aeac-dde2e892910a",
    "heading": "Contact Information",
    "questions": [
      {
        "id": "80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e2",
        "version": 1
      },
      {
        "id": "f3e2eab9-6375-4e53-9cc2-3d16f318d332",
        "version": 1
      }
    ]
  },
  {
    "id": "0e8a1da4-a147-446a-8c9c-8888586eab01",
    "heading": "Funding Information",
    "questions": [
      {
        "id": "8a364184-42ac-48fe-b831-acb2eb08c728",
        "version": 1
      },
      {
        "id": "4ecc885f-daf8-4bc6-a8cd-d30c2a54d085",
        "version": 1
      }
    ]
  },
  {
    "id": "d5c2c0f8-1cb6-4d90-8206-9a9743a688af",
    "heading": "Data Product Information",
    "questions": [
      {
        "id": "f74c6c20-7483-40f9-a63e-58cc20ae8c8f",
        "version": 1
      },
      {
        "id": "9767336b-a9a9-41d2-8d2d-4fc2858c9b6f",
        "version": 1
      },
      {
        "id": "ab57f5e8-9ec5-46c9-978e-d06125346d36",
        "version": 1
      },
      {
        "id": "7fd7bccf-5065-4033-9956-9e80bc99c205",
        "version": 1
      },
      {
        "id": "bd00dbb7-1d3c-46fa-82a4-734236f4e06c",
        "version": 1
      },
      {
        "id": "f40956c3-9af8-400e-8dd8-c5e2965dcb8a",
        "version": 1
      },
      {
        "id": "2dd6c8b1-22a8-4866-91c3-da9b4ce849dc",
        "version": 1
      },
      {
        "id": "ad568b2f-89fe-4afd-a0bf-9e5832b71ce9",
        "version": 1
      },
      {
        "id": "c9c73e88-837a-42d2-aa1a-50874a333607",
        "version": 1
      }
    ]
  },
  {
    "id": "9eca8523-a9f8-4f31-a9c9-77f74b298e25",
    "heading": "Data Product Coverage",
    "questions": [
      {
        "id": "4f2dd369-d865-47ba-8504-8694493f128f",
        "version": 1
      },
      {
        "id": "f4d8ab9d-0959-41b8-8449-430986ddfe84",
        "version": 1
      },
      {
        "id": "ebeab400-b3d7-4943-8d09-d1236afc5de0",
        "version": 1
      }
    ]
  },
  {
    "id": "deb4c1ec-58b7-4385-8527-8c3d67fdbf9f",
    "heading": "Data Product Technical Details",
    "questions": [
      {
        "id": "50e8d566-b9ab-4bd9-9adc-92a3c8fb5d27",
        "version": 1
      },
      {
        "id": "40672516-2220-4edc-8c1b-fd9f7e0b978e",
        "version": 1
      },
      {
        "id": "53a0faa7-f7d4-4ce9-a9dc-a13cef44e1f3",
        "version": 1
      }
    ]
  }
]

parse();
fIns.forEach((i) => { console.log(i)});
sIns.forEach((i) => { console.log(i)});
qIns.forEach((i) => { console.log(i)});
qsIns.forEach((i) => { console.log(i)});
iIns.forEach((i) => { console.log(i)});
