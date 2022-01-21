
-- Form(id, short_name, version, long_name, description, text)
INSERT INTO form VALUES ('6c544723-241c-4896-a38c-adbc0a364293', 'data_accession_request', 1, 'Data Accession Request', 'This form is used to get high level information about a dataset, typically this will be submitted by the data provider or an appropriate agent.');
INSERT INTO form VALUES ('19025579-99ca-4344-8610-704dae626343', 'data_product_information', 1, 'Data Publication Request', 'This form is used to get high level information about a dataset, typically this will be submitted by the data provider or an appropriate agent.');

-- Section(id, form_id, heading, list_order, daac_id)
INSERT INTO section VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b50', '6c544723-241c-4896-a38c-adbc0a364293', 'Contact Information', 0, '[]', '[]', NULL);
INSERT INTO section VALUES ('e2b23c21-32cc-4423-9363-61887abe29c7', '6c544723-241c-4896-a38c-adbc0a364293', 'Funding Information', 1, '[]', '[]', NULL);
INSERT INTO section VALUES ('049e63e8-018d-4c3f-96f1-80c73e0f4287', '6c544723-241c-4896-a38c-adbc0a364293', 'General Information', 2, '[]', '[]', NULL);
INSERT INTO section VALUES ('2ba04d20-5473-42b7-907c-10ef384f90c8', '6c544723-241c-4896-a38c-adbc0a364293', 'Technical Information', 3, '[]', '[]', NULL);
INSERT INTO section VALUES ('608df644-d1ed-4aa4-9bb9-4907f3e9ce9d', '6c544723-241c-4896-a38c-adbc0a364293', 'ASDC Additional Questions', 4, '[]', '[]', '40397fe8-4841-4e4c-b84a-6ece359ff5ff');
INSERT INTO section VALUES ('30727449-9617-4765-83b0-d4637936710d', '6c544723-241c-4896-a38c-adbc0a364293', 'ASF DAAC Additional Questions', 5, '[]', '[]', 'c606afba-725b-4ae4-9557-1fd33260ae12');
INSERT INTO section VALUES ('a9e1a611-9435-4f21-b074-09b9f502e79c', '6c544723-241c-4896-a38c-adbc0a364293', 'CDDIS Additional Questions', 6, '[]', '[]', 'd551380f-8813-40e4-9763-2a5bb6007cd0');
INSERT INTO section VALUES ('caaa6d32-0bd5-45a9-8511-defca7405dcb', '6c544723-241c-4896-a38c-adbc0a364293', 'GES DISC Additional Questions', 7, '[]', '[]', '1ea1da68-cb95-431f-8dd8-a2cf16d7ef98');
INSERT INTO section VALUES ('5d30eb76-631e-4591-9782-8422250cd89e', '6c544723-241c-4896-a38c-adbc0a364293', 'GHRC DAAC Additional Questions', 8, '[]', '[]', 'ef229725-1cad-485e-a72b-a276d2ca3175');
INSERT INTO section VALUES ('3095e7ac-25be-4bd2-a5cd-47de253d06af', '6c544723-241c-4896-a38c-adbc0a364293', 'LAADS DAAC Additional Questions', 9, '[]', '[]', '9e0628f1-0dde-4ed2-b1e3-690c70326f25');
INSERT INTO section VALUES ('ec1fbb1e-8d4d-4646-a20c-b5fb68135403', '6c544723-241c-4896-a38c-adbc0a364293', 'LP DAAC Additional Questions', 10, '[]', '[]', 'de6d5ec9-4728-4f2b-9d43-ae2f0fdac96a');
INSERT INTO section VALUES ('11bac86a-b284-47b3-aaee-855859f56c0a', '6c544723-241c-4896-a38c-adbc0a364293', 'NSIDC DAAC Additional Questions', 11, '[]', '[]', 'aec3724f-b30b-4b3f-9b9a-e0907d9d14b3');
INSERT INTO section VALUES ('bd4fe63a-ba32-475b-a665-e593dd2d6916', '6c544723-241c-4896-a38c-adbc0a364293', 'OB.DAAC Additional Questions', 12, '[]', '[]', 'fe75c306-ac04-4689-a702-073d9cb071fe');
INSERT INTO section VALUES ('a02e43ac-80e8-422e-b2aa-639b2a1da64a', '6c544723-241c-4896-a38c-adbc0a364293', 'ORNL DAAC Additional Questions', 13, '[]', '[]', '15df4fda-ed0d-417f-9124-558fb5e5b561');
INSERT INTO section VALUES ('a2d9ec2b-7e78-427f-ab2e-6f9c8405b79e', '6c544723-241c-4896-a38c-adbc0a364293', 'PO.DAAC Additional Questions', 14, '[]', '[]', '6b3ea184-57c5-4fc5-a91b-e49708f91b67');
INSERT INTO section VALUES ('e738f09c-6982-4ec1-a0e0-916b1f5645ab', '6c544723-241c-4896-a38c-adbc0a364293', 'SEDAC Additional Questions', 15, '[]', '[]', '00dcf32a-a4e2-4e55-a0d1-3a74cf100ca1');
INSERT INTO section VALUES ('6cabfad8-912c-4f9b-bf96-78d7145787c9', '19025579-99ca-4344-8610-704dae626343', 'Contact Information', 0, '[]', '[]', NULL);
INSERT INTO section VALUES ('e169a5b4-da2e-4893-9481-1b9351cd9707', '19025579-99ca-4344-8610-704dae626343', 'Funding Information', 1, '[]', '[]', NULL);
INSERT INTO section VALUES ('768a6b51-4864-458c-b20d-fb8b4c7dc606', '19025579-99ca-4344-8610-704dae626343', 'General Information', 2, '[]', '[]', NULL);
INSERT INTO section VALUES ('f1fbc110-a6d0-4830-8a34-85992e693fda', '19025579-99ca-4344-8610-704dae626343', 'Temporal Information', 3, '[]', '[]', NULL);
INSERT INTO section VALUES ('5370c74a-df0b-4f75-b8fa-2f41f1392ad4', '19025579-99ca-4344-8610-704dae626343', 'Spatial Information', 4, '[]', '[]', NULL);
INSERT INTO section VALUES ('b0934ecc-1aa1-4e07-9cbc-f1299126aee0', '19025579-99ca-4344-8610-704dae626343', 'Technical Information', 5, '[]', '[]', NULL);
INSERT INTO section VALUES ('db348a3a-7fb9-40f2-bfae-d880d49c66c1', '19025579-99ca-4344-8610-704dae626343', 'ASDC Additional Questions', 6, '[]', '[]', '40397fe8-4841-4e4c-b84a-6ece359ff5ff');
INSERT INTO section VALUES ('0223fe8a-6e0e-4293-9073-e3b798960bfb', '19025579-99ca-4344-8610-704dae626343', 'ASF DAAC Additional Questions', 7, '[]', '[]', 'c606afba-725b-4ae4-9557-1fd33260ae12');
INSERT INTO section VALUES ('43bc4337-f466-47cd-b9b3-4ab8da0ff98c', '19025579-99ca-4344-8610-704dae626343', 'CDDIS Additional Questions', 8, '[]', '[]', 'd551380f-8813-40e4-9763-2a5bb6007cd0');
INSERT INTO section VALUES ('a4918561-3d8d-4ec4-8497-83fc8dff8243', '19025579-99ca-4344-8610-704dae626343', 'GES DISC Additional Questions', 9, '[]', '[]', '1ea1da68-cb95-431f-8dd8-a2cf16d7ef98');
INSERT INTO section VALUES ('8a06b48b-86f8-47f0-8820-8f5d34676f24', '19025579-99ca-4344-8610-704dae626343', 'GHRC DAAC Additional Questions', 10, '[]', '[]', 'ef229725-1cad-485e-a72b-a276d2ca3175');
INSERT INTO section VALUES ('fb649495-b571-4b96-945d-7e2e032c5338', '19025579-99ca-4344-8610-704dae626343', 'LAADS DAAC Additional Questions', 11, '[]', '[]', '9e0628f1-0dde-4ed2-b1e3-690c70326f25');
INSERT INTO section VALUES ('a8a1a34f-aee2-4cbc-9229-1d6c7cf33a75', '19025579-99ca-4344-8610-704dae626343', 'LP DAAC Additional Questions', 12, '[]', '[]', 'de6d5ec9-4728-4f2b-9d43-ae2f0fdac96a');
INSERT INTO section VALUES ('6ab97eca-0641-44f2-a317-9b50d1375a05', '19025579-99ca-4344-8610-704dae626343', 'NSIDC DAAC Additional Questions', 13, '[]', '[]', 'aec3724f-b30b-4b3f-9b9a-e0907d9d14b3');
INSERT INTO section VALUES ('36d021d3-c527-419b-9b77-a48d535c12a8', '19025579-99ca-4344-8610-704dae626343', 'OB.DAAC Additional Questions', 14, '[]', '[]', 'fe75c306-ac04-4689-a702-073d9cb071fe');
INSERT INTO section VALUES ('f1a2136a-7245-4462-a175-40164db59c7b', '19025579-99ca-4344-8610-704dae626343', 'ORNL DAAC Additional Questions', 15, '[]', '[]', '15df4fda-ed0d-417f-9124-558fb5e5b561');
INSERT INTO section VALUES ('0f6771e5-a6e4-4f19-ac85-cc48f526c146', '19025579-99ca-4344-8610-704dae626343', 'PO.DAAC Additional Questions', 16, '[]', '[]', '6b3ea184-57c5-4fc5-a91b-e49708f91b67');
INSERT INTO section VALUES ('e9675ba5-e494-4275-8778-cd3fa68371e3', '19025579-99ca-4344-8610-704dae626343', 'SEDAC Additional Questions', 17, '[]', '[]', '00dcf32a-a4e2-4e55-a0d1-3a74cf100ca1');

