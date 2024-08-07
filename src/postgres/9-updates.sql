RAISE;
-- This file is used to update existing DBs. If you are deploying from scratch,
-- this file will error out; however, this won't be an issue because all lines of
-- this file should be captured in 7-seed.sql


-- EXAMPLES
-- Create table if not exists:
--     CREATE TABLE IF NOT EXISTS table_name (column_name data_type column_constraint, table_constraint);
-- Add column with default value:
--     ALTER TABLE table_name ADD column_name data_type DEFAULT default_value;
-- Add primary key constraint:
--     ALTER TABLE table_name ADD PRIMARY KEY (key_name);
-- Add unique constraint:
--     ALTER TABLE table_name ADD UNIQUE (unique_column_one, unique_column_two);
-- Add foreign key constraint:
--     ALTER TABLE table_name ADD CONSTRAINT foreign_key_name FOREIGN KEY (column_name) REFERENCES table_name (column_name);
-- Update db content
--     UPDATE table_name SET column_name = 'value' WHERE condition;
-- Simple addition to db seed
--     INSERT INTO table_name (column_name) VALUES ('actual_value')
-- Delete row from table:
---    DELETE FROM table_name WHERE column_name = 'actual_value';
-- Delete column from table:
--     ALTER TABLE table_name DROP COLUMN column_name;
-- Delete primary key constraint
--     ALTER TABLE table_name DROP CONSTRAINT table_name_pkey;
-- Delete foreign key contstraint
--     ALTER TABLE table_name DROP CONSTRAINT foreign_key_name;
-- Delete duplicate rows
--     DELETE FROM
--       table_name a USING (
--         SELECT
--           MIN(ctid) as ctid,
--           column_name
--         FROM
--           table_name
--         GROUP BY
--           column_name
--         HAVING
--           COUNT(*) > 1
--       ) b
--     WHERE
--       a.column_name = b.column_name
--       AND a.ctid <> b.ctid
-------------------------------------------------------------------------------

--12/16/2022 adds requirement for each user to have a unique email
--this should not be run until after the db's have been cleaned of duplicate entries as document in the closing of EDPUB-785
--ALTER TABLE edpuser
--ADD CONSTRAINT email_unique UNIQUE (email);

-- 12/21/2023 Added Additional Acknowledgement Extended Question for NSIDC
INSERT INTO question(id, short_name, version, long_name, text, help, required, daac_ids) VALUES ('d3c4f81e-1954-4b6f-9edf-90f240f525a8', 'acknowledgement', 1, 'Additional Acknowledgments', 'If there are people or groups who are not identified in the Data Citation but whose contributions to the data product should be acknowledged, please name them here.', 'The DAAC will work with you to add this information to an Acknowledgements section of the data product user guide.', False, '{"aec3724f-b30b-4b3f-9b9a-e0907d9d14b3"}');
INSERT INTO section_question VALUES ('768a6b51-4864-458c-b20d-fb8b4c7dc606', 'd3c4f81e-1954-4b6f-9edf-90f240f525a8', 4, '[]', '[]');
UPDATE section_question set list_order=5 where question_id = '2dd6c8b1-22a8-4866-91c3-da9b4ce849dc' and section_id='768a6b51-4864-458c-b20d-fb8b4c7dc606';
INSERT INTO input VALUES ('d3c4f81e-1954-4b6f-9edf-90f240f525a8', 'acknowledgement', 0, 'Acknowledgement', 'text', '{}', '{}', '[]', '[]');

--1/3/2014 add in permission for daac data manager to initialize requests
INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'REQUEST_INITIALIZE');

--1/19/2024 adds tables for metrics tracking
CREATE TABLE IF NOT EXISTS submission_metrics (
  id UUID NOT NULL,
  referral_origin UUID,
  accession_rejected BOOLEAN,
  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES submission (id),
  FOREIGN KEY (referral_origin) REFERENCES daac (id)
);

CREATE TABLE IF NOT EXISTS step_metrics (
  step_name VARCHAR NOT NULL,
  submission_id UUID NOT NULL,
  workflow_id UUID NOT NULL,
  start_time TIMESTAMP NOT NULL DEFAULT NOW(),
  complete_time TIMESTAMP,
  PRIMARY KEY (step_name, submission_id),
  FOREIGN KEY (step_name) REFERENCES step (step_name),
  FOREIGN KEY (submission_id) REFERENCES submission (id),
  FOREIGN KEY (workflow_id) REFERENCES workflow (id)
);

-- 2/14/2024 Add in PO DAAC Default Workflow
INSERT INTO workflow VALUES ('a5a14d98-df13-47f2-b86b-1504c7d4360d', 'podaac_default_workflow', 1, 'PO DAAC Default Workflow', 'This is the default workflow for PO DAAC.');
INSERT INTO step(step_id, step_name, type, data) VALUES ('a5a14d98-df13-47f2-b86b-1504c7d4360d', 'export_metadata', 'action', '{"rollback":"data_publication_request_form_review","type": "review", "form_id":"19025579-99ca-4344-8610-704dae626343"}');
INSERT INTO step_edge VALUES ('a5a14d98-df13-47f2-b86b-1504c7d4360d', 'init', 'data_accession_request_form');
INSERT INTO step_edge VALUES ('a5a14d98-df13-47f2-b86b-1504c7d4360d', 'data_accession_request_form', 'data_accession_request_form_review');
INSERT INTO step_edge VALUES ('a5a14d98-df13-47f2-b86b-1504c7d4360d', 'data_accession_request_form_review', 'data_publication_request_form');
INSERT INTO step_edge VALUES ('a5a14d98-df13-47f2-b86b-1504c7d4360d', 'data_publication_request_form', 'data_publication_request_form_review');
INSERT INTO step_edge VALUES ('a5a14d98-df13-47f2-b86b-1504c7d4360d', 'data_publication_request_form_review', 'export_metadata');
INSERT INTO step_edge VALUES ('a5a14d98-df13-47f2-b86b-1504c7d4360d', 'export_metadata', 'close');

