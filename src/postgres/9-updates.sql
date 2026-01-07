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


-- EDPUB-1573: Dev team updates for DER based on Info Team feedback
DELETE FROM section_question
WHERE (section_id, question_id) IN (
  ('1b4f110b-fea3-444f-b52c-c85008cf3b50', '80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e2'),
  ('1b4f110b-fea3-444f-b52c-c85008cf3b50', 'f3e2eab9-6375-4e53-9cc2-3d16f318d333'),
  ('e2b23c21-32cc-4423-9363-61887abe29c7', '8a364184-42ac-48fe-b831-acb2eb08c728'),
  ('e2b23c21-32cc-4423-9363-61887abe29c7', '4ecc885f-daf8-4bc6-a8cd-d30c2a54d085'),
  ('049e63e8-018d-4c3f-96f1-80c73e0f4287', 'f74c6c20-7483-40f9-a63e-58cc20ae8c8f'),
  ('049e63e8-018d-4c3f-96f1-80c73e0f4287', '39701413-ac96-4b66-9c2f-2d9c08a18ed9'),
  ('049e63e8-018d-4c3f-96f1-80c73e0f4287', 'c3af2edf-d912-40ce-990d-e8b4f86d1ad3'),
  ('049e63e8-018d-4c3f-96f1-80c73e0f4287', '7fd7bccf-5065-4033-9956-9e80bc99c205'),
  ('049e63e8-018d-4c3f-96f1-80c73e0f4287', 'bd00dbb7-1d3c-46fa-82a4-734236f4e06c'),
  ('049e63e8-018d-4c3f-96f1-80c73e0f4287', 'f40956c3-9af8-400e-8dd8-c5e2965dcb8a'),
  ('049e63e8-018d-4c3f-96f1-80c73e0f4287', '2dd6c8b1-22a8-4866-91c3-da9b4ce849dc'),
  ('049e63e8-018d-4c3f-96f1-80c73e0f4287', 'ad568b2f-89fe-4afd-a0bf-9e5832b71ce9'),
  ('2ba04d20-5473-42b7-907c-10ef384f90c8', '50e8d566-b9ab-4bd9-9adc-92a3c8fb5d27'),
  ('2ba04d20-5473-42b7-907c-10ef384f90c8', '228cb0d6-78fb-449a-8061-b1e6fb3f59d1'),
  ('2ba04d20-5473-42b7-907c-10ef384f90c8', '4f2dd369-d865-47ba-8504-8694493f129f'),
  ('2ba04d20-5473-42b7-907c-10ef384f90c8', 'dbf70495-433a-439e-8173-0cb20f972c16'),
  ('2ba04d20-5473-42b7-907c-10ef384f90c8', '4c42796a-8ff1-444e-8fc5-82ccad82e5fb'),
  ('2ba04d20-5473-42b7-907c-10ef384f90c8', '40672516-2220-4edc-8c1b-fd9f7e0b978f'),
  ('2ba04d20-5473-42b7-907c-10ef384f90c8', '53a0faa7-f7d4-4ce9-a9dc-a13cef44e1f3')
);

-- move all list_order values out of range to avoid conflicts
UPDATE section
SET list_order = list_order + 100
WHERE form_id = '6c544723-241c-4896-a38c-adbc0a364293';

INSERT INTO section VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b60', '6c544723-241c-4896-a38c-adbc0a364293', 'Data Products', 0, '[]', '[]', NULL);
UPDATE section SET list_order = 1  WHERE id = '1b4f110b-fea3-444f-b52c-c85008cf3b50';
UPDATE section SET list_order = 2  WHERE id = 'e2b23c21-32cc-4423-9363-61887abe29c7';
DELETE FROM section where id = '049e63e8-018d-4c3f-96f1-80c73e0f4287';
INSERT INTO section VALUES ('7c9e2f41-3d85-4f7a-a2c1-9b8d4f6e2a77', '6c544723-241c-4896-a38c-adbc0a364293', 'General Information', 1003, '[]', '[]', NULL);

