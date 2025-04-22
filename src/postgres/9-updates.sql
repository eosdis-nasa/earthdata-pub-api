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

-- 08/30/24 updates form table to include daac_only column for limiting a forms visability
ALTER TABLE form ADD daac_only BOOLEAN DEFAULT False;

-- 09/3/24 removes DAAC_READ privilege from Data Producer
DELETE FROM edprole_privilege WHERE edprole_id='804b335c-f191-4d26-9b98-1ec1cb62b97d' AND privilege='DAAC_READ';

-- 09/13/24 additions for showcasing daac_only forms in the ornl test workflow
INSERT INTO form(id, short_name, version, long_name, description, daac_only) VALUES ('3f77385f-7087-4d22-81c1-5c29b95d3295', 'ornl_submission', 1, 'ORNL Submission Form', 'This form is used by ORNL DAAC staff to enter pieces of information needed by the DAAC that the Data Provider will not have when submitting the Data Accession Request Form', true);
DELETE  FROM step_edge WHERE workflow_id = '0c1aa7d8-d45b-44ad-ab63-5bf6e40b2bce';
INSERT INTO section VALUES ('b1a965c8-9b35-40b7-83e5-a2acf3dde04c', '3f77385f-7087-4d22-81c1-5c29b95d3295', 'Submission Information', 0, '[]', '[]', NULL);
INSERT INTO question VALUES ('2a7c2760-acf2-498f-b63b-cae25ee0c71d', 'md_entry_id', 1, 'MD Entry ID', '', '');
INSERT INTO input VALUES ('2a7c2760-acf2-498f-b63b-cae25ee0c71d', 'md_entry_id', 0, '', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO section_question VALUES ('b1a965c8-9b35-40b7-83e5-a2acf3dde04c', '2a7c2760-acf2-498f-b63b-cae25ee0c71d', 0, '[]', '[]');
INSERT INTO step(step_id, step_name, type, form_id) VALUES ('37e41513-4c2c-49eb-9bb9-b7429a9de2d6', 'submission_form', 'form', '3f77385f-7087-4d22-81c1-5c29b95d3295');
INSERT INTO step_edge VALUES ('0c1aa7d8-d45b-44ad-ab63-5bf6e40b2bce', 'init', 'ornl_service_trigger');
INSERT INTO step_edge VALUES ('0c1aa7d8-d45b-44ad-ab63-5bf6e40b2bce', 'ornl_service_trigger', 'data_accession_request_form');
INSERT INTO step_edge VALUES ('0c1aa7d8-d45b-44ad-ab63-5bf6e40b2bce', 'data_accession_request_form', 'push_to_ornl_database_f1');
INSERT INTO step_edge VALUES ('0c1aa7d8-d45b-44ad-ab63-5bf6e40b2bce', 'push_to_ornl_database_f1', 'data_publication_request_form');
INSERT INTO step_edge VALUES ('0c1aa7d8-d45b-44ad-ab63-5bf6e40b2bce', 'data_publication_request_form', 'submission_form');
INSERT INTO step_edge VALUES ('0c1aa7d8-d45b-44ad-ab63-5bf6e40b2bce', 'submission_form', 'email_daac_staff');
INSERT INTO step_edge VALUES ('0c1aa7d8-d45b-44ad-ab63-5bf6e40b2bce', 'email_daac_staff', 'close');


-- 09/30/24 EDPUB-1384 Create Add Step API Endpoint
DELETE FROM edprole_privilege
WHERE edprole_id = 'a5b4947a-67d2-434e-9889-59c2fad39676'
AND privilege = 'WORKFLOW_CREATE';

INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'WORKFLOW_CREATE');

-- 10/15/24 EDPUB-1382 Update DAAC Observer Role
UPDATE edprole 
SET long_name = 'Observer'
WHERE id = '4be6ca4d-6362-478b-8478-487a668314b1';

INSERT INTO edprole_privilege VALUES ('4be6ca4d-6362-478b-8478-487a668314b1', 'REQUEST_DAACREAD');
INSERT INTO edprole_privilege VALUES ('4be6ca4d-6362-478b-8478-487a668314b1', 'REQUEST_REVIEW');
INSERT INTO edprole_privilege VALUES ('4be6ca4d-6362-478b-8478-487a668314b1', 'REQUEST_REASSIGN');
INSERT INTO edprole_privilege VALUES ('4be6ca4d-6362-478b-8478-487a668314b1', 'REQUEST_LOCK');
INSERT INTO edprole_privilege VALUES ('4be6ca4d-6362-478b-8478-487a668314b1', 'REQUEST_ADDUSER');
INSERT INTO edprole_privilege VALUES ('4be6ca4d-6362-478b-8478-487a668314b1', 'REQUEST_REMOVEUSER');
INSERT INTO edprole_privilege VALUES ('4be6ca4d-6362-478b-8478-487a668314b1', 'DAAC_READ');
INSERT INTO edprole_privilege VALUES ('4be6ca4d-6362-478b-8478-487a668314b1', 'METRICS_READ');
INSERT INTO edprole_privilege VALUES ('4be6ca4d-6362-478b-8478-487a668314b1', 'NOTE_NEW');
INSERT INTO edprole_privilege VALUES ('4be6ca4d-6362-478b-8478-487a668314b1', 'NOTE_REPLY');
INSERT INTO edprole_privilege VALUES ('4be6ca4d-6362-478b-8478-487a668314b1', 'NOTE_ADDUSER');
INSERT INTO edprole_privilege VALUES ('4be6ca4d-6362-478b-8478-487a668314b1', 'NOTE_REMOVEUSER');