UPDATE daac SET hidden=false, workflow_id='a5a14d98-df13-47f2-b86b-1504c7d4360d' WHERE id='6b3ea184-57c5-4fc5-a91b-e49708f91b67';
update input SET label='Full Name' WHERE label='First and Last Name';

-- 2/18/2024 Update all endpoint to use permissions not roles for access
INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'QUESTION_READ');
INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'QUESTION_READ');

--3/12/2024 Adding unknown daac workflow
INSERT INTO workflow VALUES ('3335970e-8a9b-481b-85b7-dfaaa3f5dbd9', 'unknown_workflow', 1, 'Unknown DAAC Workflow', 'This is the default workflow for unknown DAACs.');

INSERT INTO step_edge VALUES ('3335970e-8a9b-481b-85b7-dfaaa3f5dbd9', 'init', 'data_accession_request_form');
INSERT INTO step_edge VALUES ('3335970e-8a9b-481b-85b7-dfaaa3f5dbd9', 'data_accession_request_form', 'data_accession_request_form_review');
INSERT INTO step_edge VALUES ('3335970e-8a9b-481b-85b7-dfaaa3f5dbd9', 'data_accession_request_form_review', 'assign_a_workflow');

UPDATE daac SET workflow_id = '3335970e-8a9b-481b-85b7-dfaaa3f5dbd9', edpgroup_id ='5be24b44-d66b-4396-9266-a9d066000d9e' WHERE id= '1c36f0b9-b7fd-481b-9cab-3bc3cea35413';

--4/15/2024 Updating Upload Questions
UPDATE question SET text = 'Are there any existing documents that you would like to have included in the review of your data product? If "Yes", please upload the document(s).', help = 'For example, these documents may include descriptions of the variables, filename conventions, processing steps, and/or data quality. If you have more than 5 documents, please contact the DAAC for assistance. Files must be less than 5 GB and cannot include .exe or .dll extensions.' WHERE id = 'ad568b2f-89fe-4afd-a0bf-9e5832b71ce9';
UPDATE question SET text = 'Please upload a sample file(s).', help = 'Providing sample data files that are representative of the range of data within this data product will help the DAAC understand and provide feedback on the data format, structure, and content. If more than 5 sample data files are necessary to represent the data product, please contact the DAAC for assistance.  Files must be less than 5 GB and cannot include .exe or .dll extensions.', required = True WHERE id = '53a0faa7-f7d4-4ce9-a9dc-a13cef44e1f3';
UPDATE input SET list_order=1, label= 'Alternatively provide a URL to the document(s)'  WHERE question_id = 'ad568b2f-89fe-4afd-a0bf-9e5832b71ce9' and control_id = 'data_product_documentation_url';
UPDATE input SET list_order=1, label= 'Alternatively provide a URL to a sample file(s)' WHERE question_id = '53a0faa7-f7d4-4ce9-a9dc-a13cef44e1f3' and control_id = 'example_file_url';
INSERT INTO input VALUES ('ad568b2f-89fe-4afd-a0bf-9e5832b71ce9', 'data_product_documentation', 0, '', 'file', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('53a0faa7-f7d4-4ce9-a9dc-a13cef44e1f3', 'example_files', 0, '', 'file', '{}', '{}', '[]','[]',  False);

--4/18/2024 Adding management approval step to GES DISC workflow
INSERT INTO privilege VALUES ('REQUEST_REVIEW_MANAGER');
INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'REQUEST_REVIEW_MANAGER');
INSERT INTO step(step_id, step_name, type, data) VALUES ('e62e9548-b350-40ec-b1bc-21a75e5f0407', 'data_publication_request_form_management_review', 'review', '{"rollback":"data_publication_request_form_review","type": "review","form_id":"19025579-99ca-4344-8610-704dae626343"}');
INSERT INTO step_edge VALUES ('7843dc6d-f56d-488a-9193-bb7c0dc3696d', 'data_publication_request_form_management_review', 'data_publication_request_form_uwg_review');

UPDATE step SET data = '{"rollback":"data_publication_request_form_management_review","type": "review","form_id":"19025579-99ca-4344-8610-704dae626343"}' WHERE step_id = 'c81066db-0566-428d-87e8-94169ce5a9b9';
UPDATE step_edge SET next_step_name = 'data_publication_request_form_management_review' WHERE workflow_id = '7843dc6d-f56d-488a-9193-bb7c0dc3696d' AND step_name = 'data_publication_request_form_review';

-- 4/22/2024 Adding new previlage REQUEST_REVIEW_MANAGER for the Daac manager task EDPUB-1263
INSERT INTO privilege VALUES ('REQUEST_REVIEW_MANAGER');
INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'REQUEST_REVIEW_MANAGER');

-- Task EDPUB-1244
-- Update existing records to reflect changes for mapping to MMT
UPDATE action SET short_name = 'send_to_mmt', long_name = 'Send To MMT Action', description = 'This action is used to send collection metadata from EDPub to MMT.', source = 'sendToMMT.js' WHERE id = '3fe93672-cd91-45d4-863b-c6d0d63f8c8c';