UPDATE section SET list_order = 3  WHERE id = '7c9e2f41-3d85-4f7a-a2c1-9b8d4f6e2a77';
UPDATE section SET list_order = 4  WHERE id = '2ba04d20-5473-42b7-907c-10ef384f90c8';
UPDATE section SET list_order = 5  WHERE id = '608df644-d1ed-4aa4-9bb9-4907f3e9ce9d';
UPDATE section SET list_order = 6  WHERE id = '30727449-9617-4765-83b0-d4637936710d';
UPDATE section SET list_order = 7  WHERE id = 'a9e1a611-9435-4f21-b074-09b9f502e79c';
UPDATE section SET list_order = 8  WHERE id = 'caaa6d32-0bd5-45a9-8511-defca7405dcb';
UPDATE section SET list_order = 9  WHERE id = '5d30eb76-631e-4591-9782-8422250cd89e';
UPDATE section SET list_order = 10 WHERE id = '3095e7ac-25be-4bd2-a5cd-47de253d06af';
UPDATE section SET list_order = 11 WHERE id = 'ec1fbb1e-8d4d-4646-a20c-b5fb68135403';
UPDATE section SET list_order = 12 WHERE id = '11bac86a-b284-47b3-aaee-855859f56c0a';
UPDATE section SET list_order = 13 WHERE id = 'bd4fe63a-ba32-475b-a665-e593dd2d6916';
UPDATE section SET list_order = 14 WHERE id = 'a02e43ac-80e8-422e-b2aa-639b2a1da64a';
UPDATE section SET list_order = 15 WHERE id = 'a2d9ec2b-7e78-427f-ab2e-6f9c8405b79e';
UPDATE section SET list_order = 16 WHERE id = 'e738f09c-6982-4ec1-a0e0-916b1f5645ab';

INSERT INTO question VALUES ('d6a7a9f3-5c8a-44d3-8e21-3f4a2f8b09f2', 'additional_comments_data_prod', 1, 'Additional comments regarding expected data products', '', '', True);
INSERT INTO question VALUES ('9f3d4e12-7b29-45ce-bf21-6c018b9d6f54', 'der_sample_data_file', 1, 'Sample Data File(s)', 'Please upload a sample file(s).', 'Providing sample data files that are representative of the range of data within this data product will help the DAAC understand and provide feedback on the data format, structure, and content. If more than 5 sample data files are necessary to represent the data product, please contact the DAAC for assistance.  Files must be less than 5 GB and cannot include .exe or .dll extensions.', False);

INSERT INTO input VALUES ('9f3d4e12-7b29-45ce-bf21-6c018b9d6f54', 'der_example_files', 0, '', 'file', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('d6a7a9f3-5c8a-44d3-8e21-3f4a2f8b09f2', 'additional_comments', 0, '', 'text', '{}', '{}', '[]','[]',  True);

INSERT INTO section_question VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b60', '50e8d566-b9ab-4bd9-9adc-92a3c8fb5d35', 0, '[]', '[]');
INSERT INTO section_question VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b60', 'd6a7a9f3-5c8a-44d3-8e21-3f4a2f8b09f2', 1, '[]', '[]');
INSERT INTO section_question VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b60', '9f3d4e12-7b29-45ce-bf21-6c018b9d6f54', 2, '[]', '[]');

INSERT INTO section_question VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b50', '80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e3', 0, '[]', '[]');
INSERT INTO section_question VALUES ('1b4f110b-fea3-444f-b52c-c85008cf3b50', '80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e4', 1, '[]', '[]');

INSERT INTO section_question VALUES ('e2b23c21-32cc-4423-9363-61887abe29c7', '8a364184-42ac-48fe-b831-acb2eb08c730', 0, '[]', '[]');
INSERT INTO section_question VALUES ('e2b23c21-32cc-4423-9363-61887abe29c7', '4ecc885f-daf8-4bc6-a8cd-d30c2a54d731', 1, '[]', '[]');
INSERT INTO section_question VALUES ('e2b23c21-32cc-4423-9363-61887abe29c7', '4ecc885f-daf8-4bc6-a8cd-d30c2a54d732', 2, '[]', '[]');
INSERT INTO section_question VALUES ('e2b23c21-32cc-4423-9363-61887abe29c7', '4ecc885f-daf8-4bc6-a8cd-d30c2a54d733', 3, '[]', '[]');

INSERT INTO section_question VALUES ('7c9e2f41-3d85-4f7a-a2c1-9b8d4f6e2a77', '4ecc885f-daf8-4bc6-a8cd-d30c2a54d734', 0, '[]', '[]');
INSERT INTO section_question VALUES ('7c9e2f41-3d85-4f7a-a2c1-9b8d4f6e2a77', '4ecc885f-daf8-4bc6-a8cd-d30c2a54d735', 1, '[]', '[]');
INSERT INTO section_question VALUES ('7c9e2f41-3d85-4f7a-a2c1-9b8d4f6e2a77', '4ecc885f-daf8-4bc6-a8cd-d30c2a54d736', 2, '[]', '[]');
INSERT INTO section_question VALUES ('7c9e2f41-3d85-4f7a-a2c1-9b8d4f6e2a77', '4ecc885f-daf8-4bc6-a8cd-d30c2a54d737', 3, '[]', '[]');
INSERT INTO section_question VALUES ('7c9e2f41-3d85-4f7a-a2c1-9b8d4f6e2a77', '4ecc885f-daf8-4bc6-a8cd-d30c2a54d738', 4, '[]', '[]');
INSERT INTO section_question VALUES ('7c9e2f41-3d85-4f7a-a2c1-9b8d4f6e2a77', '4ecc885f-daf8-4bc6-a8cd-d30c2a54d739', 5, '[]', '[]');
INSERT INTO section_question VALUES ('7c9e2f41-3d85-4f7a-a2c1-9b8d4f6e2a77', '4ecc885f-daf8-4bc6-a8cd-d30c2a54d740', 6, '[]', '[]');

INSERT INTO section_question VALUES ('2ba04d20-5473-42b7-907c-10ef384f90c8', '50e8d566-b9ab-4bd9-9adc-92a3c8fb5d28', 0, '[]', '[]');

UPDATE input
SET enums = '[{"key":"data_product_name","label":"Name of data product: How do you refer to the data product?","type":"text","editable":true},
              {"key":"data_prod_timeline","label":"Data Production Timeline: Include the start date and when do you expect data production to be complete.","type":"text","editable":true},
              {"key":"data_prod_volume","label":"Data Product Volume: What is the estimated or actual total volume of the data product upon completion of production?","type":"text","editable":true},
              {"key":"instrument_collect_data","label":"Instrument: What instrument  is used to collect data?","type":"text","editable":true},
              {"key":"data_prod_doi","label":"Data Product DOI(s): If applicable, for any existing Data Products. Do not list any journal article DOI''s here.","type":"text","editable":true},
              {"key":"data_prod_grid","label":"Gridded Data Product?","type":"text","editable":true},
              {"key":"data_prod_file_format","label":"Data Product File Format","type":"text","editable":true},
              {"key":"data_prod_granule","label":"Data Product Granule/File Size","type":"text","editable":true},
              {"key":"data_prod_params","label":"Data Product Parameters/Science Variables: List all parameters/science variable names found within each data product.","type":"text","editable":true},
              {"key":"data_prod_temporal_coverage","label":"Data Product Temporal Coverage and Resolution","type":"text","editable":true},
              {"key":"data_prod_spatial_coverage","label":"Spatial Coverage and Resolution","type":"text","editable":true},
              {"key":"data_prod_ingest_frequency","label":"Ingest Frequency: List how often each Data Product will be delivered","type":"text","editable":true},
              {"key":"data_prod_comments","label":"Comments","type":"text","editable":true}]'
