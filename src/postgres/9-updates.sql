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
INSERT INTO privilege VALUES ('QUESTION_CREATE');
INSERT INTO privilege VALUES ('QUESTION_READ');
INSERT INTO privilege VALUES ('QUESTION_UPDATE');
INSERT INTO privilege VALUES ('QUESTION_DELETE');

--11/28/22 Add contributor_id colum
ALTER TABLE submission ADD COLUMN contributor_ids UUID[];
UPDATE submission SET contributor_ids = array_append(submission.contributor_ids, submission.initiator_edpuser_id);

--12/15/2022 Add new permsissions for adding and removing a user from a submission to daac data manager
INSERT INTO privilege VALUES ('REQUEST_ADDUSER');
INSERT INTO privilege VALUES ('REQUEST_REMOVEUSER');
INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'REQUEST_ADDUSER');
INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'REQUEST_REMOVEUSER');

--12/16/2022 adds requirement for each user to have a unique email
--this should not be run untill after the db's have been cleaned of duplicat entries as document in the closing of EDPUB-785
--ALTER TABLE edpuser
--ADD CONSTRAINT email_unique UNIQUE (email);

<<<<<<< HEAD
--1/27/2023  replaces the existing form data storage with new data_pool table to make all forms
--resopnoses of a given request update together.

CREATE TABLE IF NOT EXISTS submission_form_data_pool (
  id UUID NOT NULL,
  data JSONB DEFAULT '{}'::JSONB,
  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES submission (id)
);

DO $$
DECLARE
subId UUID;
BEGIN
    FOR subId IN
        SELECT submission.id FROM submission
    LOOP
    IF 'de7e5c40-584a-493b-919d-8f7f3f1e9e3c'::UUID IN (SELECT form_id FROM submission_form_data WHERE id = subID) THEN 
        INSERT INTO submission_form_data_pool(id, data)
        VALUES (subId, (SELECT data FROM submission_form_data WHERE id = subId AND form_id = 'de7e5c40-584a-493b-919d-8f7f3f1e9e3c')::JSONB);
    ELSIF '19025579-99ca-4344-8610-704dae626343'::UUID IN (SELECT form_id FROM submission_form_data WHERE id = subID) THEN
        INSERT INTO submission_form_data_pool(id, data)
        VALUES (subId, (SELECT data FROM submission_form_data WHERE id = subId AND form_id = '19025579-99ca-4344-8610-704dae626343')::JSONB);
    ELSIF '6c544723-241c-4896-a38c-adbc0a364293'::UUID IN (SELECT form_id FROM submission_form_data WHERE id = subID) THEN
        INSERT INTO submission_form_data_pool(id, data)
        VALUES (subId, (SELECT data FROM submission_form_data WHERE id = subId AND form_id = '6c544723-241c-4896-a38c-adbc0a364293')::JSONB);
    END IF;
    END LOOP;
END $$;

ALTER TABLE submission_form_data DROP COLUMN data;
ALTER TABLE submission_form_data ADD COLUMN data UUID;
ALTER TABLE submission_form_data 
    ADD CONSTRAINT submission_form_data_data_fkey FOREIGN KEY (data) REFERENCES submission_form_data_pool (id);
UPDATE submission_form_data  SET data = submission_form_data.id;
=======

--1/12/2023 addes table to track copied submissions
CREATE TABLE IF NOT EXISTS submission_copy (
  id UUID NOT NULL,
  edpuser_id UUID NOT NULL,
  origin_id UUID NOT NULL,
  context VARCHAR DEFAULT 'none',
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES submission (id),
  FOREIGN KEY (origin_id) REFERENCES submission (id),
  FOREIGN KEY (edpuser_id) REFERENCES edpuser (id)
);
>>>>>>> 9b483ab156e0737b618985ff73629a5946871e7e