ALTER TABLE step DISABLE TRIGGER ALL;

UPDATE step
SET step_name = 'map_to_mmt'
WHERE step_name = 'map_to_meditor';

UPDATE step
SET step_name = 'start_mmt_editing',
    data = '{"rollback":"send_to_mmt","type": "action"}'
WHERE step_name = 'start_meditor_editing';

UPDATE step
SET step_name = 'complete_mmt_editing',
    data = '{"rollback":"start_mmt_editing","type": "action"}'
WHERE step_name = 'complete_meditor_editing';

UPDATE step
SET step_name = 'get_from_mmt',
    data = '{"rollback":"complete_mmt_editing","type": "action"}'
WHERE step_name = 'get_from_meditor';

UPDATE step
SET step_name = 'map_from_mmt',
    data = '{"rollback":"get_from_mmt","type": "action"}'
WHERE step_name = 'map_from_meditor';

UPDATE step
SET data = '{"rollback":"map_from_mmt","type": "action"}'
WHERE step_name = 'publish_to_cmr';

UPDATE step
SET step_name = 'send_to_mmt'
WHERE action_id = '3fe93672-cd91-45d4-863b-c6d0d63f8c8c';

UPDATE step
SET step_name = 'edit_metadata_in_mmt_after_publication_form_review',
    data = '{"rollback":"send_to_mmt_after_publication_form_review","type": "action"}'
WHERE step_id = 'd1cbc4a8-ce4c-4734-8e71-a824d30c401a';

UPDATE step
SET step_name = 'send_to_mmt_after_publication_form_review'
WHERE step_id = 'c628d63b-93b9-45ae-8e7b-a903554b6726';

ALTER TABLE step ENABLE TRIGGER ALL;

-- StepEdge(workflow_id, step_name, next_step_name)
UPDATE step_edge
SET next_step_name = 'map_to_mmt'
WHERE step_name = 'complete_qa' and workflow_id = 'c1690729-b67e-4675-a1a5-b2323f347dff';

UPDATE step_edge
SET step_name = 'map_to_mmt', next_step_name= 'send_to_mmt'
WHERE step_name = 'map_to_meditor' and next_step_name = 'send_to_meditor' and workflow_id = 'c1690729-b67e-4675-a1a5-b2323f347dff';

UPDATE step_edge
SET step_name = 'send_to_mmt', next_step_name= 'start_mmt_editing'
WHERE step_name = 'send_to_meditor' and next_step_name = 'start_meditor_editing' and workflow_id = 'c1690729-b67e-4675-a1a5-b2323f347dff';

UPDATE step_edge
SET step_name = 'start_mmt_editing', next_step_name= 'complete_mmt_editing'
WHERE step_name = 'start_meditor_editing' and next_step_name = 'complete_meditor_editing' and workflow_id = 'c1690729-b67e-4675-a1a5-b2323f347dff';

UPDATE step_edge
SET step_name = 'complete_mmt_editing', next_step_name= 'get_from_mmt'
WHERE step_name = 'complete_meditor_editing' and next_step_name = 'get_from_meditor' and workflow_id = 'c1690729-b67e-4675-a1a5-b2323f347dff';

UPDATE step_edge
SET step_name = 'get_from_mmt', next_step_name= 'map_from_mmt'
WHERE step_name = 'get_from_meditor' and next_step_name = 'map_from_meditor' and workflow_id = 'c1690729-b67e-4675-a1a5-b2323f347dff';

UPDATE step_edge
SET step_name = 'map_from_mmt'
WHERE step_name = 'map_from_meditor' and workflow_id = 'c1690729-b67e-4675-a1a5-b2323f347dff';

-- step(step_status_label)
-- Adding step status label in uwg_review step gesdisc workflow 

ALTER TABLE step ADD step_status_label VARCHAR;
UPDATE step SET step_status_label='Pending UWG Review' WHERE step_id='c81066db-0566-428d-87e8-94169ce5a9b9';

-- EDPUB-1262 update datetimepicker
UPDATE Input
SET label = 'Start Date and Time (UTC)', type = 'datetimePicker'
WHERE question_id = '4f2dd369-d865-47ba-8504-8694493f129f' AND control_id = 'product_temporal_coverage_start';

UPDATE Input
SET label = 'End Date and Time (UTC)', type = 'datetimePicker'
WHERE question_id = '4f2dd369-d865-47ba-8504-8694493f129f' AND control_id = 'product_temporal_coverage_end';

--4/23/2024 Adding UWG member as a role
INSERT INTO edprole VALUES ('19ac227b-e96c-46fa-a378-cf82c461b669', 'uwg_member', 'UWG Member', 'A member of the User Working Group who can review requests in Earthdata Pub.');
INSERT INTO edprole_privilege VALUES ('19ac227b-e96c-46fa-a378-cf82c461b669', 'REQUEST_READ');
INSERT INTO edprole_privilege VALUES ('19ac227b-e96c-46fa-a378-cf82c461b669', 'REQUEST_REVIEW');
INSERT INTO edprole_privilege VALUES ('19ac227b-e96c-46fa-a378-cf82c461b669', 'NOTE_NEW');
INSERT INTO edprole_privilege VALUES ('19ac227b-e96c-46fa-a378-cf82c461b669', 'NOTE_REPLY');
INSERT INTO edprole_privilege VALUES ('19ac227b-e96c-46fa-a378-cf82c461b669', 'NOTE_ADDUSER');

