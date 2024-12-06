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