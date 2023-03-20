
-- Form(id, short_name, version, long_name, description, text)
INSERT INTO form VALUES ('6c544723-241c-4896-a38c-adbc0a364293', 'data_accession_request', 1, 'Data Accession Request', 'This form is used to get high level information about a dataset, typically this will be submitted by the data provider or an appropriate agent.');
INSERT INTO form VALUES ('19025579-99ca-4344-8610-704dae626343', 'data_publication_request', 1, 'Data Publication Request', 'This form is used to get high level information about a dataset, typically this will be submitted by the data provider or an appropriate agent.');

-- Section(id, form_id, heading, list_order)
INSERT INTO section VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b50', '6c544723-241c-4896-a38c-adbc0a364293', 'Contact Information', 0, '[]', '[]');
INSERT INTO section VALUES ('e2b23c21-32cc-4423-9363-61887abe29c7', '6c544723-241c-4896-a38c-adbc0a364293', 'Funding Information', 1, '[]', '[]');
INSERT INTO section VALUES ('049e63e8-018d-4c3f-96f1-80c73e0f4287', '6c544723-241c-4896-a38c-adbc0a364293', 'General Information', 2, '[]', '[]');
INSERT INTO section VALUES ('2ba04d20-5473-42b7-907c-10ef384f90c8', '6c544723-241c-4896-a38c-adbc0a364293', 'Technical Information', 3, '[]', '[]');
INSERT INTO section VALUES ('6cabfad8-912c-4f9b-bf96-78d7145787c9', '19025579-99ca-4344-8610-704dae626343', 'Contact Information', 0, '[]', '[]');
INSERT INTO section VALUES ('e169a5b4-da2e-4893-9481-1b9351cd9707', '19025579-99ca-4344-8610-704dae626343', 'Funding Information', 1, '[]', '[]');
INSERT INTO section VALUES ('768a6b51-4864-458c-b20d-fb8b4c7dc606', '19025579-99ca-4344-8610-704dae626343', 'General Information', 2, '[]', '[]');
INSERT INTO section VALUES ('f1fbc110-a6d0-4830-8a34-85992e693fda', '19025579-99ca-4344-8610-704dae626343', 'Temporal Information', 3, '[]', '[]');
INSERT INTO section VALUES ('5370c74a-df0b-4f75-b8fa-2f41f1392ad4', '19025579-99ca-4344-8610-704dae626343', 'Spatial Information', 4, '[]', '[]');
INSERT INTO section VALUES ('b0934ecc-1aa1-4e07-9cbc-f1299126aee0', '19025579-99ca-4344-8610-704dae626343', 'Technical Information', 5, '[]', '[]');