-- 5/1/2024 Adding new table for limiting note visability by user/role task EDPUB-1255
CREATE TABLE IF NOT EXISTS note_scope (
  note_id UUID NOT NULL,
  user_ids UUID[],
  edprole_ids UUID[],
  PRIMARY KEY (note_id),
  FOREIGN KEY (note_id) REFERENCES note (id)
);

--4/23/2024 Fixing daac data manager permissions
INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'METRICS_READ');

-- 5/21/2024 Updating Permissions for Adding/Removing Users to Notes
INSERT INTO privilege VALUES ('NOTE_REMOVEUSER');
INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'NOTE_REMOVEUSER');
INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'NOTE_ADDUSER');
INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'NOTE_REMOVEUSER');

-- GESDISC EXTENDED
INSERT INTO question(id, short_name, version, long_name, text, help, required, daac_ids) VALUES ('e67b0087-9102-476f-846b-8bc22d16bcc0', 'archived_elsewhere', 1, 'Previously Archived', 'Might this data already be or will be archived anywhere else (other than GES DISC)?', '', False, '{"1ea1da68-cb95-431f-8dd8-a2cf16d7ef98"}');

INSERT INTO input VALUES ('e67b0087-9102-476f-846b-8bc22d16bcc0', 'previously_archived', 0, '', 'text', '{}', '{}', '[]', '[]', True);

INSERT INTO question(id, short_name, version, long_name, text, help, required, daac_ids) VALUES ('1509d216-d3c5-437a-83f6-3a56a3403851', 'relationship_to_data', 1, 'Relation to Data', 'What is this dataset''s relationship to other ESDIS-held data or other publicly available data? If there is a relationship to other data, what is the URL link to that data collection?', '', False, '{"1ea1da68-cb95-431f-8dd8-a2cf16d7ef98"}');

INSERT INTO input VALUES ('1509d216-d3c5-437a-83f6-3a56a3403851', 'data_relationship', 0, '', 'text', '{}', '{}', '[]', '[]', True);

INSERT INTO question(id, short_name, version, long_name, text, help, required, daac_ids) VALUES ('068afe4e-228a-4170-aea8-0475d8b10d5e', 'data_history', 1, 'Provenance', 'What is the provenance of the product?', '(i.e. - history, related science teams or application groups, etc.)', False, '{"1ea1da68-cb95-431f-8dd8-a2cf16d7ef98"}');

INSERT INTO input VALUES ('068afe4e-228a-4170-aea8-0475d8b10d5e', 'data_history_provenance', 0, '', 'text', '{}', '{}', '[]', '[]', True);

INSERT INTO question(id, short_name, version, long_name, text, help, required, daac_ids) VALUES ('225a1c2a-e4e5-4264-902d-ba55f56ac7db', 'data_product_proposal', 1, 'Data Product Proposal', 'Existing Publication(s) on the Data Product?', 'Please list the publisher and title of any publication(s) that describe the genesis (or algorithm) and validation of the data product. If there are no publications, consider listing the data product proposal here.', False, '{"1ea1da68-cb95-431f-8dd8-a2cf16d7ef98"}');

INSERT INTO input VALUES ('225a1c2a-e4e5-4264-902d-ba55f56ac7db', 'existing_publications_proposal', 0, '', 'text', '{}', '{}', '[]', '[]', True);

INSERT INTO question(id, short_name, version, long_name, text, help, required, daac_ids) VALUES ('e0018b76-fef9-42c9-84d0-b74131523646', 'gridded_product', 1, 'Gridded Product', '', 'Please indicate if this a gridded or non-gridded data product.', False, '{"1ea1da68-cb95-431f-8dd8-a2cf16d7ef98"}');

