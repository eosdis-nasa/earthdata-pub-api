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

-- 9/7/22 Add middle initial
UPDATE input SET enums='[{"key":"producer_first_name","label":"First Name","type":"text","editable":true},{"key": "producer_middle_initial","label": "Middle Initial","type": "text","editable": true},{"key":"producer_last_name_or_organization","label":"Last Name or Group","type":"text","editable":true}]' WHERE control_id='data_producers_table';

--9/7/22 Add ASDC Workflow
INSERT INTO workflow VALUES ('a8d22c43-7814-4609-ac04-66fb50228bf7', 'asdc_darkhorse_workflow', 1, 'ASDC Default Workflow (Darkhorse)', 'This is the darkhorse workflow for ASDC.');
INSERT INTO step(step_id, step_name, type, data) VALUES ('88d12552-d2e3-4737-9c6a-8bd86b5df3c7', 'email_asdc_staff', 'action', '{"rollback":"data_publication_request_form_review","type": "review", "form_id":"19025579-99ca-4344-8610-704dae626343"}');
INSERT INTO step_edge VALUES ('a8d22c43-7814-4609-ac04-66fb50228bf7', 'init', 'data_accession_request_form');
INSERT INTO step_edge VALUES ('a8d22c43-7814-4609-ac04-66fb50228bf7', 'data_accession_request_form', 'data_accession_request_form_review');
INSERT INTO step_edge VALUES ('a8d22c43-7814-4609-ac04-66fb50228bf7', 'data_accession_request_form_review', 'data_publication_request_form');
INSERT INTO step_edge VALUES ('a8d22c43-7814-4609-ac04-66fb50228bf7', 'data_publication_request_form', 'data_publication_request_form_review');
INSERT INTO step_edge VALUES ('a8d22c43-7814-4609-ac04-66fb50228bf7', 'data_publication_request_form_review', 'email_asdc_staff');
INSERT INTO step_edge VALUES ('a8d22c43-7814-4609-ac04-66fb50228bf7', 'email_asdc_staff', 'close');
UPDATE daac SET workflow_id='a8d22c43-7814-4609-ac04-66fb50228bf7', hidden='false' WHERE id='40397fe8-4841-4e4c-b84a-6ece359ff5ff';