-- 10/22/24 Add table for code generation
CREATE TABLE IF NOT EXISTS code (
  code UUID DEFAULT UUID_GENERATE_V4(),
  submission_id UUID NOT NULL,
  daac_id UUID NOT NULL,
  PRIMARY KEY (code),
  FOREIGN KEY (submission_id) REFERENCES submission (id),
  FOREIGN KEY (daac_id) REFERENCES daac (id),
  UNIQUE (submission_id, daac_id)
);

-- 10/28/24 EDPUB-1391: Create API Endpoint for adding a form
DELETE FROM edprole_privilege
WHERE privilege = 'FORM_CREATE' AND edprole_id IN ('a5b4947a-67d2-434e-9889-59c2fad39676', '804b335c-f191-4d26-9b98-1ec1cb62b97d');

DELETE FROM edprole_privilege
WHERE privilege = 'FORM_UPDATE' AND edprole_id IN ('a5b4947a-67d2-434e-9889-59c2fad39676', '804b335c-f191-4d26-9b98-1ec1cb62b97d');

-- The FORM_CREATE and FORM_UPDATE privilege should only be assigned to DAAC Data Managers.
INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'FORM_CREATE');

-- EDPUB-1412: Remove Confirmation Form from ASDC Workflow
DELETE FROM step_edge
WHERE workflow_id = 'a8d22c43-7814-4609-ac04-66fb50228bf7'
  AND step_name = 'confirmation_form'
  AND next_step_name = 'email_asdc_staff';

UPDATE step_edge
SET next_step_name = 'email_asdc_staff'
WHERE workflow_id = 'a8d22c43-7814-4609-ac04-66fb50228bf7'
  AND step_name = 'data_publication_request_form_review'
  AND next_step_name = 'confirmation_form';

-- 11/24/24 Remove confirmation form from repo
DELETE FROM step WHERE step_name='confirmation_form';
DELETE FROM input WHERE question_id='0be3cdbd-da86-4879-bf94-e6a07de7cfe1' AND control_id='collection_short_name';
DELETE FROM input WHERE question_id='38cdfe14-6861-4ada-bd70-0545f65eeb03' AND control_id='collection_version';
DELETE FROM section_question WHERE section_id='933da7a8-4db6-4b7b-b128-d815fe151d29';
DELETE FROM question WHERE id='0be3cdbd-da86-4879-bf94-e6a07de7cfe1';
DELETE FROM question WHERE id='38cdfe14-6861-4ada-bd70-0545f65eeb03';
DELETE FROM section WHERE id='933da7a8-4db6-4b7b-b128-d815fe151d29';
DELETE FROM submission_form_data WHERE form_id = 'de7e5c40-584a-493b-919d-8f7f3f1e9e3c';
DELETE FROM form WHERE id='de7e5c40-584a-493b-919d-8f7f3f1e9e3c';
-- EDPUB-1408: Documentation Added to DPR
UPDATE section_question SET list_order=7 WHERE section_id='768a6b51-4864-458c-b20d-fb8b4c7dc606' AND question_id='1509d216-d3c5-437a-83f6-3a56a3403851'; 
UPDATE section_question SET list_order=8 WHERE section_id='768a6b51-4864-458c-b20d-fb8b4c7dc606' AND question_id='068afe4e-228a-4170-aea8-0475d8b10d5e'; 
UPDATE section_question SET list_order=9 WHERE section_id='768a6b51-4864-458c-b20d-fb8b4c7dc606' AND question_id='225a1c2a-e4e5-4264-902d-ba55f56ac7db'; 
INSERT INTO section_question VALUES ('768a6b51-4864-458c-b20d-fb8b4c7dc606', 'ad568b2f-89fe-4afd-a0bf-9e5832b71ce9', 6, '[]', '[]');

-- 11/15/24 Add attachments column to notes and add default
ALTER TABLE note ADD attachments VARCHAR[] DEFAULT '{}';

-- 11/25/24 EDPUB-1375: Update DAAC specific workflows
UPDATE workflow SET short_name='accession_workflow', long_name='Accession Workflow', description='This is the default workflow for data accession.' WHERE id='3335970e-8a9b-481b-85b7-dfaaa3f5dbd9';

-- 12/9/24 Create accession_publication_code DB Association
CREATE TABLE IF NOT EXISTS publication_accession_association (
  publication_submission_id UUID NOT NULL,
  accession_submission_id UUID,
  code UUID NOT NULL,
  PRIMARY KEY (publication_submission_id),
  FOREIGN KEY (publication_submission_id) REFERENCES submission (id),
  FOREIGN KEY (accession_submission_id) REFERENCES submission (id),
  FOREIGN KEY (code) REFERENCES code (code)
);

CREATE OR REPLACE FUNCTION accession_workflow_id()
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
workflow_id UUID;
BEGIN
  SELECT workflow.id INTO workflow_id
  FROM workflow
  WHERE workflow.short_name = 'accession_workflow'
  ORDER BY workflow.version DESC
  LIMIT 1;
RETURN workflow_id;
END;
$$;

CREATE OR REPLACE FUNCTION init_submission()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
INSERT INTO submission_metadata(id)
  VALUES(NEW.id);
