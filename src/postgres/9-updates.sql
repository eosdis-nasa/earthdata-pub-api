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

-- 09/3/24 removes DAAC_READ priviledge from Data Producer
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
--  Migrate any submission currently in the DAR form/review step to the accession workflow; also migrate pushing of the accession form action to DAR review step
UPDATE submission_status SET workflow_id='3335970e-8a9b-481b-85b7-dfaaa3f5dbd9', last_change=now() WHERE step_name = ANY('{data_accession_request_form, data_accession_request_form_review}');
UPDATE submission_status SET workflow_id='3335970e-8a9b-481b-85b7-dfaaa3f5dbd9', step_name='data_accession_request_form_review', last_change=now() WHERE step_name='push_to_ornl_database_f1';

UPDATE step_edge SET next_step_name='data_publication_request_form' WHERE workflow_id='45e8d0e8-d8c9-47e1-85a2-5b5db6e34dd8' AND step_name='init';
DELETE FROM step_edge WHERE worfklow_id='45e8d0e8-d8c9-47e1-85a2-5b5db6e34dd8' AND step_name='data_accession_request_form';
DELETE FROM step_edge WHERE worfklow_id='45e8d0e8-d8c9-47e1-85a2-5b5db6e34dd8' AND step_name='data_accession_request_form_review';

UPDATE step_edge SET next_step_name='data_publication_request_form' WHERE workflow_id='a218f99d-cfc1-44e5-b203-3e447e1c1275' AND step_name='init';
DELETE FROM step_edge WHERE workflow_id='a218f99d-cfc1-44e5-b203-3e447e1c1275' AND step_name='data_accession_request_form';
DELETE FROM step_edge WHERE workflow_id='a218f99d-cfc1-44e5-b203-3e447e1c1275' AND step_name='data_accession_request_form_review';
DELETE FROM step_edge WHERE workflow_id='a218f99d-cfc1-44e5-b203-3e447e1c1275' AND step_name='push_to_ornl_database_f1';

UPDATE step_edge SET next_step_name='data_publication_request_form' WHERE workflow_id='0c1aa7d8-d45b-44ad-ab63-5bf6e40b2bce' AND step_name='ornl_service_trigger';
DELETE FROM step_edge WHERE workflow_id='0c1aa7d8-d45b-44ad-ab63-5bf6e40b2bce' AND step_name='data_accession_request_form';
DELETE FROM step_edge WHERE workflow_id='0c1aa7d8-d45b-44ad-ab63-5bf6e40b2bce' AND step_name='push_to_ornl_database_f1';

UPDATE step_edge SET next_step_name='data_publication_request_form' WHERE workflow_id='ca34ea28-07f8-4edf-a73a-d6ee8a86f1c7' AND step_name='init';
DELETE FROM step_edge WHERE workflow_id='ca34ea28-07f8-4edf-a73a-d6ee8a86f1c7' AND step_name='data_accession_request_form';
DELETE FROM step_edge WHERE workflow_id='ca34ea28-07f8-4edf-a73a-d6ee8a86f1c7' AND step_name='data_accession_request_form_review';

UPDATE step_edge SET next_step_name='data_publication_request_form' WHERE workflow_id='a8d22c43-7814-4609-ac04-66fb50228bf7' AND step_name='init';
DELETE FROM step_edge WHERE workflow_id='a8d22c43-7814-4609-ac04-66fb50228bf7' AND step_name='data_accession_request_form';
DELETE FROM step_edge WHERE workflow_id='a8d22c43-7814-4609-ac04-66fb50228bf7' AND step_name='data_accession_request_form_review';

UPDATE step_edge SET next_step_name='data_publication_request_form' WHERE workflow_id='c1690729-b67e-4675-a1a5-b2323f347dff' AND step_name='init';
DELETE FROM step_edge WHERE workflow_id='c1690729-b67e-4675-a1a5-b2323f347dff' AND step_name='data_accession_request_form';
DELETE FROM step_edge WHERE workflow_id='c1690729-b67e-4675-a1a5-b2323f347dff' AND step_name='data_accession_request_form_review';

UPDATE step_edge SET next_step_name='data_publication_request_form' WHERE workflow_id='a5a14d98-df13-47f2-b86b-1504c7d4360d' AND step_name='init';
DELETE FROM step_edge WHERE workflow_id='a5a14d98-df13-47f2-b86b-1504c7d4360d' AND step_name='data_accession_request_form';
DELETE FROM step_edge WHERE workflow_id='a5a14d98-df13-47f2-b86b-1504c7d4360d' AND step_name='data_accession_request_form_review';

-- 12/9/24 Create accession_publication_code DB Association
CREATE TABLE IF NOT EXISTS publication_accession_association (
  publication_submission_id UUID NOT NULL,
  accession_submission_id UUID NOT NULL,
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

<<<<<<< HEAD
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

INSERT INTO step (step_name, type) VALUES ('cost_model', 'upload');
UPDATE step_edge SET next_step_name = 'cost_model' WHERE workflow_id = '3335970e-8a9b-481b-85b7-dfaaa3f5dbd9' AND step_name ='data_accession_request_form_review';
INSERT INTO step_edge VALUES ('3335970e-8a9b-481b-85b7-dfaaa3f5dbd9', 'cost_model' , 'assign_a_workflow');
INSERT INTO upload_step (step_name, upload_destination, category_type, help_text) VALUES ('cost_model', 'DAR_Uploads', 'cost_model', 'Please provide a cost model file. Files must be less than 5 GB and cannot include .exe or .dll extensions.');
=======
-- 1/3/25 Update dashboard to handle DAAC Assginment
INSERT INTO step(step_name, type, data) VALUES ('daac_assignment', 'action', '{"rollback":"data_accession_request_form_review","type": "review"}');
UPDATE step_edge SET next_step_name='daac_assignment' WHERE workflow_id='3335970e-8a9b-481b-85b7-dfaaa3f5dbd9' AND step_name='data_accession_request_form_review';
INSERT INTO step_edge VALUES ('3335970e-8a9b-481b-85b7-dfaaa3f5dbd9', 'daac_assignment', 'close');
INSERT INTO privilege VALUES ('REQUEST_ASSIGNDAAC');
INSERT INTO edprole_privilege VALUES ('4be6ca4d-6362-478b-8478-487a668314b1', 'REQUEST_ASSIGNDAAC');
DELETE FROM daac WHERE id='1c36f0b9-b7fd-481b-9cab-3bc3cea35413';
>>>>>>> ccb4ca24f33c2737554e12f89e4a53e0aeef91bf
