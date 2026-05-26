-- Base set of users for testing
INSERT INTO edpuser(id, name, email) VALUES ('b753d4f2-52b8-4224-8036-03a8f9dcf9a1', 'ORNL_DS', 'ds@ornl.gov');
INSERT INTO edpuser_edpgroup VALUES ('b753d4f2-52b8-4224-8036-03a8f9dcf9a1', '89816689-5375-4c81-a30c-bf6ed12d30fb');
INSERT INTO edpuser_edprole VALUES ('b753d4f2-52b8-4224-8036-03a8f9dcf9a1', 'a5b4947a-67d2-434e-9889-59c2fad39676');

INSERT INTO edpuser(id, name, email) VALUES ('8b52fc38-e03c-4c4f-8ef7-94d96002e8fc', 'EXAMPLE_DM', 'dm@example.gov');
INSERT INTO edpuser_edpgroup VALUES ('8b52fc38-e03c-4c4f-8ef7-94d96002e8fc', '8edd07a0-34e1-45c7-a2c1-7fc9ae884030');
INSERT INTO edpuser_edprole VALUES ('8b52fc38-e03c-4c4f-8ef7-94d96002e8fc', '2aa89c57-85f1-4611-812d-b6760bb6295c');

INSERT INTO edpuser(id, name, email) VALUES ('229d4527-ac79-4784-969c-2820b28c3f9f', 'ROOT_Observer', 'observer@nasa.gov');
INSERT INTO edpuser_edpgroup VALUES ('229d4527-ac79-4784-969c-2820b28c3f9f', '4daa6b22-f015-4ce2-8dac-8b3510004fca');
INSERT INTO edpuser_edprole VALUES ('229d4527-ac79-4784-969c-2820b28c3f9f', '4be6ca4d-6362-478b-8478-487a668314b1');

INSERT INTO edpuser(id, name, email) VALUES ('12afacf8-fae8-4b13-83c3-7d332732a291', 'NO_DAAC_DP', 'dp@gmail.com');
INSERT INTO edpuser_edpgroup VALUES ('12afacf8-fae8-4b13-83c3-7d332732a291', '5be24b44-d66b-4396-9266-a9d066000d9e');
INSERT INTO edpuser_edprole VALUES ('12afacf8-fae8-4b13-83c3-7d332732a291', '804b335c-f191-4d26-9b98-1ec1cb62b97d');

INSERT INTO edpuser(id, name, email) VALUES ('db85c3fc-9d05-4749-81a2-3f028e11644f', 'GESDISC_UWG', 'uwg@gmail.com');
INSERT INTO edpuser_edpgroup VALUES ('db85c3fc-9d05-4749-81a2-3f028e11644f', '2385734f-f834-41dc-946c-11e23af6f3d6');
INSERT INTO edpuser_edprole VALUES ('db85c3fc-9d05-4749-81a2-3f028e11644f', '19ac227b-e96c-46fa-a378-cf82c461b669');


-- Test Users for manipulation
INSERT INTO edpuser(id, name, email) VALUES ('5e711da9-913f-4752-a4de-98d53c206b65', 'ADMIN_Test_User', 'admin_test@gmail.com');
INSERT INTO edpuser(id, name, email) VALUES ('5e711da9-913f-4752-a4de-98d53c206b66', 'DS_Test_User', 'ds_test@gmail.com');
INSERT INTO edpuser(id, name, email) VALUES ('5e711da9-913f-4752-a4de-98d53c206b67', 'DM_Test_User', 'dm_test@gmail.com');
INSERT INTO edpuser(id, name, email) VALUES ('5e711da9-913f-4752-a4de-98d53c206b68', 'Observer_Test_User', 'ob_test@gmail.com');
INSERT INTO edpuser(id, name, email) VALUES ('5e711da9-913f-4752-a4de-98d53c206b69', 'UWG_Test_User', 'uwg_test@gmail.com');
INSERT INTO edpuser(id, name, email) VALUES ('5e711da9-913f-4752-a4de-98d53c206b70', 'DP_Test_User', 'dp_test@gmail.com');

-- Populate Code table with an example legacy code
INSERT INTO code(code, daac_id) VALUES ('dbd5f648-77a0-4379-a5b4-438358881bdc', 'cdccdd71-cbe2-4220-8569-a6355ea24f3f');

