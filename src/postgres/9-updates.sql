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

-- 5/18/2023 Adds support for SES and step messages
-- ALTER TABLE step ADD notification TEXT DEFAULT '';

-- UPDATE question SET help='If a data file represents a single point in time, meaning the start and end times of the file would be identical, choose "Instantaneous". If the temporal coverage cannot be reasonably represented by a single value, choose "Varies".' where id='91c123bf-702e-458c-90a1-b26f6498937e';
-- UPDATE input SET enums='["Minute(s)","Hour(s)","Day(s)","Week(s)","Month(s)","Year(s)","Instantaneous","Varies"]' where id='91c123bf-702e-458c-90a1-b26f6498937e'

-- UPDATE question SET long_name='Ongoing Data Production', text='After this data product has been published at the DAAC, will you continue to collect or produce new data files to extend the temporal coverage?' where id='dbf70495-433a-439e-8173-0cb20f972c16';
-- UPDATE question SET help='The temporal coverage should encompass the beginning date of the first data file and the ending date of the last data file at the time of initial delivery to the DAAC, even if there are time gaps or data production will be ongoing.' where id='4f2dd369-d865-47ba-8504-8694493f129f';

-- 5/26/2023 Adds support for querryiing notes by step
-- ALTER TABLE note ADD step_name VARCHAR;
-- ALTER TABLE note ADD FOREIGN KEY (step_name) REFERENCES step(step_name);

-- UPDATE question SET long_name='Data Product Spatial Coverage' where id='228cb0d6-78fb-449a-8061-b1e6fb3f59d1';
-- UPDATE question SET long_name='Data Product Temporal Coverage' where id='4f2dd369-d865-47ba-8504-8694493f129f';
-- UPDATE question SET long_name='Data Value Temporal Resolution' where id='4f2dd369-d865-47ba-8504-8694493f139f';
-- UPDATE question SET long_name='Data Product Horizontal Spatial Coverage' where id='15a012d0-9b4b-4979-9fa9-81fac1600b09';
-- UPDATE question SET long_name='Data Product Vertical Spatial Coverage' where id='0f640f21-37ec-4d04-af2c-da955ae98e12';
-- UPDATE question SET long_name='Data Value Spatial Resolution' where id='a12ccd39-1d94-46a5-8aad-3587fd50c4ad';
-- UPDATE input SET label='Data Value Spatial Resolution' where id='a12ccd39-1d94-46a5-8aad-3587fd50c4ad';
-- UPDATE question SET long_name='Additional Temporal Information', text='Is there any additional temporal information that will help the DAAC understand this data product?', help='Examples of useful temporal information include: seasonal data; data covering multiple, individual deployments; significant gaps in instrument operation; data from transit/ferry flights included.' where id='4f2dd369-d865-47ba-8504-8694493f128f';
-- UPDATE question SET help='If more than three distinct spatial coverage bounding boxes exist for this data product, please add a comment to the Additional Spatial Information.' where id='15a012d0-9b4b-4979-9fa9-81fac1600b09';
-- UPDATE question SET help='Please provide any additional details needed to understand what these numbers mean in the Additional Spatial Information. For example, the point of reference for the values given in the vertical spatial coverage.' where id='a3701d37-77cf-4ccc-8068-c6860a7a8929';
-- UPDATE question SET long_name='Additional Spatial Information', text='Is there any additional spatial information that will help the DAAC understand this data product?', help='' where id='d1ef0a6f-284e-40a7-9248-75dd8f1f0ded';
-- UPDATE question SET help='Please provide the nominal size of the geographic area covered by a single data value. For example: 25 km at nadir; a 0.25 degree x 0.25 degree grid cell at the equator; points along a path; a 10 km x 10 km x 5 km radar slice. If the spatial resolution varies for data values, you can list "varies". If a spatial resolution is not applicable, you can list "not applicable."' where id='a12ccd39-1d94-46a5-8aad-3587fd50c4ad';
-- UPDATE question SET help='If a data file represents a single point in time, meaning the start and end times of the file would be identical, choose "Instantaneous". If the temporal coverage cannot be reasonably represented by a single value, choose "Varies".' where id='91c123bf-702e-458c-90a1-b26f6498937e';
-- UPDATE input SET enums='["Minute(s)","Hour(s)","Day(s)","Week(s)","Month(s)","Year(s)","Instantaneous","Varies"]' where id='91c123bf-702e-458c-90a1-b26f6498937e'
-- UPDATE question SET long_name='Ongoing Data Production', text='After this data product has been published at the DAAC, will you continue to collect or produce new data files to extend the temporal coverage?' where id='dbf70495-433a-439e-8173-0cb20f972c16';
-- UPDATE question SET help='The temporal coverage should encompass the beginning date of the first data file and the ending date of the last data file at the time of initial delivery to the DAAC, even if there are time gaps or data production will be ongoing.' where id='4f2dd369-d865-47ba-8504-8694493f129f';
-- UPDATE question SET long_name='Data Product Spatial Region' where id='228cb0d6-78fb-449a-8061-b1e6fb3f59d1';


