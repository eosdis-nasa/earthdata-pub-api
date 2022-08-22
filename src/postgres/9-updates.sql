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


--8/22/2022 Workflows update
INSERT INTO workflow VALUES ('45e8d0e8-d8c9-47e1-85a2-5b5db6e34dd8', 'ghrc_default_workflow', 1, 'GHRC Default Workflow', 'This is the default workflow for GHRC.');
INSERT INTO workflow VALUES ('a218f99d-cfc1-44e5-b203-3e447e1c1275', 'ornl_default_workflow', 1, 'ORNL Default Workflow', 'This is the default workflow for ORNL.');
INSERT INTO workflow VALUES ('b51a6c31-c098-41b0-89ad-261254b0aaae', 'ornl_referred_workflow', 1, 'ORNL Referrer Close', 'Use this to close after referring the Data Producer to another DAAC.');

INSERT INTO step(step_id, step_name, type, data) VALUES ('d1cbc4a8-ce4c-4734-8e71-a824d30c401a', 'edit_metadata_in_meditor_after_publication_form_review', 'action', '{"rollback":"data_publication_request_form_review","type": "review", "form_id":"19025579-99ca-4344-8610-704dae626343"}');
INSERT INTO step(step_id, step_name, type, data) VALUES ('83c0a113-ecc8-4719-984c-9b4665655495', 'push_to_ornl_database', 'action', '{"rollback":"data_publication_request_form_review","type": "review", "form_id":"19025579-99ca-4344-8610-704dae626343"}');
INSERT INTO step(step_id, step_name, type, data) VALUES ('c628d63b-93b9-45ae-8e7b-a903554b6726', 'send_to_meditor_after_publication_form_review', 'action', '{"rollback":"data_publication_request_form_review","type": "review", "form_id":"19025579-99ca-4344-8610-704dae626343"}');

--GHRC
INSERT INTO step_edge VALUES ('45e8d0e8-d8c9-47e1-85a2-5b5db6e34dd8', 'init', 'data_accession_request_form');
INSERT INTO step_edge VALUES ('45e8d0e8-d8c9-47e1-85a2-5b5db6e34dd8', 'data_accession_request_form', 'data_accession_request_form_review');
INSERT INTO step_edge VALUES ('45e8d0e8-d8c9-47e1-85a2-5b5db6e34dd8', 'data_accession_request_form_review', 'data_publication_request_form');
INSERT INTO step_edge VALUES ('45e8d0e8-d8c9-47e1-85a2-5b5db6e34dd8', 'data_publication_request_form', 'data_publication_request_form_review');
INSERT INTO step_edge VALUES ('45e8d0e8-d8c9-47e1-85a2-5b5db6e34dd8', 'data_publication_request_form_review', 'send_to_meditor_after_publication_form_review');
INSERT INTO step_edge VALUES ('45e8d0e8-d8c9-47e1-85a2-5b5db6e34dd8', 'send_to_meditor_after_publication_form_review', 'edit_metadata_in_meditor_after_publication_form_review');
INSERT INTO step_edge VALUES ('45e8d0e8-d8c9-47e1-85a2-5b5db6e34dd8', 'edit_metadata_in_meditor_after_publication_form_review', 'close');

UPDATE daac SET workflow_id='45e8d0e8-d8c9-47e1-85a2-5b5db6e34dd8' WHERE id='ef229725-1cad-485e-a72b-a276d2ca3175';

--ORNL
INSERT INTO step_edge VALUES ('b51a6c31-c098-41b0-89ad-261254b0aaae', 'init', 'close');

INSERT INTO step_edge VALUES ('a218f99d-cfc1-44e5-b203-3e447e1c1275', 'init', 'data_accession_request_form');
INSERT INTO step_edge VALUES ('a218f99d-cfc1-44e5-b203-3e447e1c1275', 'data_accession_request_form', 'data_accession_request_form_review');
INSERT INTO step_edge VALUES ('a218f99d-cfc1-44e5-b203-3e447e1c1275', 'data_accession_request_form_review', 'data_publication_request_form');
INSERT INTO step_edge VALUES ('a218f99d-cfc1-44e5-b203-3e447e1c1275', 'data_publication_request_form', 'data_publication_request_form_review');
INSERT INTO step_edge VALUES ('a218f99d-cfc1-44e5-b203-3e447e1c1275', 'data_publication_request_form_review', 'push_to_ornl_database');
INSERT INTO step_edge VALUES ('a218f99d-cfc1-44e5-b203-3e447e1c1275', 'push_to_ornl_database', 'close');

UPDATE daac SET workflow_id='a218f99d-cfc1-44e5-b203-3e447e1c1275' WHERE id='15df4fda-ed0d-417f-9124-558fb5e5b561';

--Step Updates
UPDATE step SET data='{"rollback":"data_publication_request_form_review","type": "review","form_id":"19025579-99ca-4344-8610-704dae626343"}' WHERE step_name='start_qa';

--New Send To Meditor Step Action Association
UPDATE step SET action_id='3fe93672-cd91-45d4-863b-c6d0d63f8c8c' WHERE step_id='c628d63b-93b9-45ae-8e7b-a903554b6726';