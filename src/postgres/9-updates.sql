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


-- 5/10/22 Label Content Updates
UPDATE question SET text='Do you have any dependencies related to this data product being approved to be published at the DAAC?' WHERE id='f40956c3-9af8-400e-8dd8-c5e2965dcb8a';
UPDATE question SET text='Can this data product be publicly released in compliance with NASA''s Open Data Policy?' WHERE id='2dd6c8b1-22a8-4866-91c3-da9b4ce849dc';
UPDATE question SET required='true' WHERE id='50e8d566-b9ab-4bd9-9adc-92a3c8fb5d27';

UPDATE input SET label='' WHERE control_id='funding_program_name';
UPDATE input SET label='' WHERE control_id='data_product_name_value';
UPDATE input SET label='' WHERE control_id='data_product_description';

UPDATE input SET label='' WHERE control_id='data_product_doi_value';
UPDATE input SET label='' WHERE control_id='science_value_description';
UPDATE input SET label='' WHERE control_id='data_accession_reason_description';
UPDATE input SET label='' WHERE control_id='data_accession_approval_dependencies_radios';
UPDATE input SET label='If Yes, please provide a brief explanation' WHERE control_id='data_accession_approval_dependencies_explanation';
UPDATE input SET label='If No or Not sure, please provide a brief explanation' WHERE control_id='data_product_restrictions_explanation';
UPDATE input SET required_if='[{"field": "data_product_restrictions_public","value": "No"},{"field": "data_product_restrictions_public","value": "Not sure"}]' WHERE control_id='data_product_restrictions_explanation';
UPDATE input SET label='' WHERE control_id='data_product_documentation_url';

UPDATE input SET label='If Other, please provide the data format(s)' WHERE control_id='data_format_other_info';
UPDATE input SET label='' WHERE control_id='spatial_general_region';

UPDATE input SET label='' WHERE control_id='data_product_status';
UPDATE input SET label='' WHERE control_id='data_delivery_frequency';
UPDATE input SET label='' WHERE control_id='data_product_volume_amount';
UPDATE input SET label='' WHERE control_id='data_product_volume_units';
UPDATE input SET label='' WHERE control_id='example_file_url';

UPDATE input SET label='' WHERE control_id='funding_grant_number';

UPDATE input SET label='' WHERE control_id='data_production_latency_units';
UPDATE input SET label='' WHERE control_id='file_temporal_coverage_answer';
UPDATE input SET label='' WHERE control_id='file_temporal_coverage_units';
UPDATE input SET label='' WHERE control_id='value_temporal_resolution_answer';
UPDATE input SET label='' WHERE control_id='value_temporal_resolution_units';
UPDATE input SET label='' WHERE control_id='temporal_coverage_notes_textarea';

UPDATE input SET label='' WHERE control_id='spatial_vertical_answer';

UPDATE input SET label='' WHERE control_id='spatial_vertical_details_upper_units';

UPDATE input SET label='' WHERE control_id='spatial_vertical_details_lower_units';
UPDATE input SET label='' WHERE control_id='spatial_data_file';

UPDATE input SET label='' WHERE control_id='spatial_notes_textarea';
UPDATE input SET label='' WHERE control_id='data_processing_level';

UPDATE input SET label='' WHERE control_id='variables_text';

UPDATE input SET label='' WHERE control_id='platform_instrument';
UPDATE input SET label='' WHERE control_id='model_data_product';
UPDATE input SET label='' WHERE control_id='data_file_compression_answer';
UPDATE input SET label='' WHERE control_id='data_product_number_of_files';
UPDATE input SET label='' WHERE control_id='browse_images_provided';

UPDATE daac SET long_name='Global Hydrometeorology Resource Center (GHRC) Distributed Active Archive Center (DAAC)' WHERE id='ef229725-1cad-485e-a72b-a276d2ca3175';

UPDATE input SET label='If Yes, please provide a brief explanation.', required_if='[{"field": "data_accession_approval_dependencies_radios","value": "Yes"}]' WHERE control_id='data_accession_approval_dependencies_explanation';
UPDATE input SET required_if='[]' WHERE control_id='data_product_restrictions_public';
UPDATE input SET label='If No or Not sure, please provide a brief explanation.', required_if='[{"field": "data_product_restrictions_public","value": "No"},{"field": "data_product_restrictions_public","value": "Not sure"}]' WHERE control_id='data_product_restrictions_explanation';

UPDATE input SET show_if='[]' WHERE control_id='data_product_restrictions_public'