INSERT INTO input VALUES ('e0018b76-fef9-42c9-84d0-b74131523646', 'gridded_data_product', 0, '', 'radio', '["Yes","No","Other"]', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('e0018b76-fef9-42c9-84d0-b74131523646', 'gridded_data_product_explanation', 1, 'If "Other", please specify.', 'text', '{}', '{}', '[{"field": "gridded_data_product","value": "Other"}]','[]',  False);

INSERT INTO question(id, short_name, version, long_name, text, help, required, daac_ids) VALUES ('a6787163-f214-49e8-a4eb-32da45ac21d7', 'science_focus', 1, 'Discipline', '', 'Please select one of the following NASA Earth Science Focus Areas.', False, '{"1ea1da68-cb95-431f-8dd8-a2cf16d7ef98"}');

INSERT INTO input VALUES ('a6787163-f214-49e8-a4eb-32da45ac21d7', 'science_focus_areas', 0, '', 'radio', '["Atmospheric Composition","Weather","Climate Variability and Change","Water and Energy Cycle","Carbon Cycle and Ecosystems","Earth Surface","Other"]', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('a6787163-f214-49e8-a4eb-32da45ac21d7', 'science_focus_areas_explanation', 1, 'If "Other", please specify.', 'text', '{}', '{}', '[{"field": "science_focus_areas","value": "Other"}]','[]',  False);

INSERT INTO question(id, short_name, version, long_name, text, help, required, daac_ids) VALUES ('5ab48392-c0fd-4285-8550-368f9df60092', 'future_data', 1, 'Future Data', 'Are you considering submitting a request to archive another similar data product in the future at the GES DISC?', '', False, '{"1ea1da68-cb95-431f-8dd8-a2cf16d7ef98"}');

INSERT INTO input VALUES ('5ab48392-c0fd-4285-8550-368f9df60092', 'future_data_request', 0, '', 'radio', '["Yes","No","Other"]', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('5ab48392-c0fd-4285-8550-368f9df60092', 'future_data_request_explanation', 1, 'If "Other", please specify.', 'text', '{}', '{}', '[{"field": "future_data_request","value": "Other"}]','[]',  False);

INSERT INTO question(id, short_name, version, long_name, text, help, required, daac_ids) VALUES ('b840820a-2d49-414b-b7d8-27217843904a', 'monthly_metrics', 1, 'Monthly Metrics', 'Would you like monthly data distribution metrics?', '', False, '{"1ea1da68-cb95-431f-8dd8-a2cf16d7ef98"}');

INSERT INTO input VALUES ('b840820a-2d49-414b-b7d8-27217843904a', 'monthly_metrics_request', 0, '', 'radio', '["Yes","No"]', '{}', '[]','[]',  True);

INSERT INTO question(id, short_name, version, long_name, text, help, required, daac_ids) VALUES ('8c331721-541c-45a4-b95a-4b9b4557eae2', 'data_service_request', 1, 'Data Service Request', 'The GES DISC offers "Basic Services" for all our Community Data Products, which includes DOI registration and HTTPS access.', 'Please visit <a href="https://www.earthdata.nasa.gov/engage/new-missions/level-of-service" target=_blank>https://www.earthdata.nasa.gov/engage/new-missions/level-of-service <i class="fas fa-external-link-alt"></i></a> for more information.<br><br>However, if GES DISC''s resources allow, which additional data services you would like to have for your product, and why?', False, '{"1ea1da68-cb95-431f-8dd8-a2cf16d7ef98"}');

INSERT INTO input VALUES ('8c331721-541c-45a4-b95a-4b9b4557eae2', 'data_service_request_basic', 0, 'Basic Services', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('8c331721-541c-45a4-b95a-4b9b4557eae2', 'data_service_request_other', 1, 'Other', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('8c331721-541c-45a4-b95a-4b9b4557eae2', 'data_service_request_other_text', 2, 'If "Other" please describe.', 'text', '{}', '{}', '[{"field":"data_service_request_other","value":"true","message":"If ''Other'' please describe."}]','[]',  False);

-- SectionQuestion(section_id, question_id, list_order, required_if, show_if))
INSERT INTO section_question VALUES ('e169a5b4-da2e-4893-9481-1b9351cd9707', 'e67b0087-9102-476f-846b-8bc22d16bcc0', 3, '[]', '[]');
INSERT INTO section_question VALUES ('768a6b51-4864-458c-b20d-fb8b4c7dc606', '1509d216-d3c5-437a-83f6-3a56a3403851', 6, '[]', '[]');
INSERT INTO section_question VALUES ('768a6b51-4864-458c-b20d-fb8b4c7dc606', '068afe4e-228a-4170-aea8-0475d8b10d5e', 7, '[]', '[]');
INSERT INTO section_question VALUES ('768a6b51-4864-458c-b20d-fb8b4c7dc606', '225a1c2a-e4e5-4264-902d-ba55f56ac7db', 8, '[]', '[]');
INSERT INTO section_question VALUES ('b0934ecc-1aa1-4e07-9cbc-f1299126aee0', 'e0018b76-fef9-42c9-84d0-b74131523646', 11, '[]', '[]');
INSERT INTO section_question VALUES ('b0934ecc-1aa1-4e07-9cbc-f1299126aee0', 'a6787163-f214-49e8-a4eb-32da45ac21d7', 12, '[]', '[]');
INSERT INTO section_question VALUES ('b0934ecc-1aa1-4e07-9cbc-f1299126aee0', '5ab48392-c0fd-4285-8550-368f9df60092', 13, '[]', '[]');
INSERT INTO section_question VALUES ('b0934ecc-1aa1-4e07-9cbc-f1299126aee0', 'b840820a-2d49-414b-b7d8-27217843904a', 14, '[]', '[]');
INSERT INTO section_question VALUES ('b0934ecc-1aa1-4e07-9cbc-f1299126aee0', '8c331721-541c-45a4-b95a-4b9b4557eae2', 15, '[]', '[]');
-- END GESDISC EXTENDED

--EDPUB-1258 Create review requirements tracking on the backend
INSERT INTO privilege VALUES ('CREATE_STEPREVIEW');
INSERT INTO privilege VALUES ('REMOVE_STEPREVIEW');

INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'CREATE_STEPREVIEW');
INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'REMOVE_STEPREVIEW');

INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'CREATE_STEPREVIEW');
INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'REMOVE_STEPREVIEW');

-- Create a custom ENUM type
CREATE TYPE review_status AS ENUM ('rejected', 'approved', 'review_required');

-- Create the table using the custom ENUM type
CREATE TABLE IF NOT EXISTS step_review (
  step_name VARCHAR NOT NULL,
  submission_id UUID NOT NULL,
  edpuser_id UUID NOT NULL,
  user_review_status review_status,
  submitted_by UUID NOT NULL,
  PRIMARY KEY (step_name, submission_id, edpuser_id),
  FOREIGN KEY (step_name) REFERENCES step (step_name),
  FOREIGN KEY (submission_id) REFERENCES submission (id),
  FOREIGN KEY (edpuser_id) REFERENCES edpuser (id),
  FOREIGN KEY (submitted_by) REFERENCES edpuser (id)
);