-- Question(id, short_name, version, long_name, text, help)
INSERT INTO question VALUES ('80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e2', 'data_producer_info', 1, 'Primary Data Producer', 'Who is the primary person responsible for the collection or creation of this data product?', 'Often this is the Principle Investigator, Project Scientist, or Project Manager');
INSERT INTO question VALUES ('f3e2eab9-6375-4e53-9cc2-3d16f318d333', 'publication_point_of_contact', 1, 'Data Accession Point of Contact', 'Who should the DAAC contact with questions regarding this Data Accession request?', 'This person should have in-depth knowledge of this data product, allowing them to provide additional information as needed.');
INSERT INTO question VALUES ('8a364184-42ac-48fe-b831-acb2eb08c728', 'funding_organization', 1, 'Funding Organization', 'What organization(s) funded the creation of this data product?', '');
INSERT INTO question VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d085', 'funding_program', 1, 'Funding Program/Element', 'Under what program or program element within the funding organization was this data product created?', 'For example, NASA programs such as MEaSUREs, Terrestrial Hydrology, Earth Venture, ACCESS, or AIST.');
INSERT INTO question VALUES ('f74c6c20-7483-40f9-a63e-58cc20ae8c8f', 'data_product_name', 1, 'Data Product Name', 'How do you refer to this data product?', 'The DAAC will use this information to develop an official data product name in compliance with DAAC/ESDIS standards.');
INSERT INTO question VALUES ('39701413-ac96-4b66-9c2f-2d9c08a18ed9', 'data_product_description', 1, 'Data Product Description', 'Please provide a brief description of this data product.', 'The description should mimic a journal abstract and should provide a reader with the information needed to quickly understand the relevance and usefulness of the data.');
INSERT INTO question VALUES ('c9c73e88-837a-42d2-aa1a-50874a333607', 'data_product_doi', 1, 'Data Product DOI', 'If a Digital Object Identifier (DOI) already exists for this data product, please provide it.', 'This would be the DOI for the actual data product and not for a publication related to this data product.');
INSERT INTO question VALUES ('7fd7bccf-5065-4033-9956-9e80bc99c205', 'science_value', 1, 'Science Value of Data Product', 'Please describe the science value of this data product.', 'For example, how will this data product benefit the science community? What are the strengths and the limitations of this data product? What other data products does it compliment?');
INSERT INTO question VALUES ('bd00dbb7-1d3c-46fa-82a4-734236f4e06c', 'data_submission_reason', 1, 'Reason for Data Accession Request', 'Please briefly explain your reasons for requesting to have this data product archived and distributed at the DAAC.', 'For example, are you attempting to publish a paper which requires data to be archived in a trusted repository? Have you been instructed by a NASA program manager to archive your data at a DAAC? Do you want this data product distributed with related data?');
INSERT INTO question VALUES ('f40956c3-9af8-400e-8dd8-c5e2965dcb8a', 'data_submission_approval_dependencies', 1, 'Dependencies for Data Accession Approval', 'Do you have any dependencies related to this data product being approved to be published at the DAAC? If Yes, please provide a brief explanation.', 'For example, are you hoping to have this data product approved to be published at the DAAC prior publishing a paper or presenting at a conference? Does your project have a defined timeline in which this data product needs to be published?');
INSERT INTO question VALUES ('2dd6c8b1-22a8-4866-91c3-da9b4ce849dc', 'data_product_restrictions', 1, 'Data Product Restrictions', 'Can this data product be publicly released in compliance with NASA''s Open Data Policy? If No or Not sure, please provide a brief explanation.', 'For a description of the open data policy, please refer to the NASA Earthdata Data and Information Policy web page <https://earthdata.nasa.gov/collaborate/open-data-services-and-software/data-information-policy>.');
INSERT INTO question VALUES ('ad568b2f-89fe-4afd-a0bf-9e5832b71ce9', 'data_product_documentation', 1, 'Data Product Documentation', 'Please provide URLs to additional documents.', 'For example, these documents may include descriptions of the variables, filename conventions, processing steps, and/or data quality.');
INSERT INTO question VALUES ('50e8d566-b9ab-4bd9-9adc-92a3c8fb5d27', 'data_format', 1, 'Data Format', 'What is the format(s) of the files in this data product?', 'For a list of NASA-approved data formats, please refer to the NASA Earthdata Standards and Practices web page <https://earthdata.nasa.gov/esdis/eso/standards-and-references#data-formats>.');
INSERT INTO question VALUES ('228cb0d6-78fb-449a-8061-b1e6fb3f59d1', 'spatial_general', 1, 'Data Product Spatial Coverage', 'What is the general geographic region covered by this data product?', 'For example, Global, Northern Hemisphere, Alaska, Korean Peninsula, East Tropical Pacific, or Gulf Stream.');
INSERT INTO question VALUES ('4f2dd369-d865-47ba-8504-8694493f129f', 'product_temporal_coverage', 1, 'Data Product Temporal Coverage', 'What period of time is covered by the entire data product, upon planned delivery to the DAAC?', 'The temporal coverage should encompass the beginning date of the first data file and the ending date of the last data file, even if there are time gaps.');
INSERT INTO question VALUES ('dbf70495-433a-439e-8173-0cb20f972c16', 'data_product_status', 1, 'Data Product Status', 'After this data product has been published at the DAAC, will you continue to collect or create new data to extend the time series?', '');
INSERT INTO question VALUES ('4c42796a-8ff1-444e-8fc5-82ccad82e5fb', 'data_delivery_frequency', 1, 'Data Delivery Frequency', 'What is the anticipated frequency of additional data deliveries to the DAAC?', 'undefined');
INSERT INTO question VALUES ('40672516-2220-4edc-8c1b-fd9f7e0b978f', 'data_product_volume', 1, 'Data Product Volume', 'What is the estimated or actual total volume of this data product?', 'The DAAC uses the total volume of the final data product to plan data storage requirements. If the final data product is not complete, please provide your best estimate for the total data volume.');
INSERT INTO question VALUES ('53a0faa7-f7d4-4ce9-a9dc-a13cef44e1f3', 'sample_data_file', 1, 'Sample Data File(s)', 'Please provide a URL to a sample file(s).', 'Providing sample data files that are representative of the range of data within this data product will help the DAAC understand the data format, structure, and content.');
INSERT INTO question VALUES ('f3e2eab9-6375-4e53-9cc2-3d16f318d332', 'long_term_support_point_of_contact', 1, 'Long-term Support Point of Contact', 'Once publication is completed, who should the DAAC contact with questions regarding this data product?', 'DAACs may need assistance in answering questions from data product users. For example, questions related to data algorithm and processing approaches, calibration/validation assessments, or instrumentation.');
INSERT INTO question VALUES ('d2bc7af7-211e-494a-a0bd-11b44f112eaa', 'funding_grant', 1, 'Grant Number', 'If available, please provide the grant number for the funding that supported the creation of this data product.', 'For example, NNX08AZ90A.');
INSERT INTO question VALUES ('8a364184-42ac-48fe-b831-acb2eb08c729', 'list_of_data_producers_and_groups', 1, 'Data Producers for Data Citation', 'Please list the people or groups that were involved in the creation of this data product in the order that they should be credited in the data product citation.', 'The DAAC will use this information to construct a data product citation, which is a reference to data for the purpose of credit attribution and facilitation of data access.

Example data product citations:
McGill, Matthew , Dennis L Hlavka, John E. Yorks and Patrick A. Selmer. 2019. GOES-R PLT Cloud Physics LiDAR (CPL). Dataset available online from the NASA Global Hydrology Resource Center DAAC, Huntsville, Alabama, U.S.A. DOI: http://dx.doi.org/10.5067/GOESRPLT/CPL/DATA101

CARVE Science Team. 2017. CARVE: In-flight Photos from the CARVE Aircraft, Alaska, 2013-2015. ORNL DAAC, Oak Ridge, Tennessee, USA. https://doi.org/10.3334/ORNLDAAC/1435');
INSERT INTO question VALUES ('f625108f-7203-4045-9d1c-b1312b585584', 'data_production_latency', 1, 'Data Production Latency', 'What is the expected time difference between the latest data observation reference time and the delivery of that data to the DAAC?', 'undefined');
INSERT INTO question VALUES ('91c123bf-702e-458c-90a1-b26f6498937e', 'file_temporal_coverage', 1, 'Data File Temporal Coverage', 'On average, how much time is covered by an individual data file?', '');
INSERT INTO question VALUES ('4f2dd369-d865-47ba-8504-8694493f139f', 'value_temporal_resolution', 1, 'Temporal Resolution', 'On average, what is the temporal resolution of an individual data value within the data files?', 'The temporal resolution is specific to the data stored in this data product and does not necessarily represent the input data or instrument sampling rate.

For example, if measurements are taken for 1 second every 8 minutes and those 1 second measurements are represented in the data values, the temporal resolution is 1 second. If the 1 second measurements are averaged every hour and those 1-hour averages are represented in the data values, the temporal resolution is 1 hour.');
INSERT INTO question VALUES ('4f2dd369-d865-47ba-8504-8694493f128f', 'temporal_coverage_notes', 1, 'Temporal Coverage Notes', 'Please provide any additional information about the temporal coverage that will help the DAAC understand this data product.', 'Examples of useful temporal coverage information include: seasonal data; data covering multiple, individual deployments; significant gaps in instrument operation; data from transit/ferry flights included.');
INSERT INTO question VALUES ('15a012d0-9b4b-4979-9fa9-81fac1600b09', 'spatial_horizontal', 1, 'Horizontal Spatial Coverage', 'What are the coordinates for the geographic area(s) covered by the entire data product?', 'If more than three distinct spatial coverage bounding boxes exist for this data product, please add a comment to the Spatial Coverage Notes.');
INSERT INTO question VALUES ('0f640f21-37ec-4d04-af2c-da955ae98e12', 'spatial_vertical', 1, 'Vertical Spatial Coverage', 'Does this data product have a vertical dimension?', 'undefined');
INSERT INTO question VALUES ('a3701d37-77cf-4ccc-8068-c6860a7a8929', 'spatial_vertical_details', 1, 'Upper and Lower Limits', 'What are the upper and lower limits of the vertical spatial coverage of the data product?', 'Please provide any additional details needed to understand what these numbers mean in the Spatial Coverage Notes. For example, the point of reference for the values given in the vertical spatial coverage.');
INSERT INTO question VALUES ('91577abc-a59c-40f7-b0e6-f954542e6b19', 'spatial_data_file', 1, 'Data File Spatial Coverage', 'In general, how much geographical area is covered by an individual data file?', 'Please describe the general nature of the geographic area. For example: one file covers a swath of 25 km across track for a single orbit; one covers data for  a single glacier; one file covers a 5 x 5m tile; one file represents one flight over the campaign study region; one file covers the entire globe.');
INSERT INTO question VALUES ('a12ccd39-1d94-46a5-8aad-3587fd50c4ad', 'spatial_resolution', 1, 'Spatial Resolution', 'What is the spatial resolution of an individual data value within the data files?', 'Please provide the nominal size of the geographic area covered by a single data value. For example: 25 km at nadir; a 0.25 degree x 0.25 degree grid cell at the equator; points along a path; a 10 km x 10 km x 5 km radar slice.');
INSERT INTO question VALUES ('d1ef0a6f-284e-40a7-9248-75dd8f1f0ded', 'spatial_notes', 1, 'Spatial Coverage Notes', 'Please describe any additional information about the spatial coverage that will help the DAAC understand this data product.', 'undefined');
INSERT INTO question VALUES ('0a2fd2eb-62de-40e1-8143-3e8087a4062d', 'data_processing_level', 1, 'Data Processing Level', 'What is the NASA Data Processing Level <https://earthdata.nasa.gov/collaborate/open-data-services-and-software/data-information-policy/data-levels> of this data product?', '');
INSERT INTO question VALUES ('fbd25b6f-2731-4456-882b-ef840c11b671', 'variables', 1, 'Variables', 'What are the primary variables represented in this data product?', 'The primary variables should represent the research objective of the data. Identifying primary variables helps users find your data product and determine if it is appropriate for their use. Examples of variables in data products that are not considered primary are quality flags, input data variables, and latitude/longitude values.');
INSERT INTO question VALUES ('70274fc6-86e8-4d95-8b2c-60135eff43f5', 'data_product_type_info', 1, 'Data Product Type', 'Are data within this data product observational and/or model output?', 'undefined');
INSERT INTO question VALUES ('9767336b-a9a9-41d2-8d2d-4fc2858c9b6f', 'platform_and_instrument', 1, 'Platform and Instrument', 'What platform(s) and instrument(s) were used to collect the data within this data product?', 'Please be as specific as possible when including the platforms and instruments. For example, include tail numbers for aircraft or uniquely identify instruments when multiple instances exist on the same platform.');
INSERT INTO question VALUES ('ab57f5e8-9ec5-46c9-978e-d06125346d36', 'model', 1, 'Model Name and Version', 'What is the name and version of the model used to produce this data product?', 'undefined');
INSERT INTO question VALUES ('f1d8ab9d-0959-41b8-8449-430986ddfe84', 'data_file_compression', 1, 'Data File Compression', 'Is internal compression applied to the data files in this data product?', 'Internal compression is a feature of netCDF and HDF file formats that enables optimized storage and organization of data files. Internal compression is recommended when using these file formats.');
INSERT INTO question VALUES ('40672516-2220-4edc-8c1b-fd9f7e0b979e', 'data_product_files', 1, 'Number of files', 'What is the estimated or actual total number of files in this data product?', 'If the final data product is not complete, please provide your best estimate.');
INSERT INTO question VALUES ('f2d8ab9d-0959-41b8-8449-430986ddfe84', 'browse_images', 1, 'Browse Images', 'Will browse images representing the data be provided as part of this data product?', 'A browse image provides a visual preview of the data which can assist users in assessing and selecting a data product.');

-- SectionQuestion(section_id, question_id, list_order, required_if, show_if))
INSERT INTO section_question VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b50', '80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e2', 0, '[]', '[]');
INSERT INTO section_question VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b50', 'f3e2eab9-6375-4e53-9cc2-3d16f318d333', 1, '[]', '[]');
INSERT INTO section_question VALUES ('e2b23c21-32cc-4423-9363-61887abe29c7', '8a364184-42ac-48fe-b831-acb2eb08c728', 0, '[]', '[]');
INSERT INTO section_question VALUES ('e2b23c21-32cc-4423-9363-61887abe29c7', '4ecc885f-daf8-4bc6-a8cd-d30c2a54d085', 1, '[]', '[]');
INSERT INTO section_question VALUES ('049e63e8-018d-4c3f-96f1-80c73e0f4287', 'f74c6c20-7483-40f9-a63e-58cc20ae8c8f', 0, '[]', '[]');
INSERT INTO section_question VALUES ('049e63e8-018d-4c3f-96f1-80c73e0f4287', '39701413-ac96-4b66-9c2f-2d9c08a18ed9', 1, '[]', '[]');
INSERT INTO section_question VALUES ('049e63e8-018d-4c3f-96f1-80c73e0f4287', 'c9c73e88-837a-42d2-aa1a-50874a333607', 2, '[]', '[]');
INSERT INTO section_question VALUES ('049e63e8-018d-4c3f-96f1-80c73e0f4287', '7fd7bccf-5065-4033-9956-9e80bc99c205', 3, '[]', '[]');
INSERT INTO section_question VALUES ('049e63e8-018d-4c3f-96f1-80c73e0f4287', 'bd00dbb7-1d3c-46fa-82a4-734236f4e06c', 4, '[]', '[]');
INSERT INTO section_question VALUES ('049e63e8-018d-4c3f-96f1-80c73e0f4287', 'f40956c3-9af8-400e-8dd8-c5e2965dcb8a', 5, '[]', '[]');
INSERT INTO section_question VALUES ('049e63e8-018d-4c3f-96f1-80c73e0f4287', '2dd6c8b1-22a8-4866-91c3-da9b4ce849dc', 6, '[]', '[]');
INSERT INTO section_question VALUES ('049e63e8-018d-4c3f-96f1-80c73e0f4287', 'ad568b2f-89fe-4afd-a0bf-9e5832b71ce9', 7, '[]', '[]');
INSERT INTO section_question VALUES ('2ba04d20-5473-42b7-907c-10ef384f90c8', '50e8d566-b9ab-4bd9-9adc-92a3c8fb5d27', 0, '[]', '[]');
INSERT INTO section_question VALUES ('2ba04d20-5473-42b7-907c-10ef384f90c8', '228cb0d6-78fb-449a-8061-b1e6fb3f59d1', 1, '[]', '[]');
INSERT INTO section_question VALUES ('2ba04d20-5473-42b7-907c-10ef384f90c8', '4f2dd369-d865-47ba-8504-8694493f129f', 2, '[]', '[]');
INSERT INTO section_question VALUES ('2ba04d20-5473-42b7-907c-10ef384f90c8', 'dbf70495-433a-439e-8173-0cb20f972c16', 3, '[]', '[]');
INSERT INTO section_question VALUES ('2ba04d20-5473-42b7-907c-10ef384f90c8', '4c42796a-8ff1-444e-8fc5-82ccad82e5fb', 4, '[]', '[{"field":"data_product_status","value":"Yes"}]');
INSERT INTO section_question VALUES ('2ba04d20-5473-42b7-907c-10ef384f90c8', '40672516-2220-4edc-8c1b-fd9f7e0b978f', 5, '[]', '[]');
INSERT INTO section_question VALUES ('2ba04d20-5473-42b7-907c-10ef384f90c8', '53a0faa7-f7d4-4ce9-a9dc-a13cef44e1f3', 6, '[]', '[]');
INSERT INTO section_question VALUES ('6cabfad8-912c-4f9b-bf96-78d7145787c9', '80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e2', 0, '[]', '[]');
INSERT INTO section_question VALUES ('6cabfad8-912c-4f9b-bf96-78d7145787c9', 'f3e2eab9-6375-4e53-9cc2-3d16f318d333', 1, '[]', '[]');
INSERT INTO section_question VALUES ('6cabfad8-912c-4f9b-bf96-78d7145787c9', 'f3e2eab9-6375-4e53-9cc2-3d16f318d332', 2, '[]', '[]');
INSERT INTO section_question VALUES ('e169a5b4-da2e-4893-9481-1b9351cd9707', '8a364184-42ac-48fe-b831-acb2eb08c728', 0, '[]', '[]');
INSERT INTO section_question VALUES ('e169a5b4-da2e-4893-9481-1b9351cd9707', '4ecc885f-daf8-4bc6-a8cd-d30c2a54d085', 1, '[]', '[]');
INSERT INTO section_question VALUES ('e169a5b4-da2e-4893-9481-1b9351cd9707', 'd2bc7af7-211e-494a-a0bd-11b44f112eaa', 2, '[]', '[]');
INSERT INTO section_question VALUES ('768a6b51-4864-458c-b20d-fb8b4c7dc606', 'f74c6c20-7483-40f9-a63e-58cc20ae8c8f', 0, '[]', '[]');
INSERT INTO section_question VALUES ('768a6b51-4864-458c-b20d-fb8b4c7dc606', '39701413-ac96-4b66-9c2f-2d9c08a18ed9', 1, '[]', '[]');
INSERT INTO section_question VALUES ('768a6b51-4864-458c-b20d-fb8b4c7dc606', 'c9c73e88-837a-42d2-aa1a-50874a333607', 2, '[]', '[]');
INSERT INTO section_question VALUES ('768a6b51-4864-458c-b20d-fb8b4c7dc606', '8a364184-42ac-48fe-b831-acb2eb08c729', 3, '[]', '[]');
INSERT INTO section_question VALUES ('768a6b51-4864-458c-b20d-fb8b4c7dc606', '2dd6c8b1-22a8-4866-91c3-da9b4ce849dc', 4, '[]', '[]');
INSERT INTO section_question VALUES ('f1fbc110-a6d0-4830-8a34-85992e693fda', '4f2dd369-d865-47ba-8504-8694493f129f', 0, '[]', '[]');
INSERT INTO section_question VALUES ('f1fbc110-a6d0-4830-8a34-85992e693fda', 'dbf70495-433a-439e-8173-0cb20f972c16', 1, '[]', '[]');
INSERT INTO section_question VALUES ('f1fbc110-a6d0-4830-8a34-85992e693fda', '4c42796a-8ff1-444e-8fc5-82ccad82e5fb', 2, '[]', '[{"field":"data_product_status","value":"Yes"}]');
INSERT INTO section_question VALUES ('f1fbc110-a6d0-4830-8a34-85992e693fda', 'f625108f-7203-4045-9d1c-b1312b585584', 3, '[]', '[{"field":"data_product_status","value":"Yes"}]');
INSERT INTO section_question VALUES ('f1fbc110-a6d0-4830-8a34-85992e693fda', '91c123bf-702e-458c-90a1-b26f6498937e', 4, '[]', '[]');
INSERT INTO section_question VALUES ('f1fbc110-a6d0-4830-8a34-85992e693fda', '4f2dd369-d865-47ba-8504-8694493f139f', 5, '[]', '[]');
INSERT INTO section_question VALUES ('f1fbc110-a6d0-4830-8a34-85992e693fda', '4f2dd369-d865-47ba-8504-8694493f128f', 6, '[]', '[]');
INSERT INTO section_question VALUES ('5370c74a-df0b-4f75-b8fa-2f41f1392ad4', '228cb0d6-78fb-449a-8061-b1e6fb3f59d1', 0, '[]', '[]');
INSERT INTO section_question VALUES ('5370c74a-df0b-4f75-b8fa-2f41f1392ad4', '15a012d0-9b4b-4979-9fa9-81fac1600b09', 1, '[]', '[]');
INSERT INTO section_question VALUES ('5370c74a-df0b-4f75-b8fa-2f41f1392ad4', '0f640f21-37ec-4d04-af2c-da955ae98e12', 2, '[]', '[]');
INSERT INTO section_question VALUES ('5370c74a-df0b-4f75-b8fa-2f41f1392ad4', 'a3701d37-77cf-4ccc-8068-c6860a7a8929', 3, '[]', '[{"field":"spatial_vertical_answer","value":"Yes"}]');
INSERT INTO section_question VALUES ('5370c74a-df0b-4f75-b8fa-2f41f1392ad4', '91577abc-a59c-40f7-b0e6-f954542e6b19', 4, '[]', '[]');
INSERT INTO section_question VALUES ('5370c74a-df0b-4f75-b8fa-2f41f1392ad4', 'a12ccd39-1d94-46a5-8aad-3587fd50c4ad', 5, '[]', '[]');
INSERT INTO section_question VALUES ('5370c74a-df0b-4f75-b8fa-2f41f1392ad4', 'd1ef0a6f-284e-40a7-9248-75dd8f1f0ded', 6, '[]', '[]');
INSERT INTO section_question VALUES ('b0934ecc-1aa1-4e07-9cbc-f1299126aee0', '0a2fd2eb-62de-40e1-8143-3e8087a4062d', 0, '[]', '[]');
INSERT INTO section_question VALUES ('b0934ecc-1aa1-4e07-9cbc-f1299126aee0', 'fbd25b6f-2731-4456-882b-ef840c11b671', 1, '[]', '[]');
INSERT INTO section_question VALUES ('b0934ecc-1aa1-4e07-9cbc-f1299126aee0', '70274fc6-86e8-4d95-8b2c-60135eff43f5', 2, '[]', '[]');
INSERT INTO section_question VALUES ('b0934ecc-1aa1-4e07-9cbc-f1299126aee0', '9767336b-a9a9-41d2-8d2d-4fc2858c9b6f', 3, '[]', '[{"field":"data_product_type_observational","value":"true"}]');
INSERT INTO section_question VALUES ('b0934ecc-1aa1-4e07-9cbc-f1299126aee0', 'ab57f5e8-9ec5-46c9-978e-d06125346d36', 4, '[]', '[{"field":"data_product_type_model","value":"true"}]');
INSERT INTO section_question VALUES ('b0934ecc-1aa1-4e07-9cbc-f1299126aee0', '50e8d566-b9ab-4bd9-9adc-92a3c8fb5d27', 5, '[]', '[]');
INSERT INTO section_question VALUES ('b0934ecc-1aa1-4e07-9cbc-f1299126aee0', '40672516-2220-4edc-8c1b-fd9f7e0b978f', 6, '[]', '[]');
INSERT INTO section_question VALUES ('b0934ecc-1aa1-4e07-9cbc-f1299126aee0', 'f1d8ab9d-0959-41b8-8449-430986ddfe84', 7, '[]', '[]');
INSERT INTO section_question VALUES ('b0934ecc-1aa1-4e07-9cbc-f1299126aee0', '40672516-2220-4edc-8c1b-fd9f7e0b979e', 8, '[]', '[]');
INSERT INTO section_question VALUES ('b0934ecc-1aa1-4e07-9cbc-f1299126aee0', '53a0faa7-f7d4-4ce9-a9dc-a13cef44e1f3', 9, '[]', '[]');
INSERT INTO section_question VALUES ('b0934ecc-1aa1-4e07-9cbc-f1299126aee0', 'f2d8ab9d-0959-41b8-8449-430986ddfe84', 10, '[]', '[]');

-- Input(question_id, control_id, list_order, label, type, enums, attributes, required_if, show_if, required))