-- 7/5/2023 Adds step_message to step_edge for suppor of step notifications and removes notification from step
    ALTER TABLE step_edge ADD step_message TEXT DEFAULT '';
    ALTER TABLE step DROP COLUMN notification;

-- 7/12/2023 Added department to contact information
    UPDATE input set list_order=4 where question_id = '80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e2' and control_id='data_producer_info_orcid';
    UPDATE input set list_order=3 where question_id = '80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e2' and control_id='data_producer_info_email';
    INSERT INTO input VALUES ('80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e2', 'data_producer_info_department', 2, 'Department', 'text', '{}', '{}', '[]','[]',  False);
    
    UPDATE input set list_order=4 where question_id = 'f3e2eab9-6375-4e53-9cc2-3d16f318d333' and control_id='poc_orcid';
    UPDATE input set list_order=3 where question_id = 'f3e2eab9-6375-4e53-9cc2-3d16f318d333' and control_id='poc_email';
    INSERT INTO input VALUES ('f3e2eab9-6375-4e53-9cc2-3d16f318d333', 'poc_department', 2, 'Department', 'text', '{}', '{}', '[]','[]',  False);

    UPDATE input set list_order=4 where question_id = 'f3e2eab9-6375-4e53-9cc2-3d16f318d332' and control_id='long_term_support_poc_orcid';
    UPDATE input set list_order=3 where question_id = 'f3e2eab9-6375-4e53-9cc2-3d16f318d332' and control_id='long_term_support_poc_email';
    INSERT INTO input VALUES ('f3e2eab9-6375-4e53-9cc2-3d16f318d332', 'long_term_support_poc_department', 2, 'Department', 'text', '{}', '{}', '[]','[]',  False);

--7/26/2023 Adds privilages for group data upload
    DELETE FROM privilege WHERE privilege = 'DAAC_UPLOAD';
    DELETE FROM edprole_privilege WHERE privilege = 'DAAC_UPLOAD';
    INSERT INTO privilege VALUES ('GROUP_UPLOAD');
    INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'GROUP_UPLOAD');
    INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'GROUP_UPLOAD');
-- 8/24/2023 Update workflow permissions
    INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'WORKFLOW_CREATE');
    INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'WORKFLOW_READ');
    INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'WORKFLOW_UPDATE');
    INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'WORKFLOW_DELETE');

-- 10/12/2023 Add sub-daily to question options
    -- Input(question_id, control_id, list_order, label, type, enums, attributes, required_if, show_if, required))
    UPDATE input set enums='["Sub-Daily","Daily","Weekly","Monthly","Quarterly","Yearly","Varies"]' where question_id='4c42796a-8ff1-444e-8fc5-82ccad82e5fb'