INSERT INTO submission_status(id, workflow_id, step_name)
  VALUES(NEW.id, COALESCE(daac_workflow_id(NEW.daac_id), accession_workflow_id()), 'init');
INSERT INTO submission_workflow(id, workflow_id)
  VALUES(NEW.id, COALESCE(daac_workflow_id(NEW.daac_id), accession_workflow_id()));
RETURN NEW;
END;
$$;

DROP FUNCTION init_workflow_id;

-- 12/09/24 EDPUB-1436 Create DAAC Backfill Publication Codes
ALTER TABLE code
ALTER COLUMN submission_id DROP NOT NULL;

-- Bulk insert daac_id to code table
INSERT INTO code (daac_id) VALUES 
('40397fe8-4841-4e4c-b84a-6ece359ff5ff'),
('c606afba-725b-4ae4-9557-1fd33260ae12'),
('d551380f-8813-40e4-9763-2a5bb6007cd0'),
('1ea1da68-cb95-431f-8dd8-a2cf16d7ef98'),
('ef229725-1cad-485e-a72b-a276d2ca3175'),
('9e0628f1-0dde-4ed2-b1e3-690c70326f25'),
('de6d5ec9-4728-4f2b-9d43-ae2f0fdac96a'),
('aec3724f-b30b-4b3f-9b9a-e0907d9d14b3'),
('fe75c306-ac04-4689-a702-073d9cb071fe'),
('15df4fda-ed0d-417f-9124-558fb5e5b561'),
('6b3ea184-57c5-4fc5-a91b-e49708f91b67'),
('00dcf32a-a4e2-4e55-a0d1-3a74cf100ca1'),
('cdccdd71-cbe2-4220-8569-a6355ea24f3f'),
('1c36f0b9-b7fd-481b-9cab-3bc3cea35413');

-- 1/3/25 Update dashboard to handle DAAC Assginment
INSERT INTO step(step_name, type, data) VALUES ('daac_assignment', 'action', '{"rollback":"data_accession_request_form_review","type": "review"}');
UPDATE step_edge SET next_step_name='daac_assignment' WHERE workflow_id='3335970e-8a9b-481b-85b7-dfaaa3f5dbd9' AND step_name='data_accession_request_form_review';
UPDATE step_edge SET step_name='daac_assignment' WHERE workflow_id='3335970e-8a9b-481b-85b7-dfaaa3f5dbd9' AND next_step_name='close';
INSERT INTO privilege VALUES ('REQUEST_ASSIGNDAAC');
INSERT INTO edprole_privilege VALUES ('4be6ca4d-6362-478b-8478-487a668314b1', 'REQUEST_ASSIGNDAAC');
DELETE FROM daac WHERE id='1c36f0b9-b7fd-481b-9cab-3bc3cea35413';

-- 1/7/25 EDPUB-1430 Add Upload step type
ALTER TABLE step DROP CONSTRAINT step_type_check;
ALTER TABLE step ADD CONSTRAINT step_type_check CHECK (type IN ('init', 'action', 'form', 'review', 'service', 'upload', 'close'));

CREATE TABLE IF NOT EXISTS upload_step (
  id UUID DEFAULT UUID_GENERATE_V4(),
  step_name VARCHAR NOT NULL,
  upload_destination VARCHAR NOT NULL,
  category_type VARCHAR NOT NULL,
  help_text VARCHAR NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (step_name) REFERENCES step (step_name),
  UNIQUE (step_name)
);

INSERT INTO step (step_name, type, data) VALUES ('cost_model', 'upload', '{"rollback":"data_accession_request_form_review","type": "review"}');
UPDATE step SET data='{"rollback":"cost_model","type": "upload"}' WHERE step_name='daac_assignment';
UPDATE step_edge SET next_step_name = 'cost_model' WHERE workflow_id = '3335970e-8a9b-481b-85b7-dfaaa3f5dbd9' AND step_name ='data_accession_request_form_review';
INSERT INTO step_edge VALUES ('3335970e-8a9b-481b-85b7-dfaaa3f5dbd9', 'cost_model' , 'daac_assignment');
INSERT INTO upload_step (step_name, upload_destination, category_type, help_text) VALUES ('cost_model', 'DAR_Uploads', 'cost_model', 'Please provide a cost model file. Files must be less than 5 GB and cannot include .exe or .dll extensions.');

