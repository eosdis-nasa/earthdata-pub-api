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

--RolePrivilege(edprole_id, privilege) Data Coordinator
INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'REQUEST_DAACREAD');
INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'REQUEST_LOCK');
INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'REQUEST_UNLOCK');
INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'REQUEST_REASSIGN');
INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'DAAC_READ');
INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'USER_READ');
INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'USER_ADDGROUP');
INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'USER_REMOVEGROUP');
INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'USER_ADDROLE');
INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'USER_REMOVEROLE');


-- 5/16/22
ALTER TABLE daac ADD hidden BOOLEAN DEFAULT FALSE;

UPDATE question SET help='' WHERE id='4c42796a-8ff1-444e-8fc5-82ccad82e5fb';
UPDATE question SET long_name='' WHERE id='a12ccd39-1d94-46a5-8aad-3587fd50c4ad';

UPDATE daac SET hidden=TRUE WHERE id='40397fe8-4841-4e4c-b84a-6ece359ff5ff';
UPDATE daac SET hidden=TRUE WHERE id='c606afba-725b-4ae4-9557-1fd33260ae12';
UPDATE daac SET hidden=TRUE WHERE id='d551380f-8813-40e4-9763-2a5bb6007cd0';
UPDATE daac SET hidden=TRUE WHERE id='1ea1da68-cb95-431f-8dd8-a2cf16d7ef98';
UPDATE daac SET hidden=TRUE WHERE id='9e0628f1-0dde-4ed2-b1e3-690c70326f25';
UPDATE daac SET hidden=TRUE WHERE id='de6d5ec9-4728-4f2b-9d43-ae2f0fdac96a';
UPDATE daac SET hidden=TRUE WHERE id='aec3724f-b30b-4b3f-9b9a-e0907d9d14b3';
UPDATE daac SET hidden=TRUE WHERE id='fe75c306-ac04-4689-a702-073d9cb071fe';
UPDATE daac SET hidden=TRUE WHERE id='6b3ea184-57c5-4fc5-a91b-e49708f91b67';
UPDATE daac SET hidden=TRUE WHERE id='00dcf32a-a4e2-4e55-a0d1-3a74cf100ca1';

UPDATE daac SET long_name='Global Hydrometeorology Resource Center (GHRC) Distributed Active Archive Center (DAAC)' WHERE id='ef229725-1cad-485e-a72b-a276d2ca3175';
UPDATE daac SET description='NASA''s Global Hydrometeorology Resource Center (GHRC) Distributed Active Archive Center (DAAC) is a joint venture of NASA''s Marshall Space Flight Center and the Information Technology and Systems Center (ITSC) located within the University of Alabama in Huntsville. GHRC DAAC was established in 1991 and is located at the National Space Science and Technology Center on the UAH campus. GHRC DAAC provides a comprehensive active archive of both data and knowledge augmentation services, with a focus on hazardous weather, its governing dynamical and physical processes, and associated applications. With this broad mandate, GHRC DAAC focuses on lightning, tropical cyclones and storm-induced hazards through integrated collections of satellite, airborne, and in-situ data sets.' WHERE id='ef229725-1cad-485e-a72b-a276d2ca3175';