-- Add a test for form manipulation
INSERT INTO form VALUES ('255c1b91-4631-467a-9512-1558dc80231a', 'test', 1, 'Test', 'This is a TEST');
INSERT INTO section VALUES ('b1858733-5f55-44a5-adc2-84a66f6e9585', '255c1b91-4631-467a-9512-1558dc80231a', 'Section 0', 0);
INSERT INTO section VALUES ('b9393787-c708-4038-a518-000a4f308728', '255c1b91-4631-467a-9512-1558dc80231a', 'Section 1', 1);
INSERT INTO question VALUES ('549b4e0c-e2ff-49a6-8f9d-a6e9968ffd7e', 'test_question_1', 1, 'Test Question 1', 'What question should we ask', 'The question you would like asked here');
INSERT INTO input VALUES ('549b4e0c-e2ff-49a6-8f9d-a6e9968ffd7e', 'test_input_A', 0, 'A', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('549b4e0c-e2ff-49a6-8f9d-a6e9968ffd7e', 'test_input_B', 1, 'B', 'checkbox', '{}', '{}', '[]','[]',  False);


-- Active Submission, No DAAC
INSERT INTO conversation(id) VALUES('48cf6150-9885-4fdb-8b27-9240e7a2ebce');
INSERT INTO submission(id, name, initiator_edpuser_id, conversation_id, contributor_ids) VALUES('18ae776a-12ba-4d73-8799-816e1e143e15', 'Submission A', '12afacf8-fae8-4b13-83c3-7d332732a291', '48cf6150-9885-4fdb-8b27-9240e7a2ebce', '{"12afacf8-fae8-4b13-83c3-7d332732a291"}');

-- Inactive Submission, No DAAC
INSERT INTO conversation(id) VALUES('48cf6150-9885-4fdb-8b27-9240e7a2ebcf');
INSERT INTO submission(id, name, initiator_edpuser_id, conversation_id, contributor_ids, hidden) VALUES('18ae776a-12ba-4d73-8799-816e1e143e16', 'Submission B', '12afacf8-fae8-4b13-83c3-7d332732a291', '48cf6150-9885-4fdb-8b27-9240e7a2ebcf', '{"12afacf8-fae8-4b13-83c3-7d332732a291"}', true);

-- Active Submission, GESDISC
INSERT INTO conversation(id) VALUES('48cf6150-9885-4fdb-8b27-9240e7a2ecce');
INSERT INTO submission(id, name, initiator_edpuser_id, conversation_id, contributor_ids,  daac_id) VALUES('18ae776a-12ba-4d73-8799-816e1e143e17', 'Submission C', '12afacf8-fae8-4b13-83c3-7d332732a291', '48cf6150-9885-4fdb-8b27-9240e7a2ecce', '{"12afacf8-fae8-4b13-83c3-7d332732a291"}', '1ea1da68-cb95-431f-8dd8-a2cf16d7ef98');

-- Inactive Submission, ORNL
INSERT INTO conversation(id) VALUES('9e139373-13bd-47da-92e9-ab4aad5a74eb');
INSERT INTO submission(id, name, initiator_edpuser_id, conversation_id, contributor_ids, daac_id, hidden) VALUES('18ae776a-12ba-4d73-8799-816e1e143e18', 'Submission D', '12afacf8-fae8-4b13-83c3-7d332732a291', '9e139373-13bd-47da-92e9-ab4aad5a74eb', '{"12afacf8-fae8-4b13-83c3-7d332732a291"}', '15df4fda-ed0d-417f-9124-558fb5e5b561', true);

-- Active Submission, Example
INSERT INTO conversation(id) VALUES('9e139373-13bd-47da-82e9-ab4aad5a74eb');
INSERT INTO submission(id, name, initiator_edpuser_id, conversation_id, contributor_ids, daac_id) VALUES('18ae776a-12ba-4d73-8799-816e1e143e19', 'Submission E', '12afacf8-fae8-4b13-83c3-7d332732a291', '9e139373-13bd-47da-82e9-ab4aad5a74eb', '{"12afacf8-fae8-4b13-83c3-7d332732a291"}', 'cdccdd71-cbe2-4220-8569-a6355ea24f3f');