-- Question(id, short_name, version, long_name, text, help)
INSERT INTO question VALUES ('80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e2', 'data_producer_info', 1, 'Primary Data Producer', 'Who is the primary person responsible for the collection or creation of this data product?', 'Often this is the Principle Investigator, Project Scientist, or Project Manager');
INSERT INTO question VALUES ('f3e2eab9-6375-4e53-9cc2-3d16f318d333', 'point_of_contact', 1, 'Data Accession Point of Contact', 'Who should the DAAC contact with questions regarding this Data Accession request?', 'This person should have in-depth knowledge of this data product, allowing them to provide additional information as needed.');
INSERT INTO question VALUES ('8a364184-42ac-48fe-b831-acb2eb08c728', 'funding_organization', 1, 'Funding Organization', 'What organization(s) funded the creation of this data product?', '');
INSERT INTO question VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d085', 'funding_program', 1, 'Funding Program/Element', 'Under what program or program element within the funding organization was this data product created?', 'For example, NASA programs such as MEaSUREs, Terrestrial Hydrology, Earth Venture, ACCESS, or AIST.');
INSERT INTO question VALUES ('f74c6c20-7483-40f9-a63e-58cc20ae8c8f', 'data_product_name', 1, 'Data Product Name', 'How do you refer to this data product?', 'The DAAC will use this information to develop an official data product name in compliance with DAAC/ESDIS standards.');
INSERT INTO question VALUES ('39701413-ac96-4b66-9c2f-2d9c08a18ed9', 'data_product_description', 1, 'Data Product Description', 'Please provide a brief description of this data product.', 'The description should mimic a journal abstract and should provide a reader with the information needed to quickly understand the relevance and usefulness of the data.');
INSERT INTO question VALUES ('c9c73e88-837a-42d2-aa1a-50874a333607', 'data_product_doi', 1, 'Data Product DOI', 'If a Digital Object Identifier (DOI) already exists for this data product, please provide it.', 'This would be the DOI for the actual data product and not for a publication related to this data product.');
INSERT INTO question VALUES ('7fd7bccf-5065-4033-9956-9e80bc99c205', 'science_value', 1, 'Science Value', 'Please describe the science value of this data product.', 'For example, how will this data product benefit the science community? What are the strengths and the limitations of this data product? What other data products does it compliment?');
INSERT INTO question VALUES ('bd00dbb7-1d3c-46fa-82a4-734236f4e06c', 'data_accession_reason', 1, 'Reason for Data Accession Request', 'Please briefly explain your reasons for requesting to have this data product archived and distributed at the DAAC.', 'For example, are you attempting to publish a paper which requires data to be archived in a trusted repository? Have you been instructed by a NASA program manager to archive your data at a DAAC? Do you want this data product distributed with related data?');
INSERT INTO question VALUES ('f40956c3-9af8-400e-8dd8-c5e2965dcb8a', 'data_accession_approval_dependencies', 1, 'Dependencies for Data Accession Approval', 'Do you have any dependencies related to this data product being approved to be published at the DAAC? If Yes, please provide a brief explanation.', 'For example, are you hoping to have this data product approved to be published at the DAAC prior publishing a paper or presenting at a conference? Does your project have a defined timeline in which this data product needs to be published?');
INSERT INTO question VALUES ('2dd6c8b1-22a8-4866-91c3-da9b4ce849dc', 'data_product_restrictions', 1, 'Data Product Restrictions', 'Can this data product be publicly released in compliance with NASA''s Open Data Policy? If No or Not sure, please provide a brief explanation.', 'For a description of the open data policy, please refer to the NASA Earthdata Data and Information Policy web page <https://earthdata.nasa.gov/collaborate/open-data-services-and-software/data-information-policy>.');
INSERT INTO question VALUES ('ad568b2f-89fe-4afd-a0bf-9e5832b71ce9', 'data_product_documentation', 1, 'Data Product Documentation', 'Please provide URLs to additional documents.', 'For example, these documents may include descriptions of the variables, filename conventions, processing steps, and/or data quality.');
INSERT INTO question VALUES ('50e8d566-b9ab-4bd9-9adc-92a3c8fb5d27', 'data_format', 1, 'Data Format', 'What file format(s) does this data product include?', 'For a list of NASA-approved data formats, please refer to the NASA Earthdata Standards and Practices web page <https://earthdata.nasa.gov/esdis/eso/standards-and-references#data-formats>.');
INSERT INTO question VALUES ('228cb0d6-78fb-449a-8061-b1e6fb3f59d1', 'spatial_general', 1, 'Data Product Spatial Coverage', 'What is the general geographic region covered by this data product?', 'For example, Global, Northern Hemisphere, Alaska, Korean Peninsula, East Tropical Pacific, or Gulf Stream.');
INSERT INTO question VALUES ('4f2dd369-d865-47ba-8504-8694493f129f', 'product_temporal_coverage', 1, 'Data Product Temporal Coverage', 'What period of time is covered by the entire data product, upon planned delivery to the DAAC?', 'The temporal coverage should encompass the beginning date of the first data file and the ending date of the last data file, even if there are time gaps.');
INSERT INTO question VALUES ('dbf70495-433a-439e-8173-0cb20f972c16', 'data_product_status', 1, 'Data Product Status', 'After this data product has been published at the DAAC, will you continue to collect or create new data to extend the time series?', '');
INSERT INTO question VALUES ('4c42796a-8ff1-444e-8fc5-82ccad82e5fb', 'data_delivery_frequency', 1, 'Data Delivery Frequency', 'What is the anticipated frequency of additional data deliveries to the DAAC?', 'undefined');
INSERT INTO question VALUES ('40672516-2220-4edc-8c1b-fd9f7e0b978f', 'data_product_volume', 1, 'Data Product Volume', 'What is the estimated or actual total volume of this data product?', 'The DAAC uses the total volume of the final data product to plan data storage requirements. If the final data product is not complete, please provide your best estimate for the total data volume.');
INSERT INTO question VALUES ('53a0faa7-f7d4-4ce9-a9dc-a13cef44e1f3', 'sample_data_file', 1, 'Sample Data File(s)', 'Please provide a URL to a sample file(s).', 'Providing sample data files that are representative of the range of data within this data product will help the DAAC understand and provide feedback on the data format, structure, and content.');
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
INSERT INTO input VALUES ('80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e2', 'data_producer_info_orcid', 3, 'ORCID', 'text', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('f3e2eab9-6375-4e53-9cc2-3d16f318d333', 'poc_name', 0, 'First and Last Name', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('f3e2eab9-6375-4e53-9cc2-3d16f318d333', 'poc_organization', 1, 'Organization', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('f3e2eab9-6375-4e53-9cc2-3d16f318d333', 'poc_email', 2, 'Email', 'email', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('f3e2eab9-6375-4e53-9cc2-3d16f318d333', 'poc_orcid', 3, 'ORCID', 'text', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('8a364184-42ac-48fe-b831-acb2eb08c728', 'funding_nasa', 0, 'NASA', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('8a364184-42ac-48fe-b831-acb2eb08c728', 'funding_noaa', 1, 'NOAA', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('8a364184-42ac-48fe-b831-acb2eb08c728', 'funding_nsf', 2, 'NSF', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('8a364184-42ac-48fe-b831-acb2eb08c728', 'funding_usgs', 3, 'USGS', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('8a364184-42ac-48fe-b831-acb2eb08c728', 'funding_university', 4, 'University', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('8a364184-42ac-48fe-b831-acb2eb08c728', 'funding_other', 5, 'Other', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('8a364184-42ac-48fe-b831-acb2eb08c728', 'funding_organization_other', 6, 'If University or Other', 'text', '{}', '{}', '[{"field":"funding_university","value":"true","message":"Please provide a University organization.  "},{"field":"funding_other","value":"true","message":"Please provide a text value for the funding organization."}]','[]',  False);
INSERT INTO input VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d085', 'funding_program_name', 0, 'Program', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('f74c6c20-7483-40f9-a63e-58cc20ae8c8f', 'data_product_name_value', 0, 'Name', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('39701413-ac96-4b66-9c2f-2d9c08a18ed9', 'data_product_description', 0, 'Description', 'textarea', '{}', '{"rows":3,"cols":20}', '[]','[]',  True);
INSERT INTO input VALUES ('c9c73e88-837a-42d2-aa1a-50874a333607', 'data_product_doi_exists', 0, 'Has DOI', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('c9c73e88-837a-42d2-aa1a-50874a333607', 'data_product_doi', 1, '', 'table', '[{"key": "data_product_doi_value","label": "DOI","type": "text","editable": true}]', '{}', '[{"field":"data_product_doi_exists","value":"true","message":"Please add DOIs."}]','[]',  False);
INSERT INTO input VALUES ('7fd7bccf-5065-4033-9956-9e80bc99c205', 'science_value_description', 0, 'Description', 'textarea', '{}', '{"rows":3,"cols":20}', '[]','[]',  True);
INSERT INTO input VALUES ('bd00dbb7-1d3c-46fa-82a4-734236f4e06c', 'data_accession_reason_description', 0, 'Description', 'textarea', '{}', '{"rows":5,"cols":20,"maxlength":1000,"placeholder":""}', '[]','[]',  True);
INSERT INTO input VALUES ('f40956c3-9af8-400e-8dd8-c5e2965dcb8a', 'data_accession_approval_dependencies_radios', 0, 'Has Dependencies', 'radio', '["Yes","No"]', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('f40956c3-9af8-400e-8dd8-c5e2965dcb8a', 'data_accession_approval_dependencies_explanation', 1, 'If Yes, provide explanation', 'text', '{}', '{}', '[{"field":"data_accession_approval_dependencies_radios","value":"Yes","message":"Please provide an explanation of the data product''s dependencies."}]','[]',  False);
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
INSERT INTO input VALUES ('40672516-2220-4edc-8c1b-fd9f7e0b978f', 'data_product_volume_amount', 0, 'Amount', 'number', '{}', '{"min": "1"}', '[]','[]',  True);
INSERT INTO input VALUES ('40672516-2220-4edc-8c1b-fd9f7e0b978f', 'data_product_volume_units', 1, 'Unit', 'radio', '["KB","MB","GB","TB","PB"]', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('53a0faa7-f7d4-4ce9-a9dc-a13cef44e1f3', 'example_file_url', 0, 'Sample File URL', 'text', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('f3e2eab9-6375-4e53-9cc2-3d16f318d332', 'long_term_support_poc_name', 0, 'First and Last Name', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('f3e2eab9-6375-4e53-9cc2-3d16f318d332', 'long_term_support_poc_organization', 1, 'Organization', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('f3e2eab9-6375-4e53-9cc2-3d16f318d332', 'long_term_support_poc_email', 2, 'Email', 'email', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('f3e2eab9-6375-4e53-9cc2-3d16f318d332', 'long_term_support_poc_orcid', 3, 'ORCID', 'text', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('d2bc7af7-211e-494a-a0bd-11b44f112eaa', 'funding_grant_number', 0, 'Grant Number', 'text', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('8a364184-42ac-48fe-b831-acb2eb08c729', 'data_producers_table', 0, '', 'table', '[{"key":"producer_first_name","label":"First Name","type":"text","editable":true},{"key": "producer_middle_initial","label": "Middle Initial","type": "text","editable": true},{"key":"producer_last_name_or_organization","label":"Last Name or Group","type":"text","editable":true}]', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('f625108f-7203-4045-9d1c-b1312b585584', 'data_production_latency_amount', 0, 'Amount', 'number', '{}', '{"min": "1"}', '[]','[]',  False);
INSERT INTO input VALUES ('f625108f-7203-4045-9d1c-b1312b585584', 'data_production_latency_units', 1, 'Unit', 'radio', '["3 hours or less","24 hours or less","48 hours or less","2 to 7 days","1 week to 1 month","1 to 3 months","3 to 6 months","6 months to 1 year","more than 1 year"]', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('91c123bf-702e-458c-90a1-b26f6498937e', 'file_temporal_coverage_answer', 0, 'Time', 'number', '{}', '{"min": "1"}', '[]','[]',  True);
INSERT INTO input VALUES ('91c123bf-702e-458c-90a1-b26f6498937e', 'file_temporal_coverage_units', 1, 'Unit', 'radio', '["Minute(s)","Hour(s)","Day(s)","Week(s)","Month(s)","Year(s)","Varies"]', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('4f2dd369-d865-47ba-8504-8694493f139f', 'value_temporal_resolution_answer', 0, 'Value', 'number', '{}', '{"min": "1"}', '[]','[]',  True);
INSERT INTO input VALUES ('4f2dd369-d865-47ba-8504-8694493f139f', 'value_temporal_resolution_units', 1, 'Unit', 'radio', '["Millisecond(s)","Second(s)","Minute(s)","Hour(s)","Day(s)","Week(s)","Month(s)","Year(s)","Varies"]', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('4f2dd369-d865-47ba-8504-8694493f128f', 'temporal_coverage_notes_textarea', 0, 'Additional Information', 'textarea', '{}', '{"rows":10,"cols":80}', '[]','[]',  False);
INSERT INTO input VALUES ('15a012d0-9b4b-4979-9fa9-81fac1600b09', 'spatial_horizontal_1', 0, 'undefined', 'bbox', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('15a012d0-9b4b-4979-9fa9-81fac1600b09', 'spatial_horizontal_2', 1, 'undefined', 'bbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('15a012d0-9b4b-4979-9fa9-81fac1600b09', 'spatial_horizontal_3', 2, 'undefined', 'bbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('0f640f21-37ec-4d04-af2c-da955ae98e12', 'spatial_vertical_answer', 0, 'Has Vertical Dimension', 'radio', '["Yes","No"]', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('a3701d37-77cf-4ccc-8068-c6860a7a8929', 'spatial_vertical_details_upper', 0, 'Upper Amount', 'number', '{}', '{"min": "1"}', '[]','[]',  False);
INSERT INTO input VALUES ('a3701d37-77cf-4ccc-8068-c6860a7a8929', 'spatial_vertical_details_upper_units', 1, 'Units', 'radio', '["km","m","feet","miles","mb","Pa","hPa","Varies"]', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('a3701d37-77cf-4ccc-8068-c6860a7a8929', 'spatial_vertical_details_lower', 2, 'Lower Amount', 'number', '{}', '{"min": "1"}', '[]','[]',  False);
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
INSERT INTO input VALUES ('40672516-2220-4edc-8c1b-fd9f7e0b979e', 'data_product_number_of_files', 0, 'Files', 'number', '{}', '{"min": "1"}', '[]','[]',  True);
INSERT INTO input VALUES ('f2d8ab9d-0959-41b8-8449-430986ddfe84', 'browse_images_provided', 0, 'Images', 'radio', '["Yes","No"]', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('f2d8ab9d-0959-41b8-8449-430986ddfe84', 'browse_images_other', 1, 'Additional information about browse images', 'text', '{}', '{}', '[]','[]',  False);