INSERT INTO input VALUES ('80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e2', 'data_producer_info_name', 0, 'First and Last Name', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e2', 'data_producer_info_organization', 1, 'Organization', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e2', 'data_producer_info_email', 2, 'Email', 'email', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e2', 'data_producer_info_orcid', 3, 'Orcid', 'text', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('f3e2eab9-6375-4e53-9cc2-3d16f318d333', 'publication_poc_name', 0, 'First and Last Name', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('f3e2eab9-6375-4e53-9cc2-3d16f318d333', 'publication_poc_organization', 1, 'Organization', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('f3e2eab9-6375-4e53-9cc2-3d16f318d333', 'publication_poc_email', 2, 'Email', 'email', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('f3e2eab9-6375-4e53-9cc2-3d16f318d333', 'publication_poc_orcid', 3, 'Orcid', 'text', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('8a364184-42ac-48fe-b831-acb2eb08c728', 'funding_organization_name', 0, 'Organization', 'radio', '["NASA","NOAA","NSF","USGS","University","Other"]', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('8a364184-42ac-48fe-b831-acb2eb08c728', 'funding_organization_other', 1, 'If University or Other', 'text', '{}', '{}', '[{"field":"funding_organization_name","value":"University","message":"Please provide a University or other text value for the funding organization."},{"field":"funding_organization_name","value":"Other","message":"Please provide a University or other text value for the funding organization."}]','[]',  False);
INSERT INTO input VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d085', 'funding_program_name', 0, 'Program', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('f74c6c20-7483-40f9-a63e-58cc20ae8c8f', 'data_product_name_value', 0, 'Name', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('39701413-ac96-4b66-9c2f-2d9c08a18ed9', 'data_product_description', 0, 'Description', 'textarea', '{}', '{"rows":3,"cols":20}', '[]','[]',  True);
INSERT INTO input VALUES ('c9c73e88-837a-42d2-aa1a-50874a333607', 'data_product_doi_value', 0, 'DOI', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('7fd7bccf-5065-4033-9956-9e80bc99c205', 'science_value_description', 0, 'Description', 'textarea', '{}', '{"rows":3,"cols":20}', '[]','[]',  True);
INSERT INTO input VALUES ('bd00dbb7-1d3c-46fa-82a4-734236f4e06c', 'data_submission_reason_description', 0, 'Description', 'textarea', '{}', '{"rows":5,"cols":20,"maxlength":1000,"placeholder":""}', '[]','[]',  True);
INSERT INTO input VALUES ('f40956c3-9af8-400e-8dd8-c5e2965dcb8a', 'data_submission_approval_dependencies_radios', 0, 'Has Dependencies', 'radio', '["Yes","No"]', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('f40956c3-9af8-400e-8dd8-c5e2965dcb8a', 'data_submission_approval_dependencies_explanation', 1, 'If Yes, provide explanation', 'text', '{}', '{}', '[{"field":"data_submission_approval_dependencies_radios","value":"Yes","message":"Please provide an explanation of the data product''s dependencies."}]','[]',  False);
INSERT INTO input VALUES ('2dd6c8b1-22a8-4866-91c3-da9b4ce849dc', 'data_product_restrictions_public', 0, 'Releasable to public', 'radio', '["Yes","No","Not sure"]', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('2dd6c8b1-22a8-4866-91c3-da9b4ce849dc', 'data_product_restrictions_explanation', 1, 'If No or Not Sure, provide explanation', 'text', '{}', '{}', '[{"field":"data_product_restrictions_public","value":"No","message":"Please provide an explanation of the data product''s restrictions."}]','[]',  False);
INSERT INTO input VALUES ('ad568b2f-89fe-4afd-a0bf-9e5832b71ce9', 'data_product_documentation_url', 0, 'Additional Documentation URL', 'text', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('50e8d566-b9ab-4bd9-9adc-92a3c8fb5d27', 'data_format_ascii', 0, 'ASCII', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('50e8d566-b9ab-4bd9-9adc-92a3c8fb5d27', 'data_format_geotiff', 1, 'GeoTIFF', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('50e8d566-b9ab-4bd9-9adc-92a3c8fb5d27', 'data_format_hdf5', 2, 'HDF 5', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('50e8d566-b9ab-4bd9-9adc-92a3c8fb5d27', 'data_format_hdf_eos', 3, 'HDF-EOS 5', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('50e8d566-b9ab-4bd9-9adc-92a3c8fb5d27', 'data_format_ogc_kml', 4, 'OGC KML', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('50e8d566-b9ab-4bd9-9adc-92a3c8fb5d27', 'data_format_netcdf_4', 5, 'NetCDF-4', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('50e8d566-b9ab-4bd9-9adc-92a3c8fb5d27', 'data_format_netcdf_classic', 6, 'NetCDF Classic', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('50e8d566-b9ab-4bd9-9adc-92a3c8fb5d27', 'data_format_other', 7, 'Other', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('50e8d566-b9ab-4bd9-9adc-92a3c8fb5d27', 'data_format_other_info', 8, 'If Other, please provide the data format(s).', 'text', '{}', '{}', '[{"field":"data_format_other","value":"true"}]','[]',  False);
INSERT INTO input VALUES ('228cb0d6-78fb-449a-8061-b1e6fb3f59d1', 'spatial_general_region', 0, 'Coverage', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('4f2dd369-d865-47ba-8504-8694493f129f', 'product_temporal_coverage_start', 0, 'Start', 'date', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('4f2dd369-d865-47ba-8504-8694493f129f', 'product_temporal_coverage_end', 1, 'End', 'date', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('dbf70495-433a-439e-8173-0cb20f972c16', 'data_product_status', 0, 'Product Status', 'radio', '["Yes","No"]', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('4c42796a-8ff1-444e-8fc5-82ccad82e5fb', 'data_delivery_frequency', 0, 'Unit', 'radio', '["Daily","Weekly","Monthly","Quarterly","Yearly","Varies"]', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('40672516-2220-4edc-8c1b-fd9f7e0b978f', 'data_product_volume_amount', 0, 'Amount', 'number', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('40672516-2220-4edc-8c1b-fd9f7e0b978f', 'data_product_volume_units', 1, 'Unit', 'radio', '["KB","MB","GB","TB","PB"]', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('53a0faa7-f7d4-4ce9-a9dc-a13cef44e1f3', 'example_file_url', 0, 'Sample File URL', 'text', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('f3e2eab9-6375-4e53-9cc2-3d16f318d332', 'long_term_support_poc_name', 0, 'First and Last Name', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('f3e2eab9-6375-4e53-9cc2-3d16f318d332', 'long_term_support_poc_organization', 1, 'Organization', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('f3e2eab9-6375-4e53-9cc2-3d16f318d332', 'long_term_support_poc_email', 2, 'Email', 'email', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('f3e2eab9-6375-4e53-9cc2-3d16f318d332', 'long_term_support_poc_orcid', 3, 'Orcid', 'text', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('d2bc7af7-211e-494a-a0bd-11b44f112eaa', 'funding_grant_number', 0, 'Grant Number', 'text', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('8a364184-42ac-48fe-b831-acb2eb08c729', 'data_producers_table', 0, 'undefined', 'table', '[{"key":"producer_first_name","label":"First Name","type":"text","editable":true},{"key":"producer_last_name_or_organization","label":"Last Name or Group","type":"text","editable":true}]', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('f625108f-7203-4045-9d1c-b1312b585584', 'data_production_latency_amount', 0, 'Amount', 'number', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('f625108f-7203-4045-9d1c-b1312b585584', 'data_production_latency_units', 1, 'Unit', 'radio', '["3 hours or less","24 hours or less","48 hours or less","2 to 7 days","1 week to 1 month","1 to 3 months","3 to 6 months","6 months to 1 year","more than 1 year"]', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('91c123bf-702e-458c-90a1-b26f6498937e', 'file_temporal_coverage_answer', 0, 'Time', 'number', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('91c123bf-702e-458c-90a1-b26f6498937e', 'file_temporal_coverage_units', 1, 'Unit', 'radio', '["Minute(s)","Hour(s)","Day(s)","Week(s)","Month(s)","Year(s)","Varies"]', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('4f2dd369-d865-47ba-8504-8694493f139f', 'value_temporal_resolution_answer', 0, 'Value', 'number', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('4f2dd369-d865-47ba-8504-8694493f139f', 'value_temporal_resolution_units', 1, 'Unit', 'radio', '["Millisecond(s)","Second(s)","Minute(s)","Hour(s)","Day(s)","Week(s)","Month(s)","Year(s)","Varies"]', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('4f2dd369-d865-47ba-8504-8694493f128f', 'temporal_coverage_notes_textarea', 0, 'Additional Information', 'textarea', '{}', '{"rows":10,"cols":80}', '[]','[]',  False);
INSERT INTO input VALUES ('15a012d0-9b4b-4979-9fa9-81fac1600b09', 'spatial_horizontal_1', 0, 'undefined', 'bbox', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('15a012d0-9b4b-4979-9fa9-81fac1600b09', 'spatial_horizontal_2', 1, 'undefined', 'bbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('15a012d0-9b4b-4979-9fa9-81fac1600b09', 'spatial_horizontal_3', 2, 'undefined', 'bbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('0f640f21-37ec-4d04-af2c-da955ae98e12', 'spatial_vertical_answer', 0, 'Has Vertical Dimension', 'radio', '["Yes","No"]', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('a3701d37-77cf-4ccc-8068-c6860a7a8929', 'spatial_vertical_details_upper', 0, 'Upper Amount', 'number', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('a3701d37-77cf-4ccc-8068-c6860a7a8929', 'spatial_vertical_details_upper_units', 1, 'Units', 'radio', '["km","m","feet","miles","mb","Pa","hPa","Varies"]', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('a3701d37-77cf-4ccc-8068-c6860a7a8929', 'spatial_vertical_details_lower', 2, 'Lower Amount', 'number', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('a3701d37-77cf-4ccc-8068-c6860a7a8929', 'spatial_vertical_details_lower_units', 3, 'Units', 'radio', '["km","m","feet","miles","mb","Pa","hPa","Varies"]', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('91577abc-a59c-40f7-b0e6-f954542e6b19', 'spatial_data_file', 0, 'Geographical Area by data file', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('a12ccd39-1d94-46a5-8aad-3587fd50c4ad', 'spatial_resolution', 0, 'Spatial Resolution', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('d1ef0a6f-284e-40a7-9248-75dd8f1f0ded', 'spatial_notes_textarea', 0, 'Additional Information', 'textarea', '{}', '{"rows":10,"cols":80}', '[]','[]',  False);
INSERT INTO input VALUES ('0a2fd2eb-62de-40e1-8143-3e8087a4062d', 'data_processing_level', 0, 'Processing Level', 'radio', '["Level 0","Level 1A","Level 1B","Level 2","Level 3","Level 4","Other"]', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('0a2fd2eb-62de-40e1-8143-3e8087a4062d', 'data_processing_other_info', 1, 'If Other', 'text', '{}', '{}', '[{"field":"data_processing_level","value":"Other"}]','[]',  False);
INSERT INTO input VALUES ('fbd25b6f-2731-4456-882b-ef840c11b671', 'variables_text', 0, 'Variables', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('70274fc6-86e8-4d95-8b2c-60135eff43f5', 'data_product_type_observational', 0, 'Observational', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('70274fc6-86e8-4d95-8b2c-60135eff43f5', 'data_product_type_model', 1, 'Model', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('9767336b-a9a9-41d2-8d2d-4fc2858c9b6f', 'platform_instrument', 0, 'Platform - instrument', 'text', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('ab57f5e8-9ec5-46c9-978e-d06125346d36', 'model_data_product', 0, 'Model Name and Version', 'text', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('f1d8ab9d-0959-41b8-8449-430986ddfe84', 'data_file_compression_answer', 0, 'Internal Compression', 'radio', '["Yes","No"]', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('40672516-2220-4edc-8c1b-fd9f7e0b979e', 'data_product_number_of_files', 0, 'Files', 'number', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('f2d8ab9d-0959-41b8-8449-430986ddfe84', 'browse_images_provided', 0, 'Images', 'radio', '["Yes","No"]', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('f2d8ab9d-0959-41b8-8449-430986ddfe84', 'browse_images_other', 1, 'Additional information about browse images', 'text', '{}', '{}', '[]','[]',  False);


-- User(id, name, email, registered, last_login)
INSERT INTO edpuser(id, name, email, refresh_token) VALUES ('1b10a09d-d342-4eee-a9eb-c99acd2dde17', 'Earthdata Pub System', 'no_email', 'none');

-- Group(id, short_name, long_name, description)
INSERT INTO edpgroup VALUES ('4daa6b22-f015-4ce2-8dac-8b3510004fca', 'root_group', 'Root Group', 'Full system access for administrators.');
INSERT INTO edpgroup VALUES ('bf07c445-8217-4f97-827a-82838cce36fb', 'asdc', 'ASDC', 'Top level group for ASDC');
INSERT INTO edpgroup VALUES ('b9e586c8-f602-4eae-98e1-5b406cd15ad2', 'asf_daac', 'ASF DAAC', 'Top level group for ASF DAAC');
INSERT INTO edpgroup VALUES ('fbc74dbc-4704-4b3e-b06a-43a78d6e7685', 'cddis', 'CDDIS', 'Top level group for CDDIS');
INSERT INTO edpgroup VALUES ('2385734f-f834-41dc-946c-11e23af6f3d6', 'ges_disc', 'GES DISC', 'Top level group for GES DISC');
INSERT INTO edpgroup VALUES ('e31d5a49-261a-4678-88e1-548ffb82df68', 'ghrc_daac', 'GHRC DAAC', 'Top level group for GHRC DAAC');
INSERT INTO edpgroup VALUES ('a0cda6f0-cc7d-4317-a3bb-115d51e713cc', 'laads_daac', 'LAADS DAAC', 'Top level group for LAADS DAAC');
INSERT INTO edpgroup VALUES ('d148c374-1b07-46a1-b06b-bee67c7c6447', 'lp_daac', 'LP DAAC', 'Top level group for LP DAAC');
INSERT INTO edpgroup VALUES ('7004aeee-34ea-4f68-a27b-eb34efc993f3', 'nsidc', 'NSIDC', 'Top level group for NSIDC');
INSERT INTO edpgroup VALUES ('65ba2a19-b296-4f2b-bf0c-4c1e8f226298', 'ob_daac', 'OB.DAAC', 'Top level group for OB.DAAC');
INSERT INTO edpgroup VALUES ('89816689-5375-4c81-a30c-bf6ed12d30fb', 'ornl_daac', 'ORNL DAAC', 'Top level group for ORNL DAAC');
INSERT INTO edpgroup VALUES ('e847900e-90e2-47f8-85c6-94e06bcbcca0', 'po_daac', 'PO.DAAC', 'Top level group for PO.DAAC');
INSERT INTO edpgroup VALUES ('f0a89bc6-707f-4a34-8041-1593934c2e42', 'sedac', 'SEDAC', 'Top level group for SEDAC');
INSERT INTO edpgroup VALUES ('5be24b44-d66b-4396-9266-a9d066000d9e', 'unassigned', 'No DAAC', 'Group for assets and users not otherwise assigned to a DAAC');

-- UserGroup(edpuser_id, edpgroup_id)
INSERT INTO edpuser_edpgroup VALUES ('1b10a09d-d342-4eee-a9eb-c99acd2dde17', '4daa6b22-f015-4ce2-8dac-8b3510004fca');

-- Role(id, short_name, long_name, description)
INSERT INTO edprole VALUES ('804b335c-f191-4d26-9b98-1ec1cb62b97d', 'data_producer', 'Data Producer', 'The person who is primarily responsible for the data themselves. Often the PI of the project that generated the data. This role will be able to create a Submission and edit their created or assigned Submissions.');
INSERT INTO edprole VALUES ('29ccab4b-65e2-4764-83ec-77375d29af39', 'data_poc', 'Data Point of Contact', 'The person who is filling out the Earthdata Pub Forms and expected to answer questions about the Submission. Can be the same as the DP and has the same permissions as a DP.');
INSERT INTO edprole VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'manager', 'DAAC Data Manager', 'The DAAC staff member who guides the Submission through Earthdata Pub workflows and iterates with the PoC on questions. This role will be able to add and edit submissions.');
INSERT INTO edprole VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'coordinator', 'DAAC Data Coordinator', 'The DAAC staff member who coordinates all DAAC Submissions. Coordinators assign a Submission to Managers. There may be multiple DAAC Data Coordinators per DAAC. Some DAACs may choose to combine the Coordinator and Manager roles by assigning staff to both.');
INSERT INTO edprole VALUES ('4be6ca4d-6362-478b-8478-487a668314b1', 'observer', 'DAAC Observer', 'A DAAC or ESDIS staff member who is interested in monitoring progress in Earthdata Pub but does not need edit or write permission. This can be a DAAC Manager or similar.');
INSERT INTO edprole VALUES ('75605ac9-bf65-4dec-8458-93e018dcca97', 'admin', 'Administrator', 'An Earthdata Pub admin can see and edit most aspects of Earthdata Pub.');

--Privilege(privilege)
INSERT INTO privilege VALUES ('ADMIN');

INSERT INTO privilege VALUES ('REQUEST_READ');
INSERT INTO privilege VALUES ('REQUEST_DAACREAD');
INSERT INTO privilege VALUES ('REQUEST_ADMINREAD');
INSERT INTO privilege VALUES ('REQUEST_INITIALIZE');
INSERT INTO privilege VALUES ('REQUEST_RESUME');
INSERT INTO privilege VALUES ('REQUEST_SUBMIT');
INSERT INTO privilege VALUES ('REQUEST_APPLY');
INSERT INTO privilege VALUES ('REQUEST_REVIEW');
INSERT INTO privilege VALUES ('REQUEST_REASSIGN');
INSERT INTO privilege VALUES ('REQUEST_LOCK');
INSERT INTO privilege VALUES ('REQUEST_UNLOCK');

INSERT INTO privilege VALUES ('USER_CREATE');
INSERT INTO privilege VALUES ('USER_READ');
INSERT INTO privilege VALUES ('USER_ADDGROUP');
INSERT INTO privilege VALUES ('USER_REMOVEGROUP');
INSERT INTO privilege VALUES ('USER_ADDROLE');
INSERT INTO privilege VALUES ('USER_REMOVEROLE');
INSERT INTO privilege VALUES ('USER_ADDPERMISSION');
INSERT INTO privilege VALUES ('USER_DELETE');

INSERT INTO privilege VALUES ('GROUP_CREATE');
INSERT INTO privilege VALUES ('GROUP_READ');
INSERT INTO privilege VALUES ('GROUP_UPDATE');
INSERT INTO privilege VALUES ('GROUP_DELETE');
INSERT INTO privilege VALUES ('GROUP_ADDPERMISSION');

INSERT INTO privilege VALUES ('ROLE_CREATE');
INSERT INTO privilege VALUES ('ROLE_READ');
INSERT INTO privilege VALUES ('ROLE_UPDATE');
INSERT INTO privilege VALUES ('ROLE_DELETE');
INSERT INTO privilege VALUES ('ROLE_ADDPRIVILEGE');

INSERT INTO privilege VALUES ('DAAC_CREATE');
INSERT INTO privilege VALUES ('DAAC_READ');
INSERT INTO privilege VALUES ('DAAC_UPDATE');
INSERT INTO privilege VALUES ('DAAC_DELETE');

INSERT INTO privilege VALUES ('FORM_CREATE');
INSERT INTO privilege VALUES ('FORM_READ');
INSERT INTO privilege VALUES ('FORM_UPDATE');
INSERT INTO privilege VALUES ('FORM_DELETE');

INSERT INTO privilege VALUES ('WORKFLOW_CREATE');
INSERT INTO privilege VALUES ('WORKFLOW_READ');
INSERT INTO privilege VALUES ('WORKFLOW_UPDATE');
INSERT INTO privilege VALUES ('WORKFLOW_DELETE');

INSERT INTO privilege VALUES ('METRICS_READ');

INSERT INTO privilege VALUES ('NOTE_NEW');
INSERT INTO privilege VALUES ('NOTE_REPLY');
INSERT INTO privilege VALUES ('NOTE_ADDUSER');
INSERT INTO privilege VALUES ('NOTE_ADDGROUP');

-- RolePrivilege(edprole_id, privilege) Administrator
INSERT INTO edprole_privilege VALUES ('75605ac9-bf65-4dec-8458-93e018dcca97', 'ADMIN');

-- RolePrivilege(edprole_id, privilege) Data Producer
INSERT INTO edprole_privilege VALUES ('804b335c-f191-4d26-9b98-1ec1cb62b97d', 'REQUEST_INITIALIZE');
INSERT INTO edprole_privilege VALUES ('804b335c-f191-4d26-9b98-1ec1cb62b97d', 'REQUEST_READ');
INSERT INTO edprole_privilege VALUES ('804b335c-f191-4d26-9b98-1ec1cb62b97d', 'REQUEST_SUBMIT');
INSERT INTO edprole_privilege VALUES ('804b335c-f191-4d26-9b98-1ec1cb62b97d', 'REQUEST_LOCK');
INSERT INTO edprole_privilege VALUES ('804b335c-f191-4d26-9b98-1ec1cb62b97d', 'REQUEST_UNLOCK');
INSERT INTO edprole_privilege VALUES ('804b335c-f191-4d26-9b98-1ec1cb62b97d', 'FORM_READ');
INSERT INTO edprole_privilege VALUES ('804b335c-f191-4d26-9b98-1ec1cb62b97d', 'DAAC_READ');
INSERT INTO edprole_privilege VALUES ('804b335c-f191-4d26-9b98-1ec1cb62b97d', 'NOTE_REPLY');

--RolePrivilege(edprole_id, privilege) Data Point of Contact
INSERT INTO edprole_privilege VALUES ('29ccab4b-65e2-4764-83ec-77375d29af39', 'REQUEST_INITIALIZE');
INSERT INTO edprole_privilege VALUES ('29ccab4b-65e2-4764-83ec-77375d29af39', 'REQUEST_READ');
INSERT INTO edprole_privilege VALUES ('29ccab4b-65e2-4764-83ec-77375d29af39', 'REQUEST_SUBMIT');
INSERT INTO edprole_privilege VALUES ('29ccab4b-65e2-4764-83ec-77375d29af39', 'REQUEST_LOCK');
INSERT INTO edprole_privilege VALUES ('29ccab4b-65e2-4764-83ec-77375d29af39', 'REQUEST_UNLOCK');
INSERT INTO edprole_privilege VALUES ('29ccab4b-65e2-4764-83ec-77375d29af39', 'FORM_READ');
INSERT INTO edprole_privilege VALUES ('29ccab4b-65e2-4764-83ec-77375d29af39', 'DAAC_READ');
INSERT INTO edprole_privilege VALUES ('29ccab4b-65e2-4764-83ec-77375d29af39', 'NOTE_REPLY');

--RolePrivelege(edprole_id, privilege) Data Manager
INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'REQUEST_INITIALIZE');
INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'REQUEST_DAACREAD');
INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'REQUEST_REVIEW');
INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'REQUEST_SUBMIT');
INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'REQUEST_LOCK');
INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'REQUEST_UNLOCK');
INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'FORM_READ');
INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'DAAC_READ');
INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'NOTE_NEW');
INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'NOTE_REPLY');
INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'NOTE_ADDUSER');
INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'METRICS_READ');

-- UserRole(edpuser_id, edrole_id)
INSERT INTO edpuser_edprole VALUES ('1b10a09d-d342-4eee-a9eb-c99acd2dde17', '75605ac9-bf65-4dec-8458-93e018dcca97');

-- Workflow(id, short_name, version, long_name, description)
INSERT INTO workflow VALUES ('c651b698-ec06-44d7-a69b-44bf8b4bc4f5', 'init_workflow', 1, 'Initialization Workflow', 'This workflow performs no actions and is used for initializing submissions.');
INSERT INTO workflow VALUES ('4bc927f2-f34a-4033-afe3-02520cc7dcf7', 'data_accession_request_workflow', 1, 'Data Accession Request Workflow', 'This is the default initial workflow for a new data accession request.');

-- Step(workflow_id, step_name, type, action_id, form_id, service_id, data)
INSERT INTO step(workflow_id, step_name, type) VALUES ('c651b698-ec06-44d7-a69b-44bf8b4bc4f5', 'init', 'init');
INSERT INTO step(workflow_id, step_name, type) VALUES ('c651b698-ec06-44d7-a69b-44bf8b4bc4f5', 'close', 'close');
INSERT INTO step(workflow_id, step_name, type) VALUES ('4bc927f2-f34a-4033-afe3-02520cc7dcf7', 'init', 'init');
INSERT INTO step(workflow_id, step_name, type, form_id) VALUES ('4bc927f2-f34a-4033-afe3-02520cc7dcf7', 'data_accession_request_form', 'form', '6c544723-241c-4896-a38c-adbc0a364293');
INSERT INTO step(workflow_id, step_name, type, data) VALUES ('4bc927f2-f34a-4033-afe3-02520cc7dcf7', 'data_accession_request_form_review', 'review', '{"rollback":"data_accession_request_form","type": "form","form_id":"6c544723-241c-4896-a38c-adbc0a364293"}');
INSERT INTO step(workflow_id, step_name, type) VALUES ('4bc927f2-f34a-4033-afe3-02520cc7dcf7', 'close', 'close');

-- StepEdge(workflow_id, step_name, next_step_name)
INSERT INTO step_edge VALUES ('c651b698-ec06-44d7-a69b-44bf8b4bc4f5', 'init', 'close');
INSERT INTO step_edge VALUES ('4bc927f2-f34a-4033-afe3-02520cc7dcf7', 'init', 'data_accession_request_form');
INSERT INTO step_edge VALUES ('4bc927f2-f34a-4033-afe3-02520cc7dcf7', 'data_accession_request_form', 'data_accession_request_form_review');
INSERT INTO step_edge VALUES ('4bc927f2-f34a-4033-afe3-02520cc7dcf7', 'data_accession_request_form_review', 'close');

-- DAAC(id, short_name, long_name, url, description, discipline, workflow_id, edpgroup_id)
INSERT INTO daac VALUES ('40397fe8-4841-4e4c-b84a-6ece359ff5ff', 'ASDC', 'Atmospheric Science Data Center (ASDC)', 'https://eosweb.larc.nasa.gov/', 'NASA''s Atmospheric Science Data Center (ASDC) is in the Science Directorate located at NASA''S Langley Research Center in Hampton, Virginia. The Science Directorate''s Climate Science Branch, Atmospheric Composition Branch, and Chemistry and Dynamics Branch work with ASDC to study changes in the Earth and its atmosphere. Data products translate those findings into meaningful knowledge that inspires action by scientists, educators, decision makers, and the public. ASDC supports over 50 projects and provides access to more than 1,000 archived data sets. These data sets were created from satellite measurements, field experiments, and modeled data products. ASDC projects focus on the Earth science disciplines Radiation Budget, Clouds, Aerosols, and Tropospheric Composition.', 'SAR Products, Change Detection, Sea Ice, Polar Processes', '4bc927f2-f34a-4033-afe3-02520cc7dcf7', 'bf07c445-8217-4f97-827a-82838cce36fb');
INSERT INTO daac VALUES ('c606afba-725b-4ae4-9557-1fd33260ae12', 'ASF DAAC', 'Alaska Satellite Facility (ASF) Distributed Active Archive Center (DAAC)', 'https://www.asf.alaska.edu/?_ga=2.11078268.912458096.1583768373-843631388.1568298089', 'NASA''s Alaska Satellite Facility Distributed Active Archive Center (ASF DAAC) is located in the Geophysical Institute at the University of Alaska, Fairbanks. ASF DAAC is supported by NASA to acquire, process, archive, and distribute synthetic aperture radar (SAR) data from polar-orbiting satellite and airborne sensors to advance Earth science research. Most of the datasets at ASF DAAC, including Copernicus Sentinel-1, are open access and freely available to the public for download.', 'Radiation Budget, Clouds, Aerosols, Tropospheric Composition', '4bc927f2-f34a-4033-afe3-02520cc7dcf7', 'b9e586c8-f602-4eae-98e1-5b406cd15ad2');
INSERT INTO daac VALUES ('d551380f-8813-40e4-9763-2a5bb6007cd0', 'CDDIS', 'Crustal Dynamics Data Information System (CDDIS)', 'http://cddis.gsfc.nasa.gov/', 'NASA''s Crustal Dynamics Data Information System (CDDIS) is NASA''s data archive and information service supporting the international space geodesy community. CDDIS is part of the Solar System Exploration Division at NASA''s Goddard Space Flight Center in Greenbelt, MD. CDDIS serves as one of the core components for the geometric services established under the International Association of Geodesy (IAG), an organization that promotes scientific cooperation and research in geodesy on a global scale. CDDIS provides continuous, long term, public access to the data and derived products from a global network of observing stations equipped with one or more of the following measurement techniques: Global Navigation Satellite System (GNSS),Satellite Laser Ranging (SLR),Lunar Laser Ranging (LLR),Very Long Baseline Interferometry (VLBI), andDoppler Orbitography and Radiopositioning Integrated by Satellite (DORIS)', 'Space Geodesy, Solid Earth', '4bc927f2-f34a-4033-afe3-02520cc7dcf7', 'fbc74dbc-4704-4b3e-b06a-43a78d6e7685');
INSERT INTO daac VALUES ('1ea1da68-cb95-431f-8dd8-a2cf16d7ef98', 'GES DISC', 'Goddard Earth Sciences Data and Information Services Center (GES DISC)', 'https://disc.gsfc.nasa.gov/', 'NASA''s Goddard Earth Sciences Data and Information Services Center (GES DISC) is located within NASA''s Goddard Space Flight Center in Greenbelt, Maryland. It provides access to a wide range of global climate data, concentrated primarily in the areas of atmospheric composition, atmospheric dynamics, global precipitation, and solar irradiance. GES DISC supports data from many heritage and EOS missions including Aqua, Aura, Solar Radiation and Climate Experiment (SORCE), Tropical Rainfall Measuring Mission (TRMM), Upper Atmosphere Research Satellite (UARS), and Earth Probe/Total Ozone Mapping Spectrometers (TOMS). GES DISC also provides data subsetting, exploration, visualization, and access services.', 'Global Precipitation, Solar Irradiance, Atmospheric Composition and Dynamics, Water and Energy', '4bc927f2-f34a-4033-afe3-02520cc7dcf7', '2385734f-f834-41dc-946c-11e23af6f3d6');
INSERT INTO daac VALUES ('ef229725-1cad-485e-a72b-a276d2ca3175', 'GHRC DAAC', 'Global Hydrology Resource Center (GHRC) Distributed Active Archive Center (DAAC)', 'https://ghrc.nsstc.nasa.gov/home/', 'NASA''s Global Hydrology Resource Center (GHRC) Distributed Active Archive Center (DAAC) is a joint venture of NASA''s Marshall Space Flight Center and the Information Technology and Systems Center (ITSC) located within the University of Alabama in Huntsville. GHRC DAAC was established in 1991 and is located at the National Space Science and Technology Center on the UAH campus. GHRC DAAC provides a comprehensive active archive of both data and knowledge augmentation services, with a focus on hazardous weather, its governing dynamical and physical processes, and associated applications. With this broad mandate, GHRC DAAC focuses on lightning, tropical cyclones and storm-induced hazards through integrated collections of satellite, airborne, and in-situ data sets.', 'Lightning, Severe Weather Interactions, Atmospheric Convection, Hurricanes, Storm-induced Hazards', '4bc927f2-f34a-4033-afe3-02520cc7dcf7', 'e31d5a49-261a-4678-88e1-548ffb82df68');
INSERT INTO daac VALUES ('9e0628f1-0dde-4ed2-b1e3-690c70326f25', 'LAADS DAAC', 'Level 1 Atmosphere Archive and Distribution System (LAADS) Distributed Active Archive Center (DAAC)', 'https://ladsweb.modaps.eosdis.nasa.gov/', 'NASA''s Level-1 and Atmosphere Archive and Distribution System (LAADS) Distributed Active Archive Center (DAAC) is part of the Terrestrial Information Systems Laboratory at NASA''s Goddard Space Flight Center in Greenbelt, MD. It is collocated with the MODIS Adaptive Processing System (MODAPS). LAADS DAAC joined the EOSDIS DAACs in 2007. LAADS DAAC provides access to MODIS Level 1 data (geolocation, L1A, and radiance L1B) and Atmosphere (Level 2 and 3) data products. LAADS DAAC receives data processed by MODAPS and archives and distributes MODIS products from both the Terra and Aqua platforms: Level-1 products (calibrated radiances and geolocation) and Level-2 and -3. MODAPS supports MODIS data from both the Terra and Aqua platforms. Products may be subset by parameter, area, or band, and may be mosaicked, reprojected, or masked. Users may also visually browse MODIS level 1 and atmosphere data products.', 'MODIS (Moderate Resolution Imaging Spectrometer) Level 1 data (geolocation, L1A, and radiance L1B) and Atmosphere (Level 2 and Level 3)', '4bc927f2-f34a-4033-afe3-02520cc7dcf7', 'a0cda6f0-cc7d-4317-a3bb-115d51e713cc');
INSERT INTO daac VALUES ('de6d5ec9-4728-4f2b-9d43-ae2f0fdac96a', 'LP DAAC', 'Land Processes Distributed Active Archive Center (LP DAAC)', 'https://lpdaac.usgs.gov/', 'NASA''s Land Processes Distributed Active Archive Center (LP DAAC) is located at the U.S. Department of the Interior, U.S. Geological Survey (USGS) Earth Resources Observation and Science (EROS) Center in Sioux Falls, SD. LP DAAC was established in 1990 to process NASA land processes data products and provide vital contributions to inter-disciplinary studies of the integrated Earth system. LP DAAC specializes in: Processing, archiving, and distributing Advanced Spaceborne Thermal Emission and Reflection Radiometer (ASTER) from Terra; Archiving and distributing Moderate-resolution Imaging Spectroradiometer (MODIS) from Terra and Aqua; Archiving and distributing NASA Visible Infrared Imaging Radiometer Suite (VIIRS) data from the joint NASA/NOAA Suomi National Polar-orbiting Partnership (Suomi NPP) satellite; Archiving and distributing ECOsystem Spaceborne Thermal Radiometer Experiment on Space Station (ECOSTRESS) data from the International Space Station. Archiving and distributing Global Ecosystem Dynamics Investigation (GEDI) data from the International Space Station. Distributing NASA Making Earth System Data Records for Use in Research Environments (MEaSUREs) Collaborations: Global Forest Cover Change  (GFCC) Global Food Security-support Analysis Data  (GFSAD) Global Web-Enabled Landsat Data  (GWELD) Land Surface Temperature and Emissivity  (LSTE) NASA Digital Elevation Model (DEM)  (NASADEM) Shuttle Radar Topography Mission  (SRTM) Vegetation Continuous Fields  (VCF) Vegetation Index and Phenology  (VIP) Distributing approved data products created by researchers, collectively known as Community: Airborne Hyperspectral Reflectance Mosaic ASTER Global Emissivity Database  (GED) Global Hyperspectral Imaging Spectral-library of Agricultural crops  (GHISA) Headwall Hyperspectral Reflectance Mosaic Providing tools and services for discovery and analysis of NASA''s land cover and land use data.', 'Land data products', '4bc927f2-f34a-4033-afe3-02520cc7dcf7', 'd148c374-1b07-46a1-b06b-bee67c7c6447');
INSERT INTO daac VALUES ('aec3724f-b30b-4b3f-9b9a-e0907d9d14b3', 'NSIDC DAAC', 'National Snow and Ice Data Center (NSIDC) Distributed Active Archive Center (DAAC)', 'http://nsidc.org/daac/', 'NASA''s National Snow and Ice Data Center (NSIDC) Distributed Active Archive Center (DAAC) provides data and information for snow and ice processes, particularly interactions among snow, ice, atmosphere, and ocean, in support of research in global change detection and model validation. NSIDC DAAC archives and distributes cryosphere and climate related products from several EOS sensors including: Advanced Microwave Scanning Radiometer - EOS  (AMSR-E) AMSR2 Aquarius Airborne Snow Observatory  (ASO) Cold Land Processes Field Experiment  (CLPX) Global Land Ice Measurements  (GLIMS) IceBridge ICESat/Geoscience Laser Altimeter System  (GLAS) Ice, Cloud, and land Elevation Satellite-2  (ICESat-2) Moderate Resolution Imaging Spectroradiometer  (MODIS) Soil Moisture Active Passive  (SMAP) Scanning Multichannel Microwave Radiometer  (SMMR) Special Sensor Microwave Imager  (SSM/I) Special Sensor Microwave Imager/Sounder  (SSMIS) Snow Experiment  (SnowEX) Visible Infrared Imaging Radiometer Suite  (VIIRS) NSIDC DAAC also provides general data and information services to the cryospheric and polar processes research community. NSIDC DAAC is located in Boulder, CO. NSIDC DAAC has served at the forefront of cryospheric data management practices since 1976. NSIDC DAAC is part of the Cooperative Institute for Research in Environmental Sciences (CIRES), a joint institute of University of Colorado Boulder and the National Oceanic and Atmospheric Administration.', 'Cryospheric Processes, Sea Ice, Snow, Ice Sheets, Frozen Ground, Glaciers, Soil Moisture', '4bc927f2-f34a-4033-afe3-02520cc7dcf7', '7004aeee-34ea-4f68-a27b-eb34efc993f3');
INSERT INTO daac VALUES ('fe75c306-ac04-4689-a702-073d9cb071fe', 'OB.DAAC', 'Ocean Biology Distributed Active Archive Center (OB.DAAC)', 'https://oceancolor.gsfc.nasa.gov/', 'NASA''s Ocean Biology Distributed Active Archive Center (OB.DAAC) is managed by NASA''s Ocean Biology Processing Group (OBPG). OB.DAAC is responsible for archiving satellite ocean biology data produced or collected under NASA’s Earth Observing System Data and Information System (EOSDIS). OB.DAAC''s holdings include a mixture of historical and current missions, as well as data from both NASA and partner space organizations. Supported sensors, related information, and direct links to data can be found on the OB.DAAC website.', 'Ocean Biology', '4bc927f2-f34a-4033-afe3-02520cc7dcf7', '65ba2a19-b296-4f2b-bf0c-4c1e8f226298');
INSERT INTO daac VALUES ('15df4fda-ed0d-417f-9124-558fb5e5b561', 'ORNL DAAC', 'Oak Ridge National Laboratory (ORNL) Distributed Active Archive Center (DAAC)', 'http://daac.ornl.gov/', 'NASA''s Oak Ridge National Laboratory (ORNL) Distributed Active Archive Center (DAAC) is located at the Oak Ridge National Laboratory in Oak Ridge, Tennessee. ORNL DAAC was established in 1993 and is under an interagency agreement between NASA and the Department of Energy. ORNL DAAC specializes on data and information relevant to terrestrial biogeochemistry, ecology, and environmental processes, which are critical to understanding the dynamics of Earth''s biological, geological, and chemical components.', 'Biogeochemical Dynamics, Ecological Data, Environmental Processes', '4bc927f2-f34a-4033-afe3-02520cc7dcf7', '89816689-5375-4c81-a30c-bf6ed12d30fb');
INSERT INTO daac VALUES ('6b3ea184-57c5-4fc5-a91b-e49708f91b67', 'PO.DAAC', 'Physical Oceanography Distributed Active Archive Center (PO.DAAC)', 'http://podaac.jpl.nasa.gov/', 'NASA''s Physical Oceanography Distributed Active Archive Center (PO.DAAC) is located at NASA''s Jet Propulsion Laboratory in Pasadena, California. PO.DAAC manages and provides tools and services for NASA''s oceanographic and hydrologic data (satellite, airborne, and in-situ) to enable greater understanding of the physical processes and condition of the global ocean. Measurements include gravity, ocean winds, sea surface temperature, ocean surface topography, sea surface salinity, ocean currents, and circulation. The data support a wide range of applications including climate research, weather prediction, resource management, policy, and the stewardship of ocean data resources. Sample data holdings include Aquarius, Soil Moisture Active Passive (SMAP), Gravity Recovery and Climate Experiment(GRACE), GRACE Follow-on (GRACE-FO), NASA Scatterometer (NSCAT), Quick Scatterometer (QuikSCAT), Rapid Scatterometer (RapidScat), Cyclone Global Navigation Satellite System (CYGNSS), TOPEX/POSEIDON, Jason-1, Group for High Resolution Sea Surface Temperature (GHRSST), Oceans Melting Greenland (OMG), Salinity Processes in the Upper Ocean Regional Study (SPURS), and Making Earth System Data Records for Use in Research Environments (MEaSUREs). Data access services include PO.DAAC Drive, Thematic Real-time Environmental Distributed Data Services (THREDDS), Open-source Project for a Network Data Access Protocol (OPeNDAP), PO.DAAC Web Services, and PO.DAAC GitHub repository. Tools that provide subsetting, extraction, and visualization capabilities include High-level Tool for Interactive Data Extraction (HiTIDE), Live Access Server (LAS), and State of the Ocean (SOTO).', 'Gravity, Ocean Circulation, Ocean Heat Budget, Ocean Surface Topography, Ocean Temperature, Ocean Waves, Ocean Winds, Ocean Salinity, Surface Water', '4bc927f2-f34a-4033-afe3-02520cc7dcf7', 'e847900e-90e2-47f8-85c6-94e06bcbcca0');
INSERT INTO daac VALUES ('00dcf32a-a4e2-4e55-a0d1-3a74cf100ca1', 'SEDAC', 'Socioeconomic Data and Applications Data Center (SEDAC)', 'http://sedac.ciesin.columbia.edu/', 'NASA''s Socioeconomic Data and Applications Center (SEDAC) is operated by the Center for International Earth Science Information Network (CIESIN), a unit of the Earth Institute at Columbia University based at the Lamont-Doherty Earth Observatory in Palisades, New York. SEDAC''s missions are to synthesize Earth science and socioeconomic data and information in ways useful to a wide range of decision makers and other applied users, and to provide an “Information Gateway” between the socioeconomic and Earth science data and information domains. SEDAC datasets can be accessed via the dataset section of the SEDAC web site.', 'Synthesized Earth science and socio-economic data', '4bc927f2-f34a-4033-afe3-02520cc7dcf7', 'f0a89bc6-707f-4a34-8041-1593934c2e42');
INSERT INTO daac VALUES ('1c36f0b9-b7fd-481b-9cab-3bc3cea35413', 'Unknown', 'Unknown DAAC', 'https://earthdata.nasa.gov', 'Choose this if you are not sure where the data product should be archived.', '', '4bc927f2-f34a-4033-afe3-02520cc7dcf7', '4daa6b22-f015-4ce2-8dac-8b3510004fca');

-- Page(page_key, content)
INSERT INTO page VALUES ('overview', '{"page_key":"overview","id":4, "heading":"Data Scope and Acceptance Policy", "paragraphs":["Data from NASA science missions and some NASA research programs are automatically assigned to a DAAC by NASA ESDS.  All other data must be approved by NASA ESDS and ESDIS in order to be submitted to a DAAC for publication. This approval process is initiated by submitting the Data Publication Request form.","When a Data Publication Request is received, the DAAC and the DAAC‘s User Working Group will then conduct an assessment of the data product’s alignment with the DAAC’s science domain, the scientific impact and community need, and the DAAC resources necessary to publish and support the data. The DAAC provides the information supplied in your Data Publication Request and their assessment to the NASA ESDIS project and ESDS program for review and approval.  For instructions on how to submit a Data Publication Request, see the Earthdata Pub Instructions for Data Producers page.","For more information on NASA EOSDIS data scope and acceptance policies, visit the Earthdata Adding New Data to EOSDIS page.","NASA’s Earth Observing System Data and Information System (EOSDIS) is responsible for the storage and public distribution of NASA Earth observation data. The scope of data which will be considered for publication at a NASA DAAC includes data:"], "list":["produced by NASA science missions","produced by scientists at NASA facilities","resulting from NASA research program funding","resulting from NASA Applied Science funding if aligned with Earth observation data","created from NASA data","strongly supporting NASA Earth observation data"]}');
