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

-- 6/24/22
--UPDATE table_name SET column_name='' WHERE column_name='';
UPDATE input SET control_id='data_product_doi', type='table', enums='[{"key": "data_product_doi_value","label": "DOI","type": "text","editable": true}]', required_if='[{"field":"data_product_doi_exists","value":"true","message":"Please add DOIs."}]' WHERE question_id='c9c73e88-837a-42d2-aa1a-50874a333607' AND list_order=1;

UPDATE input SET attributes='{"rows":5,"cols":20,"maxlength":1000,"placeholder":""}' WHERE control_id='data_accession_reason_description';

UPDATE input SET attributes='{"min": "1"}' WHERE control_id='data_product_volume_amount';
UPDATE input SET attributes='{"min": "1"}' WHERE control_id='file_temporal_coverage_answer';
UPDATE input SET attributes='{"min": "1"}' WHERE control_id='value_temporal_resolution_answer';
UPDATE input SET attributes='{"min": "1"}' WHERE control_id='spatial_vertical_details_upper';
UPDATE input SET attributes='{"min": "1"}' WHERE control_id='spatial_vertical_details_lower';
UPDATE input SET attributes='{"min": "1"}' WHERE control_id='data_product_number_of_files';

-- 7/13/22
INSERT INTO action VALUES ('3fe93672-cd91-45d4-863b-c6d0d63f8c8c', 'send_to_meditor', 1, 'Send To mEditor Action', 'This action is used to send collection metadata from EDPub to mEditor.', 'ea8028411c961a69fe308164ba12dfeb6e8672da6593981ca4f4f5fce87cd3ef');
UPDATE step SET action_id='3fe93672-cd91-45d4-863b-c6d0d63f8c8c' WHERE step_name='send_to_meditor';