-- 5/23/2024 Removing Data producer POC
UPDATE edpuser_edprole
SET edprole_id = '804b335c-f191-4d26-9b98-1ec1cb62b97d'
WHERE edprole_id = '29ccab4b-65e2-4764-83ec-77375d29af39';

delete from edprole_privilege where edprole_id='29ccab4b-65e2-4764-83ec-77375d29af39';
delete from edprole where id='29ccab4b-65e2-4764-83ec-77375d29af39'

--6/10/2024 Move management review step after UWG review step in GES DISC community workflow

UPDATE step SET data='{"rollback":"data_publication_request_form_review","type": "review","form_id":"19025579-99ca-4344-8610-704dae626343"}' WHERE step_id='c81066db-0566-428d-87e8-94169ce5a9b9';
UPDATE step SET data='{"rollback":"data_publication_request_form_uwg_review","type": "review","form_id":"19025579-99ca-4344-8610-704dae626343"}' WHERE step_id='e62e9548-b350-40ec-b1bc-21a75e5f0407';
UPDATE step SET data='{"rollback":"data_publication_request_form_management_review","type": "review","form_id":"19025579-99ca-4344-8610-704dae626343"}' WHERE step_id='7838ed18-4ecd-499e-9a47-91fd181cbfc7';

-- INSERT INTO step_edge VALUES ('7843dc6d-f56d-488a-9193-bb7c0dc3696d', 'data_publication_request_form_review', 'data_publication_request_form_uwg_review');
UPDATE step_edge SET next_step_name='data_publication_request_form_uwg_review' WHERE workflow_id='7843dc6d-f56d-488a-9193-bb7c0dc3696d' AND step_name='data_publication_request_form_review';
-- INSERT INTO step_edge VALUES ('7843dc6d-f56d-488a-9193-bb7c0dc3696d', 'data_publication_request_form_uwg_review', 'data_publication_request_form_management_review');
UPDATE step_edge SET next_step_name='data_publication_request_form_management_review' WHERE workflow_id='7843dc6d-f56d-488a-9193-bb7c0dc3696d' AND step_name='data_publication_request_form_uwg_review';
-- INSERT INTO step_edge VALUES ('7843dc6d-f56d-488a-9193-bb7c0dc3696d', 'data_publication_request_form_management_review', 'data_publication_request_form_esdis_review');
UPDATE step_edge SET next_step_name='data_publication_request_form_esdis_review' WHERE workflow_id='7843dc6d-f56d-488a-9193-bb7c0dc3696d' AND step_name='data_publication_request_form_management_review';
--06/07/2024 adding push metadata to GES DISC endpoint
INSERT INTO action VALUES ('09293035-2d31-44d3-a6b0-675f10dc34bf', 'push_metadata_to_gesdisc', 1, 'Push Metadata to GES DISC Endpoint', 'This action is used to push metadata to the GES DISC meditor instance', 'pushMetadataToGesdisc.js');

INSERT INTO step(step_id, step_name, type, action_id, data) VALUES ('a9c55c56-8fd7-4bd1-89aa-0cf9e28da07e', 'send_metadata_to_ges_disc', 'action', '09293035-2d31-44d3-a6b0-675f10dc34bf', '{"rollback":"data_publication_request_form_review","type": "review","form_id":"19025579-99ca-4344-8610-704dae626343"}');

DELETE FROM step_edge
WHERE workflow_id = '7843dc6d-f56d-488a-9193-bb7c0dc3696d' 
AND step_name = 'data_publication_request_form_review' 
AND next_step_name = 'data_publication_request_form_management_review';

INSERT INTO step_edge VALUES ('7843dc6d-f56d-488a-9193-bb7c0dc3696d', 'data_publication_request_form_review', 'map_question_response_to_ummc');
INSERT INTO step_edge VALUES ('7843dc6d-f56d-488a-9193-bb7c0dc3696d', 'map_question_response_to_ummc', 'send_metadata_to_ges_disc');
INSERT INTO step_edge VALUES ('7843dc6d-f56d-488a-9193-bb7c0dc3696d', 'send_metadata_to_ges_disc', 'data_publication_request_form_management_review');

-- EDPUB-1273 Enable use of name field and add a new data producer field
ALTER TABLE submission
ADD COLUMN data_producer_name VARCHAR;

UPDATE submission
SET 
  name = data_pool.data->>'data_product_name_value',
  data_producer_name = data_pool.data->>'data_producer_info_name'
FROM submission_form_data_pool AS data_pool
WHERE submission.id = data_pool.id
AND data_pool.data ? 'data_product_name_value'
AND data_pool.data ? 'data_producer_info_name';

-- EDPUB-1286 06/24/24 Update GES DISC requested Free Text Fields
UPDATE input
SET type = 'textarea'
WHERE question_id = '228cb0d6-78fb-449a-8061-b1e6fb3f59d1' and control_id = 'spatial_general_region';

UPDATE input
SET type = 'textarea'
WHERE question_id = '91577abc-a59c-40f7-b0e6-f954542e6b19' and control_id = 'spatial_data_file';

UPDATE input
SET type = 'textarea'
WHERE question_id = 'a12ccd39-1d94-46a5-8aad-3587fd50c4ad' and control_id = 'spatial_resolution';

UPDATE input
SET type = 'textarea'
WHERE question_id = 'fbd25b6f-2731-4456-882b-ef840c11b671' and control_id = 'variables_text';

