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

-- 8/6/24 Add ORNL service trigger to ORNL workflow
INSERT INTO service(id, short_name, long_name, description, endpoint, options, headers, method, code, payload) VALUES ('f33f9ce5-e402-4823-8847-f380d1b7789b', 'ornl_service', 'ORNL On-Prem Service', 'ORNL Service used for syncing data between EDPub and on-prem systems', 'https://pub.uat.earthdata.nasa.gov/api/data/daac/offboard', '{}', '{"Authorization": "ornl_service_authorization_secret"}', 'POST', 200, false);
INSERT INTO step(step_id, step_name, type, service_id) VALUES ('62c8a133-4af7-4d41-8174-179ffbe81d3f','ornl_service_trigger','service','f33f9ce5-e402-4823-8847-f380d1b7789b');
UPDATE step_edge SET next_step_name='ornl_service_trigger' WHERE workflow_id='a218f99d-cfc1-44e5-b203-3e447e1c1275' AND step_name='init';
INSERT INTO step_edge VALUES ('a218f99d-cfc1-44e5-b203-3e447e1c1275', 'ornl_service_trigger', 'data_accession_request_form');

ALTER TABLE service_secret DROP CONSTRAINT service_secret_pkey;
ALTER TABLE service_secret ADD PRIMARY KEY (id, submission_id);