--2/5/25 - Solidify necessary privileges
-- RolePrivilege(edprole_id, privilege) UWG Member
DELETE FROM edprole_privilege WHERE edprole_id='19ac227b-e96c-46fa-a378-cf82c461b669' AND privilege='NOTE_NEW';
DELETE FROM edprole_privilege WHERE edprole_id='804b335c-f191-4d26-9b98-1ec1cb62b97d' AND privilege='REQUEST_LOCK';
DELETE FROM edprole_privilege WHERE edprole_id='804b335c-f191-4d26-9b98-1ec1cb62b97d' AND privilege='REQUEST_UNLOCK';
DELETE FROM edprole_privilege WHERE edprole_id='804b335c-f191-4d26-9b98-1ec1cb62b97d' AND privilege='FORM_CREATE';
DELETE FROM edprole_privilege WHERE edprole_id='804b335c-f191-4d26-9b98-1ec1cb62b97d' AND privilege='FORM_READ';
DELETE FROM edprole_privilege WHERE edprole_id='804b335c-f191-4d26-9b98-1ec1cb62b97d' AND privilege='FORM_DELETE';
DELETE FROM edprole_privilege WHERE edprole_id='a5b4947a-67d2-434e-9889-59c2fad39676' AND privilege='REQUEST_LOCK';
DELETE FROM edprole_privilege WHERE edprole_id='a5b4947a-67d2-434e-9889-59c2fad39676' AND privilege='REQUEST_UNLOCK';
DELETE FROM edprole_privilege WHERE edprole_id='a5b4947a-67d2-434e-9889-59c2fad39676' AND privilege='NOTE_NEW';
DELETE FROM edprole_privilege WHERE edprole_id='a5b4947a-67d2-434e-9889-59c2fad39676' AND privilege='METRICS_READ';
DELETE FROM edprole_privilege WHERE edprole_id='a5b4947a-67d2-434e-9889-59c2fad39676' AND privilege='FORM_CREATE';
DELETE FROM edprole_privilege WHERE edprole_id='a5b4947a-67d2-434e-9889-59c2fad39676' AND privilege='FORM_READ';
DELETE FROM edprole_privilege WHERE edprole_id='a5b4947a-67d2-434e-9889-59c2fad39676' AND privilege='FORM_DELETE';
DELETE FROM edprole_privilege WHERE edprole_id='a5b4947a-67d2-434e-9889-59c2fad39676' AND privilege='WORKFLOW_READ';
DELETE FROM edprole_privilege WHERE edprole_id='a5b4947a-67d2-434e-9889-59c2fad39676' AND privilege='WORKFLOW_UPDATE';
DELETE FROM edprole_privilege WHERE edprole_id='a5b4947a-67d2-434e-9889-59c2fad39676' AND privilege='QUESTION_READ';
DELETE FROM edprole_privilege WHERE edprole_id='2aa89c57-85f1-4611-812d-b6760bb6295c' AND privilege='REQUEST_INITIALIZE';
DELETE FROM edprole_privilege WHERE edprole_id='2aa89c57-85f1-4611-812d-b6760bb6295c' AND privilege='REQUEST_LOCK';
DELETE FROM edprole_privilege WHERE edprole_id='2aa89c57-85f1-4611-812d-b6760bb6295c' AND privilege='REQUEST_UNLOCK';
DELETE FROM edprole_privilege WHERE edprole_id='2aa89c57-85f1-4611-812d-b6760bb6295c' AND privilege='REQUEST_REASSIGN';
DELETE FROM edprole_privilege WHERE edprole_id='2aa89c57-85f1-4611-812d-b6760bb6295c' AND privilege='FORM_CREATE';
DELETE FROM edprole_privilege WHERE edprole_id='2aa89c57-85f1-4611-812d-b6760bb6295c' AND privilege='FORM_UPDATE';
DELETE FROM edprole_privilege WHERE edprole_id='2aa89c57-85f1-4611-812d-b6760bb6295c' AND privilege='GROUP_UPLOAD';
DELETE FROM edprole_privilege WHERE edprole_id='2aa89c57-85f1-4611-812d-b6760bb6295c' AND privilege='WORKFLOW_CREATE';
DELETE FROM edprole_privilege WHERE edprole_id='2aa89c57-85f1-4611-812d-b6760bb6295c' AND privilege='WORKFLOW_DELETE';
DELETE FROM edprole_privilege WHERE edprole_id='2aa89c57-85f1-4611-812d-b6760bb6295c' AND privilege='QUESTION_READ';
DELETE FROM edprole_privilege WHERE edprole_id='2aa89c57-85f1-4611-812d-b6760bb6295c' AND privilege='METRICS_READ';
DELETE FROM edprole_privilege WHERE edprole_id='2aa89c57-85f1-4611-812d-b6760bb6295c' AND privilege='NOTE_ADDUSER';
DELETE FROM edprole_privilege WHERE edprole_id='2aa89c57-85f1-4611-812d-b6760bb6295c' AND privilege='NOTE_REMOVEUSER';
DELETE FROM edprole_privilege WHERE edprole_id='4be6ca4d-6362-478b-8478-487a668314b1' AND privilege='REQUEST_REASSIGN';
DELETE FROM edprole_privilege WHERE edprole_id='4be6ca4d-6362-478b-8478-487a668314b1' AND privilege='REQUEST_LOCK';
DELETE FROM edprole_privilege WHERE edprole_id='4be6ca4d-6362-478b-8478-487a668314b1' AND privilege='METRICS_READ';
DELETE FROM edprole_privilege WHERE edprole_id='4be6ca4d-6362-478b-8478-487a668314b1' AND privilege='NOTE_NEW';

DELETE FROM privilege WHERE privilege='REQUEST_LOCK';
DELETE FROM privilege WHERE privilege='REQUEST_UNLOCK';
DELETE FROM privilege WHERE privilege='USER_CREATE';
DELETE FROM privilege WHERE privilege='FORM_CREATE';
DELETE FROM privilege WHERE privilege='FORM_READ';
DELETE FROM privilege WHERE privilege='FORM_UPDATE';
DELETE FROM privilege WHERE privilege='FORM_DELETE';
DELETE FROM privilege WHERE privilege='WORKFLOW_CREATE';
DELETE FROM privilege WHERE privilege='WORKFLOW_READ';
DELETE FROM privilege WHERE privilege='WORKFLOW_UPDATE';
DELETE FROM privilege WHERE privilege='WORKFLOW_DELETE';
DELETE FROM privilege WHERE privilege='METRICS_READ';
DELETE FROM privilege WHERE privilege='NOTE_NEW';
DELETE FROM privilege WHERE privilege='QUESTION_READ';

INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'NOTE_REPLY');

-- 2/28/25 Re-add metrics privilege as it will be used by https://github.com/eosdis-nasa/earthdata-pub-dashboard/pull/128
INSERT INTO privilege VALUES ('METRICS_READ');
INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'METRICS_READ');
INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'METRICS_READ');
INSERT INTO edprole_privilege VALUES ('4be6ca4d-6362-478b-8478-487a668314b1', 'METRICS_READ');
-- 2/25/25 Add Default Publication Workflow
INSERT INTO workflow VALUES ('f223eec5-2c4d-4412-9c97-5df4117c9290', 'default_publication_workflow', 1, 'Default Publication Workflow', 'This is the default publication workflow for DAACs who have not yet created a DAAC specific publication workflow.');

INSERT INTO step_edge VALUES ('f223eec5-2c4d-4412-9c97-5df4117c9290', 'init', 'data_publication_request_form');
INSERT INTO step_edge VALUES ('f223eec5-2c4d-4412-9c97-5df4117c9290', 'data_publication_request_form', 'data_publication_request_form_review');
INSERT INTO step_edge VALUES ('f223eec5-2c4d-4412-9c97-5df4117c9290', 'data_publication_request_form_review', 'close');

UPDATE daac SET workflow_id='f223eec5-2c4d-4412-9c97-5df4117c9290' WHERE workflow_id='c1690729-b67e-4675-a1a5-b2323f347dff' AND id != 'cdccdd71-cbe2-4220-8569-a6355ea24f3f';

-- 3/6/25 EDPUB-1372 Repurpose DAAC Selection Page to DAAC Assignment Page
UPDATE daac SET hidden = 'false' WHERE id = 'c606afba-725b-4ae4-9557-1fd33260ae12';
UPDATE daac SET hidden = 'false' WHERE id = 'd551380f-8813-40e4-9763-2a5bb6007cd0';
UPDATE daac SET hidden = 'false' WHERE id = '9e0628f1-0dde-4ed2-b1e3-690c70326f25';
UPDATE daac SET hidden = 'false' WHERE id = 'de6d5ec9-4728-4f2b-9d43-ae2f0fdac96a';
UPDATE daac SET hidden = 'false' WHERE id = 'aec3724f-b30b-4b3f-9b9a-e0907d9d14b3';
UPDATE daac SET hidden = 'false' WHERE id = 'fe75c306-ac04-4689-a702-073d9cb071fe';
UPDATE daac SET hidden = 'false' WHERE id = '00dcf32a-a4e2-4e55-a0d1-3a74cf100ca1';

-- 3/5/25 Reroute Feature pivot updates
UPDATE step SET data='{"rollback":"data_accession_request_form_review","type": "review"}' WHERE step_name='daac_assignment';
DELETE FROM step WHERE workflow_id='3335970e-8a9b-481b-85b7-dfaaa3f5dbd9' AND step_name='cost_model';
UPDATE step_edge SET next_step_name='daac_assignment' WHERE workflow_id='3335970e-8a9b-481b-85b7-dfaaa3f5dbd9' AND step_name='data_accession_request_form_review';

-- 3/17/25 Add ESDIS Final Review
INSERT INTO privilege VALUES ('REQUEST_REVIEW_ESDIS');
INSERT INTO edprole_privilege VALUES ('4be6ca4d-6362-478b-8478-487a668314b1', 'REQUEST_REVIEW_ESDIS');
INSERT INTO step(step_name, step_status_label, type, data) VALUES ('daac_assignment_final', 'Final DAAC Assignment', 'action', '{"rollback":"esdis_final_review","type": "review"}');
INSERT INTO step(step_name, step_status_label, type, data) VALUES ('esdis_final_review', 'ESDIS Final Review', 'review', '{"rollback":"daac_assignment","type": "action"}');
UPDATE step_edge SET next_step_name='esdis_final_review' WHERE workflow_id='3335970e-8a9b-481b-85b7-dfaaa3f5dbd9' AND step_name='data_accession_request_form_review';
UPDATE step_edge SET next_step_name='daac_assignment' WHERE workflow_id='3335970e-8a9b-481b-85b7-dfaaa3f5dbd9' AND step_name='assignment_form_data_accession_request_form';
UPDATE step_edge SET next_step_name='data_accession_request_form' WHERE workflow_id='3335970e-8a9b-481b-85b7-dfaaa3f5dbd9' AND step_name='daac_assignment';
INSERT INTO step_edge VALUES ('3335970e-8a9b-481b-85b7-dfaaa3f5dbd9', 'esdis_final_review', 'daac_assignment_final');
INSERT INTO step_edge VALUES ('3335970e-8a9b-481b-85b7-dfaaa3f5dbd9', 'daac_assignment_final', 'close');

-- 3/14/23 Create New 'Submit Data to an ESDIS DAAC' Form
INSERT INTO form VALUES ('19025579-99ca-4344-8611-704dae626343', 'Submit_Data_ESDIS_DAAC', 1, 'Submit Data to an ESDIS DAAC', 'Submit Data to an ESDIS DAAC.');