--6/24/24 updating ges disc workflows
INSERT INTO workflow VALUES ('ca34ea28-07f8-4edf-a73a-d6ee8a86f1c7', 'gesdisc_push_workflow', 1, 'GES DISC Push Workflow', 'This is a workflow for testing the push to gesdisc action.');

-- Update community workflow
DELETE FROM step_edge WHERE workflow_id='7843dc6d-f56d-488a-9193-bb7c0dc3696d';
INSERT INTO step_edge VALUES ('7843dc6d-f56d-488a-9193-bb7c0dc3696d', 'init', 'data_publication_request_form');
INSERT INTO step_edge VALUES ('7843dc6d-f56d-488a-9193-bb7c0dc3696d', 'data_publication_request_form', 'data_publication_request_form_review');
INSERT INTO step_edge VALUES ('7843dc6d-f56d-488a-9193-bb7c0dc3696d', 'data_publication_request_form_review', 'data_publication_request_form_uwg_review');
INSERT INTO step_edge VALUES ('7843dc6d-f56d-488a-9193-bb7c0dc3696d', 'data_publication_request_form_uwg_review', 'data_publication_request_form_management_review');
INSERT INTO step_edge VALUES ('7843dc6d-f56d-488a-9193-bb7c0dc3696d', 'data_publication_request_form_management_review', 'data_publication_request_form_esdis_review');
INSERT INTO step_edge VALUES ('7843dc6d-f56d-488a-9193-bb7c0dc3696d', 'data_publication_request_form_esdis_review', 'close');

-- Add push to gesdisc workflow
INSERT INTO step_edge VALUES ('ca34ea28-07f8-4edf-a73a-d6ee8a86f1c7', 'init', 'data_accession_request_form');
INSERT INTO step_edge VALUES ('ca34ea28-07f8-4edf-a73a-d6ee8a86f1c7', 'data_accession_request_form', 'data_accession_request_form_review');
INSERT INTO step_edge VALUES ('ca34ea28-07f8-4edf-a73a-d6ee8a86f1c7', 'data_accession_request_form_review', 'data_publication_request_form');
INSERT INTO step_edge VALUES ('ca34ea28-07f8-4edf-a73a-d6ee8a86f1c7', 'data_publication_request_form', 'data_publication_request_form_review');
INSERT INTO step_edge VALUES ('ca34ea28-07f8-4edf-a73a-d6ee8a86f1c7', 'data_publication_request_form_review', 'map_question_response_to_ummc');
INSERT INTO step_edge VALUES ('ca34ea28-07f8-4edf-a73a-d6ee8a86f1c7', 'map_question_response_to_ummc', 'send_metadata_to_ges_disc');
INSERT INTO step_edge VALUES ('ca34ea28-07f8-4edf-a73a-d6ee8a86f1c7', 'send_metadata_to_ges_disc', 'close');

-- EDPUB 1331 - Example action for emailing DAAC Staff
INSERT INTO action VALUES ('50ed996d-22b7-4aa7-a88b-8c4b539fa5df', 'email_daac_staff', 1, 'Send Email to DAAC Staff', 'This action is used to send an email to all DAAC staff', 'emailDaacStaff.js');
INSERT INTO step(step_id, step_name, type, action_id, data) VALUES ('bbca687c-c6c5-45f6-b2e9-7f2c58a00a26', 'email_daac_staff', 'action', '50ed996d-22b7-4aa7-a88b-8c4b539fa5df', '{"rollback": "push_to_ornl_database_f2", "type": "action"}');
UPDATE step_edge
SET next_step_name = 'email_daac_staff'
WHERE workflow_id = 'a218f99d-cfc1-44e5-b203-3e447e1c1275' and step_name = 'push_to_ornl_database_f2';
INSERT INTO step_edge VALUES ('a218f99d-cfc1-44e5-b203-3e447e1c1275', 'email_daac_staff', 'close');
-- 7/25/24 Fix display of forms for GES DISC extended reviews
UPDATE step SET data='{"rollback":"data_publication_request_form_review","type": "form","form_id":"19025579-99ca-4344-8610-704dae626343"}' WHERE step_id='c81066db-0566-428d-87e8-94169ce5a9b9';
UPDATE step SET data='{"rollback":"data_publication_request_form_uwg_review","type": "form","form_id":"19025579-99ca-4344-8610-704dae626343"}' WHERE step_id='e62e9548-b350-40ec-b1bc-21a75e5f0407';
UPDATE step SET data='{"rollback":"data_publication_request_form_management_review","type": "form","form_id":"19025579-99ca-4344-8610-704dae626343"}' WHERE step_id='7838ed18-4ecd-499e-9a47-91fd181cbfc7';

-- 7/25/24 Update missing permissions
INSERT INTO privilege VALUES ('REQUEST_ADDUSER');
INSERT INTO privilege VALUES ('REQUEST_REMOVEUSER');
INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'REQUEST_ADDUSER');
INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'REQUEST_REMOVEUSER');
INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'REQUEST_ADDUSER');
INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'REQUEST_REMOVEUSER');

