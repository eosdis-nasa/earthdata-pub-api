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
--this should not be run untill after the db's have been cleaned of duplicat entries as document in the closing of EDPUB-785
--ALTER TABLE edpuser
--ADD CONSTRAINT email_unique UNIQUE (email);

--2/15/2022 adds entry for tracking level of detail
    ALTER TABLE edpuser ADD detailed BOOLEAN DEFAULT 'false';

    UPDATE question SET text='What file format(s) does this data product include?' where id='50e8d566-b9ab-4bd9-9adc-92a3c8fb5d27';
    UPDATE question SET help='Providing sample data files that are representative of the range of data within this data product will help the DAAC understand and provide feedback on the data format, structure, and content.' where id='53a0faa7-f7d4-4ce9-a9dc-a13cef44e1f3';

    -- Remove checkbox for table DOI, doi changing from array of values to single string
    -- INSERT INTO question VALUES ('c3af2edf-d912-40ce-990d-e8b4f86d1ad3', 'data_product_doi', 2, 'Data Product DOI', 'If a Digital Object Identifier (DOI) already exists for this data product (not common), please provide it.', 'This would be a DOI for the actual data and not for a paper related to this data product. The DAAC will create the data product DOI during data publication. Therefore, the DAAC needs to know if a data product DOI already exists.');
    -- INSERT INTO input VALUES ('c3af2edf-d912-40ce-990d-e8b4f86d1ad3', 'data_product_doi_value', 0, 'DOI', 'text', '{}', '{}', '[]','[]',  False);
    -- INSERT INTO section_question VALUES ('049e63e8-018d-4c3f-96f1-80c73e0f4287', 'c3af2edf-d912-40ce-990d-e8b4f86d1ad3', 2, '[]', '[]');
    -- INSERT INTO section_question VALUES ('768a6b51-4864-458c-b20d-fb8b4c7dc606', 'c3af2edf-d912-40ce-990d-e8b4f86d1ad3', 2, '[]', '[]');
    UPDATE question SET text='If a Digital Object Identifier (DOI) already exists for this data product (not common), please provide it.' where id='c9c73e88-837a-42d2-aa1a-50874a333607';
    UPDATE question SET help='This would be a DOI for the actual data and not for a paper related to this data product. The DAAC will create the data product DOI during data publication. Therefore, the DAAC needs to know if a data product DOI already exists.' where id='c9c73e88-837a-42d2-aa1a-50874a333607';
    
    UPDATE edprole SET description='The person who is primarily responsible for the data themselves. Often the PI of the project that generated the data. This role will be able to create a Request and edit their created or assigned Requests.' where id='804b335c-f191-4d26-9b98-1ec1cb62b97d';
    UPDATE edprole SET description='The person who is filling out the Earthdata Pub Forms and expected to answer questions about the Request. Can be the same as the DP and has the same permissions as a DP.' where id='29ccab4b-65e2-4764-83ec-77375d29af39';
    UPDATE edprole SET description='The DAAC staff member who guides the Request through Earthdata Pub workflows and iterates with the PoC on questions. This role will be able to add and edit requests.' where id='a5b4947a-67d2-434e-9889-59c2fad39676';
    UPDATE edprole SET description='The DAAC staff member who manages all DAAC Requests. Managers assign a Request to Staff. There may be multiple DAAC Data Managers per DAAC. Some DAACs may choose to combine the Manager and Staff roles by assigning staff to both.' where id='2aa89c57-85f1-4611-812d-b6760bb6295c';

--3/7/2023 Update reassign permissions
INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'REQUEST_REASSIGN');
    UPDATE question SET long_name='Science Value' where id='7fd7bccf-5065-4033-9956-9e80bc99c205';

--3/7/2023 Update reassign permissions
INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'REQUEST_REASSIGN');

-- 4/4/2023 Updates idealized workflow to Example workflow and makes it the default workflow for DAAC's without a workflow
UPDATE workflow SET short_name= 'example_workflow', long_name='Example Workflow' WHERE id = 'c1690729-b67e-4675-a1a5-b2323f347dff';
UPDATE daac SET workflow_id = 'c1690729-b67e-4675-a1a5-b2323f347dff' WHERE workflow_id = '056ca100-107e-4fe5-a54a-e5f2d902a27a' AND short_name != 'Unknown';