INSERT INTO section VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b51', '19025579-99ca-4344-8611-704dae626343', 'Contact Information', 0, '[]', '[]', NULL);
INSERT INTO section VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b52', '19025579-99ca-4344-8611-704dae626343', 'Funding Information', 1, '[]', '[]', NULL);
INSERT INTO section VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b53', '19025579-99ca-4344-8611-704dae626343', 'General Information', 2, '[]', '[]', NULL);
INSERT INTO section VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b54', '19025579-99ca-4344-8611-704dae626343', 'Technical Information', 3, '[]', '[]', NULL);

INSERT INTO step(step_name, type, form_id) VALUES ('assignment_form_data_accession_request_form', 'form', '19025579-99ca-4344-8611-704dae626343');

UPDATE step_edge SET next_step_name = 'assignment_form_data_accession_request_form' WHERE step_name = 'init' AND next_step_name = 'data_accession_request_form';
INSERT INTO step_edge VALUES ('3335970e-8a9b-481b-85b7-dfaaa3f5dbd9', 'assignment_form_data_accession_request_form', 'data_accession_request_form');

INSERT INTO question VALUES ('80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e3', 'assignment_form_principal_investigator', 1, 'Principal Investigator', 'Who is the primary person responsible for managing the research that is creating the data you are hoping to publish at a NASA DAAC?', '');
INSERT INTO question VALUES ('80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e4', 'assignment_form_data_submission_poc', 1, 'Data Submission Point of Contact', 'Who should ESDIS contact with questions regarding this data submission request?', 'This person should have in-depth knowledge of this project and the data it will be producing or has produced, allowing them to provide additional information as needed.');
INSERT INTO question VALUES ('8a364184-42ac-48fe-b831-acb2eb08c730', 'assignment_form_funding_organization', 1, 'Funding Organization', 'What organization(s) funded the creation of this data?','',True);
INSERT INTO question VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d731', 'assignment_form_funding_program', 1, 'Funding Program/Element', 'Under what program or program element within the funding organization was this data created?', 'Examples include NASA programs such as MEaSUREs, Terrestrial Hydrology, Earth Venture, ACCESS, or AIST.');
INSERT INTO question VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d732', 'assignment_form_program_officer', 1, 'Program Officer', 'If known, provide the name of the NASA Headquarters Program Officer responsible for the program under which this project is funded.', '');
INSERT INTO question VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d733', 'assignment_form_releated_projects', 1, 'Releated Projects', ' Is your data related to any NASA-funded project, mission, or campaign, or to any data products in NASA’s archive of Earth Science data?', '');

INSERT INTO question VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d734', 'assignment_form_project_name', 1, 'Project Name', 'Please provide the full name of the project that produced this data. If there is an acronym or shortened project name that you use to refer to the project, please provide that in parentheses.', '');
INSERT INTO question VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d735', 'assignment_form_project_desc', 1, 'Project Description', 'Please provide a brief description of this project.', 'The description should mimic a journal abstract and should provide a reader with the information needed to quickly understand the relevance and usefulness of your data products, including information about the spatial region(s) and temporal period(s) covered by your data.');
INSERT INTO question VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d736', 'assignment_form_science_value', 1, 'Science Value', 'What is the science value of your data?', 'For example, describe the benefits to the science community, the strengths compared to similar data products and/or other data products that it complements.');
INSERT INTO question VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d737', 'assignment_form_data_sub_req', 1, 'Reason for Data Submission Request', 'Why are you requesting to have your data archived and distributed at a DAAC?', 'For example, you have been instructed by a NASA program manager to archive your data at a DAAC, or you want your data to be distributed with related data products.');
INSERT INTO question VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d738', 'assignment_form_data_sub_req_approval', 1, 'Dependencies for Data Submission Request  Approval', 'Do you have any dependencies related to this project’s data being approved for publication at a DAAC?', 'For example, you are publishing a paper and the publisher requires that your data be archived, or your project has a requirement to publish data by a certain time.');
INSERT INTO question VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d739', 'assignment_form_open_data_policy', 1, 'Open Data Policy', ' Can your data be publicly released in compliance with NASA’s Open Data Policy?', 'For a description of the open data Policy, please refer to the <a href="https://www.earthdata.nasa.gov/engage/open-data-services-software-policies/data-information-guidance" target=_blank>NASA Earthdata Data and Information Policy <i class="fas fa-external-link-alt"></i></a>.');
INSERT INTO question VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d740', 'assignment_form_project_documentation', 1, 'Project Documentation', 'Please upload the following document(s), if available: Program Level Requirements Appendix (PLRA), Data Management Plan (DMP), Project Proposal (i.e. the proposal you submitted in order to fund this project).', 'If there are other documents you would like us to consider, please upload those here as well. For example, these documents may include descriptions of your data, data quality, processing methods, or instruments. Files must be less than 5 GB and cannot include .exe or .dll extensions.');

INSERT INTO question VALUES ('50e8d566-b9ab-4bd9-9adc-92a3c8fb5d28', 'assignment_form_data_format', 1, 'Data Format', 'What file format(s) does this data include?', 'For a list of NASA-approved data formats, please refer to the <a href="https://earthdata.nasa.gov/esdis/eso/standards-and-references#data-formats" target=_blank>NASA Earthdata Standards and Practices <i class="fas fa-external-link-alt"></i></a> web page.', True);
INSERT INTO question VALUES ('50e8d566-b9ab-4bd9-9adc-92a3c8fb5d35', 'assignment_form_data_producers_table_info', 1, 'Data Products to be published', 'To the extent possible, please complete the table below for each data product generated by your project:', 'Data Product: A logically meaningful grouping of similar or related data which is packaged for distribution to users and represented with a single title and DOI.', True);