WHERE question_id = '50e8d566-b9ab-4bd9-9adc-92a3c8fb5d35'
  AND control_id = 'dar_form_data_producers_table';

-- new table added EDPUB-1524
CREATE TABLE IF NOT EXISTS temp_upload_file (
  file_id UUID PRIMARY KEY,                  
  submission_id UUID NOT NULL,          
  file_name VARCHAR,
  category VARCHAR,
  size BIGINT,
  lastmodified TIMESTAMP NOT NULL DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'Scanning',
  FOREIGN KEY (submission_id) REFERENCES submission (id)
);

-- EDPUB-1729: Remove wording restricting uploads to < 5GB 
UPDATE question
SET help = 'Providing sample data files that are representative of the range of data within this data product will help the DAAC understand and provide feedback on the data format, structure, and content. If more than 5 sample data files are necessary to represent the data product, please contact the DAAC for assistance. Files cannot include .exe or .dll extensions.'
WHERE id = '53a0faa7-f7d4-4ce9-a9dc-a13cef44e1f3';

UPDATE question
SET help = 'For example, these documents may include descriptions of the variables, filename conventions, processing steps, and/or data quality. If you have more than 5 documents, please contact the DAAC for assistance. Files cannot include .exe or .dll extensions.'
WHERE id = 'ad568b2f-89fe-4afd-a0bf-9e5832b71ce9';

UPDATE question
SET help = 'Providing sample data files that are representative of the range of data within this data product will help the DAAC understand and provide feedback on the data format, structure, and content. If more than 5 sample data files are necessary to represent the data product, please contact the DAAC for assistance. Files cannot include .exe or .dll extensions.'
WHERE id = '9f3d4e12-7b29-45ce-bf21-6c018b9d6f54';

UPDATE question
SET help = 'If there are other documents you would like us to consider, please upload those here as well. For example, these documents may include descriptions of your data, data quality, processing methods, or instruments. Files cannot include .exe or .dll extensions.'
WHERE id = '4ecc885f-daf8-4bc6-a8cd-d30c2a54d740';

UPDATE upload_step
SET help_text = 'Please provide a cost model file. Files cannot include .exe or .dll extensions.'
WHERE step_name = 'cost_model' AND upload_destination = 'DAR_Uploads' AND category_type = 'cost_model';