-- 07/30/24 EDPUB-1266 Remove Unused Privileges from EDPub API & Dashboard
DELETE FROM privilege WHERE privilege IN ('REQUEST_ADMINREAD', 'REQUEST_RESUME', 'REQUEST_APPLY', 'USER_ADDPERMISSION', 'USER_DELETE', 'GROUP_CREATE', 'GROUP_READ', 'GROUP_UPDATE', 'GROUP_DELETE', 'GROUP_ADDPERMISSION', 'ROLE_CREATE', 'ROLE_READ', 'ROLE_UPDATE', 'ROLE_DELETE', 'ROLE_ADDPRIVILEGE', 'DAAC_CREATE', 'DAAC_UPDATE', 'DAAC_DELETE', 'NOTE_ADDGROUP', 'QUESTION_CREATE', 'QUESTION_UPDATE', 'QUESTION_DELETE');

-- 7/25/24 Remove metadata mapping step
UPDATE step SET data='{"rollback":"data_publication_request_form_review","type": "review","form_id":"19025579-99ca-4344-8610-704dae626343"}' WHERE step_id='d278f01e-1ef7-4677-a350-73ccadeddc22';

DELETE FROM step_edge WHERE workflow_id='45e8d0e8-d8c9-47e1-85a2-5b5db6e34dd8' AND step_name='map_question_response_to_ummc' AND next_step_name='create_skeleton_dataset_record_in_mmt';
UPDATE step_edge SET next_step_name='create_skeleton_dataset_record_in_mmt' WHERE workflow_id='45e8d0e8-d8c9-47e1-85a2-5b5db6e34dd8' AND step_name='data_publication_request_form_review';

UPDATE step SET data='{"rollback": "data_accession_request_form_review", "type": "review"}' WHERE step_id='6445f44b-bcda-41b4-86e4-23761edc22bf';
UPDATE step SET data='{"rollback": "data_publication_request_form_review", "type": "review"}' WHERE step_id='4791d53b-6c8f-4d5b-9ee9-81cebd4c4b04';

DELETE FROM step_edge WHERE workflow_id='a218f99d-cfc1-44e5-b203-3e447e1c1275';
INSERT INTO step_edge VALUES ('a218f99d-cfc1-44e5-b203-3e447e1c1275', 'init', 'data_accession_request_form');
INSERT INTO step_edge VALUES ('a218f99d-cfc1-44e5-b203-3e447e1c1275', 'data_accession_request_form', 'data_accession_request_form_review');
INSERT INTO step_edge VALUES ('a218f99d-cfc1-44e5-b203-3e447e1c1275', 'data_accession_request_form_review', 'push_to_ornl_database_f1');
INSERT INTO step_edge VALUES ('a218f99d-cfc1-44e5-b203-3e447e1c1275', 'push_to_ornl_database_f1', 'data_publication_request_form');
INSERT INTO step_edge VALUES ('a218f99d-cfc1-44e5-b203-3e447e1c1275', 'data_publication_request_form', 'data_publication_request_form_review');
INSERT INTO step_edge VALUES ('a218f99d-cfc1-44e5-b203-3e447e1c1275', 'data_publication_request_form_review', 'push_to_ornl_database_f2');
INSERT INTO step_edge VALUES ('a218f99d-cfc1-44e5-b203-3e447e1c1275', 'push_to_ornl_database_f2', 'email_daac_staff');
INSERT INTO step_edge VALUES ('a218f99d-cfc1-44e5-b203-3e447e1c1275', 'email_daac_staff', 'close');
DELETE FROM step_metrics WHERE step_name='map_question_response_to_ummc_f1';
DELETE FROM step_metrics WHERE step_name='map_question_response_to_ummc_f2';
DELETE FROM note WHERE step_name='map_question_response_to_ummc_f1';
DELETE FROM note WHERE step_name='map_question_response_to_ummc_f2';
DELETE FROM step_review WHERE step_name='map_question_response_to_ummc_f1';
DELETE FROM step_review WHERE step_name='map_question_response_to_ummc_f2';
DELETE FROM step WHERE step_id='c6082cae-9c97-4692-b0da-c9334a30c9e0';
DELETE FROM step WHERE step_id='faf94cca-ea3e-4886-a306-4f7f5acfda1a';

DELETE FROM step_edge WHERE workflow_id='ca34ea28-07f8-4edf-a73a-d6ee8a86f1c7' AND step_name='map_question_response_to_ummc' AND next_step_name='send_metadata_to_ges_disc';
UPDATE step_edge SET next_step_name='send_metadata_to_ges_disc' WHERE workflow_id='ca34ea28-07f8-4edf-a73a-d6ee8a86f1c7' AND step_name='data_publication_request_form_review';

DELETE FROM step_edge WHERE workflow_id='a8d22c43-7814-4609-ac04-66fb50228bf7' AND step_name='map_question_response_to_ummc' AND next_step_name='email_asdc_staff';
UPDATE step_edge SET next_step_name='email_asdc_staff' WHERE workflow_id='a8d22c43-7814-4609-ac04-66fb50228bf7' AND step_name='confirmation_form';

DELETE FROM step_metrics WHERE step_name='map_question_response_to_ummc';
DELETE FROM note WHERE step_name='map_question_response_to_ummc';
DELETE FROM step_review WHERE step_name='map_question_response_to_ummc';

DELETE FROM step WHERE step_name='map_question_response_to_ummc';
DELETE FROM step WHERE step_id='d1cbc4a8-ce4c-4734-8e71-a824d30c401a';
DELETE FROM step WHERE step_id='c628d63b-93b9-45ae-8e7b-a903554b6726';

DELETE FROM submission_action_data WHERE action_id='f812eb99-7c4a-46a8-8d8f-30ae509fe21c';
DELETE FROM action WHERE id='f812eb99-7c4a-46a8-8d8f-30ae509fe21c';