-- SectionQuestion(section_id, question_id, list_order, required_if, show_if))
INSERT INTO section_question VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b51', '80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e3', 0, '[]', '[]');
INSERT INTO section_question VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b51', '80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e4', 1, '[]', '[]');

INSERT INTO section_question VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b52', '8a364184-42ac-48fe-b831-acb2eb08c730', 0, '[]', '[]');
INSERT INTO section_question VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b52', '4ecc885f-daf8-4bc6-a8cd-d30c2a54d731', 1, '[]', '[]');
INSERT INTO section_question VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b52', '4ecc885f-daf8-4bc6-a8cd-d30c2a54d732', 2, '[]', '[]');
INSERT INTO section_question VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b52', '4ecc885f-daf8-4bc6-a8cd-d30c2a54d733', 3, '[]', '[]');

INSERT INTO section_question VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b53', '4ecc885f-daf8-4bc6-a8cd-d30c2a54d734', 0, '[]', '[]');
INSERT INTO section_question VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b53', '4ecc885f-daf8-4bc6-a8cd-d30c2a54d735', 1, '[]', '[]');
INSERT INTO section_question VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b53', '4ecc885f-daf8-4bc6-a8cd-d30c2a54d736', 2, '[]', '[]');
INSERT INTO section_question VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b53', '4ecc885f-daf8-4bc6-a8cd-d30c2a54d737', 3, '[]', '[]');
INSERT INTO section_question VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b53', '4ecc885f-daf8-4bc6-a8cd-d30c2a54d738', 4, '[]', '[]');
INSERT INTO section_question VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b53', '4ecc885f-daf8-4bc6-a8cd-d30c2a54d739', 5, '[]', '[]');
INSERT INTO section_question VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b53', '4ecc885f-daf8-4bc6-a8cd-d30c2a54d740', 6, '[]', '[]');

INSERT INTO section_question VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b54', '50e8d566-b9ab-4bd9-9adc-92a3c8fb5d28', 0, '[]', '[]');
INSERT INTO section_question VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b54', '50e8d566-b9ab-4bd9-9adc-92a3c8fb5d35', 1, '[]', '[]');

