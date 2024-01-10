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