-- Input(question_id, control_id, list_order, label, type, enums, attributes, required_if, show_if, required))
INSERT INTO input VALUES ('80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e3', 'assignment_form_principal_investigator_fullname', 0, 'Full Name', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e3', 'assignment_form_principal_investigator_organization', 1, 'Organization', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e3', 'assignment_form_principal_investigator_email', 2, 'Email', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e3', 'assignment_form_principal_investigator_orcid', 3, 'ORCID', 'text', '{}', '{}', '[]','[]',  False);

INSERT INTO input VALUES ('80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e4', 'assignment_form_data_submission_poc_name', 0, 'Full Name', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e4', 'assignment_form_data_submission_poc_organization', 1, 'Organization', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e4', 'assignment_form_data_submission_poc_email', 2, 'Email', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e4', 'assignment_form_data_submission_poc_orcid', 3, 'ORCID', 'text', '{}', '{}', '[]','[]',  False);

INSERT INTO input VALUES ('8a364184-42ac-48fe-b831-acb2eb08c730', 'assignment_form_funding_nasa', 0, 'NASA', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('8a364184-42ac-48fe-b831-acb2eb08c730', 'assignment_form_funding_noaa', 1, 'NOAA', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('8a364184-42ac-48fe-b831-acb2eb08c730', 'assignment_form_funding_nsf', 2, 'NSF', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('8a364184-42ac-48fe-b831-acb2eb08c730', 'assignment_form_funding_usgs', 3, 'USGS', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('8a364184-42ac-48fe-b831-acb2eb08c730', 'assignment_form_funding_university', 4, 'University', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('8a364184-42ac-48fe-b831-acb2eb08c730', 'assignment_form_funding_other', 5, 'Other', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('8a364184-42ac-48fe-b831-acb2eb08c730', 'assignment_form_funding_organization_other', 6, 'If University or Other, please give the name here', 'text', '{}', '{}', '[{"field": "assignment_form_funding_other","value": "true"}, {"field": "assignment_form_funding_university","value": "true"}]','[]',  False);

INSERT INTO input VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d731', 'assignment_form_funding_program_name', 0, '', 'text', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d732', 'assignment_form_program_officer_name', 0, '', 'text', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d733', 'assignment_form_releated_projects_yes_no', 0, '', 'radio', '["Yes","No"]', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d733', 'assignment_form_releated_projects_yes_explanation', 1, 'If Yes, please provide a brief explanation', 'text', '{}', '{}', '[{"field": "assignment_form_releated_projects_yes_no","value": "Yes"}]','[]',  False);

INSERT INTO input VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d734', 'assignment_form_project_name_info', 0, '', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d735', 'assignment_form_project_desc_info', 0, '', 'textarea', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d736', 'assignment_form_science_value_info', 0, '', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d737', 'assignment_form_data_sub_req_info', 0, '', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d738', 'assignment_form_data_sub_req_approval_info', 0, '', 'radio', '["Yes","No"]', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d738', 'assignment_form_data_sub_req_approval_info_no', 1, 'If Yes, please provide a brief explanation.', 'text', '{}', '{}', '[{"field": "assignment_form_data_sub_req_approval_info","value": "Yes"}]','[]',  False);
INSERT INTO input VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d739', 'assignment_form_open_data_policy_info', 0, '', 'radio', '["Yes","No","Not Sure"]', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d739', 'assignment_form_open_data_policy_info_no', 1, 'If No or Not sure, please provide a brief explanation.', 'text', '{}', '{}', '[{"field": "assignment_form_open_data_policy_info","value": "No"}, {"field": "assignment_form_open_data_policy_info","value": "Not Sure"}]','[]',  False);

INSERT INTO input VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d740', 'assignment_form_project_documentation', 0, '', 'file', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d740', 'assignment_form_project_documentation_url', 1, 'Alternatively, provide a URL to the document(s)', 'text', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('4ecc885f-daf8-4bc6-a8cd-d30c2a54d740', 'assignment_form_project_documentation_web', 2, 'Please provide a link to your project website, if available', 'text', '{}', '{}', '[]','[]',  False);

INSERT INTO input VALUES ('50e8d566-b9ab-4bd9-9adc-92a3c8fb5d28', 'assignment_data_format_ascii', 0, 'ASCII', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('50e8d566-b9ab-4bd9-9adc-92a3c8fb5d28', 'assignment_data_format_geotiff', 1, 'GeoTIFF', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('50e8d566-b9ab-4bd9-9adc-92a3c8fb5d28', 'assignment_data_format_hdf5', 2, 'HDF 5', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('50e8d566-b9ab-4bd9-9adc-92a3c8fb5d28', 'assignment_data_format_hdf_eos', 3, 'HDF-EOS 5', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('50e8d566-b9ab-4bd9-9adc-92a3c8fb5d28', 'assignment_data_format_ogc_kml', 4, 'OGC KML', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('50e8d566-b9ab-4bd9-9adc-92a3c8fb5d28', 'assignment_data_format_netcdf_4', 5, 'NetCDF-4', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('50e8d566-b9ab-4bd9-9adc-92a3c8fb5d28', 'assignment_data_format_netcdf_classic', 6, 'NetCDF Classic', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('50e8d566-b9ab-4bd9-9adc-92a3c8fb5d28', 'assignment_data_format_other', 7, 'Other', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('50e8d566-b9ab-4bd9-9adc-92a3c8fb5d28', 'assignment_data_format_dont_know', 8, 'Don`t know yet', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('50e8d566-b9ab-4bd9-9adc-92a3c8fb5d28', 'assignment_data_format_other_info', 9, 'If Other, please provide the data format(s)', 'text', '{}', '{}', '[{"field":"assignment_data_format_other","value":"true"}]','[]',  False);

INSERT INTO input VALUES ('50e8d566-b9ab-4bd9-9adc-92a3c8fb5d35', 'assignment_form_data_producers_table', 0, '', 'table', '[{"key":"data_product_name","label":"Name of data product: How do you refer to the data product?","type":"text","editable":true},{"key": "data_prod_timeline","label": "Data Production Timeline: Include the start date and when do you expect data production to be complete.","type": "text","editable": true},{"key":"data_prod_volume","label":"Data Product Volume: What is the estimated or actual total volume of the data product upon completion of production?","type":"text","editable":true},{"key":"instrument_collect_data","label":"Instrument: What instrument  is used to collect data?","type":"text","editable":true}]', '{}', '[]','[]',  True);

-- 3/21/25 Update notes to be associated with the submission's daac at time of creation
ALTER TABLE note ADD daac_id UUID;
ALTER TABLE note ADD FOREIGN KEY (daac_id) REFERENCES daac(id);

-- 4/4/25 Allow Observer role to create/remove step review approval requirements
INSERT INTO edprole_privilege VALUES ('4be6ca4d-6362-478b-8478-487a668314b1', 'CREATE_STEPREVIEW');
INSERT INTO edprole_privilege VALUES ('4be6ca4d-6362-478b-8478-487a668314b1', 'REMOVE_STEPREVIEW');

-- 4/4/25 Allow Data Manager to limit note visibility
INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'NOTE_ADDUSER');
INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'NOTE_REMOVEUSER');

-- 4/7/25 Moving Needs Review Question to it's own thing.
INSERT INTO step(step_name, type, data) VALUES ('additional_review_question', 'action', '{"rollback":"assignment_form_data_accession_request_form","type": "form","form":"19025579-99ca-4344-8611-704dae626343"}');
Update step_edge SET next_step_name = 'additional_review_question' WHERE workflow_id ='3335970e-8a9b-481b-85b7-dfaaa3f5dbd9' AND step_name = 'assignment_form_data_accession_request_form';
INSERT INTO step_edge VALUES ('3335970e-8a9b-481b-85b7-dfaaa3f5dbd9', 'additional_review_question', 'daac_assignment');
UPDATE step SET data = '{"rollback":"additional_review_question","type": "action"}' WHERE step_name = 'daac_assignment';
UPDATE step SET data = '{"rollback":"data_accession_request_form_review","type": "review", "form_id":"6c544723-241c-4896-a38c-adbc0a364293"}' WHERE step_name = 'esdis_final_review';