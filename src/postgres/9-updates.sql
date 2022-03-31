-- This file is used to update existing DBs. If you are deploying from scratch,
-- this file will error out; however, this won't be an issue because all lines of
-- this file should be captured in 7-seed.sql


-- EXAMPLES
-- Create table if not exists:
--     CREATE TABLE IF NOT EXISTS table_name (column_name data_type column_constraint, table_constraint);
-- Add column with default value:
--     ALTER TABLE table_name ADD column_name data_type DEFAULT default_value;
-- Add unique constraint:
--     ALTER TABLE table_name ADD UNIQUE (unique_column_one, unique_column_two);
-- Update db content
--     UPDATE table_name SET column_name = 'value' WHERE condition;
-- Simple addition to db seed
--     INSERT INTO table_name (column_name) VALUES ('actual_value')
-- Delete row from table:
---    DELETE FROM table_name WHERE column_name = 'actual_value';

-- 2/17/22
-- DB Schema Updates
ALTER TABLE section ADD daac_id UUID DEFAULT NULL;
ALTER TABLE section_question ADD UNIQUE (section_id, question_id);
ALTER TABLE submission ADD hidden BOOLEAN DEFAULT FALSE;
-- DB Seed Updates
INSERT INTO section VALUES ('608df644-d1ed-4aa4-9bb9-4907f3e9ce9d', '6c544723-241c-4896-a38c-adbc0a364293', 'ASDC Additional Questions', 4, '[]', '[]', '40397fe8-4841-4e4c-b84a-6ece359ff5ff');
INSERT INTO section VALUES ('30727449-9617-4765-83b0-d4637936710d', '6c544723-241c-4896-a38c-adbc0a364293', 'ASF DAAC Additional Questions', 5, '[]', '[]', 'c606afba-725b-4ae4-9557-1fd33260ae12');
INSERT INTO section VALUES ('a9e1a611-9435-4f21-b074-09b9f502e79c', '6c544723-241c-4896-a38c-adbc0a364293', 'CDDIS Additional Questions', 6, '[]', '[]', 'd551380f-8813-40e4-9763-2a5bb6007cd0');
INSERT INTO section VALUES ('caaa6d32-0bd5-45a9-8511-defca7405dcb', '6c544723-241c-4896-a38c-adbc0a364293', 'GES DISC Additional Questions', 7, '[]', '[]', '1ea1da68-cb95-431f-8dd8-a2cf16d7ef98');
INSERT INTO section VALUES ('5d30eb76-631e-4591-9782-8422250cd89e', '6c544723-241c-4896-a38c-adbc0a364293', 'GHRC DAAC Additional Questions', 8, '[]', '[]', 'ef229725-1cad-485e-a72b-a276d2ca3175');
INSERT INTO section VALUES ('3095e7ac-25be-4bd2-a5cd-47de253d06af', '6c544723-241c-4896-a38c-adbc0a364293', 'LAADS DAAC Additional Questions', 9, '[]', '[]', '9e0628f1-0dde-4ed2-b1e3-690c70326f25');
INSERT INTO section VALUES ('ec1fbb1e-8d4d-4646-a20c-b5fb68135403', '6c544723-241c-4896-a38c-adbc0a364293', 'LP DAAC Additional Questions', 10, '[]', '[]', 'de6d5ec9-4728-4f2b-9d43-ae2f0fdac96a');
INSERT INTO section VALUES ('11bac86a-b284-47b3-aaee-855859f56c0a', '6c544723-241c-4896-a38c-adbc0a364293', 'NSIDC DAAC Additional Questions', 11, '[]', '[]', 'aec3724f-b30b-4b3f-9b9a-e0907d9d14b3');
INSERT INTO section VALUES ('bd4fe63a-ba32-475b-a665-e593dd2d6916', '6c544723-241c-4896-a38c-adbc0a364293', 'OB.DAAC Additional Questions', 12, '[]', '[]', 'fe75c306-ac04-4689-a702-073d9cb071fe');
INSERT INTO section VALUES ('a02e43ac-80e8-422e-b2aa-639b2a1da64a', '6c544723-241c-4896-a38c-adbc0a364293', 'ORNL DAAC Additional Questions', 13, '[]', '[]', '15df4fda-ed0d-417f-9124-558fb5e5b561');
INSERT INTO section VALUES ('a2d9ec2b-7e78-427f-ab2e-6f9c8405b79e', '6c544723-241c-4896-a38c-adbc0a364293', 'PO.DAAC Additional Questions', 14, '[]', '[]', '6b3ea184-57c5-4fc5-a91b-e49708f91b67');
INSERT INTO section VALUES ('e738f09c-6982-4ec1-a0e0-916b1f5645ab', '6c544723-241c-4896-a38c-adbc0a364293', 'SEDAC Additional Questions', 15, '[]', '[]', '00dcf32a-a4e2-4e55-a0d1-3a74cf100ca1');
INSERT INTO section VALUES ('db348a3a-7fb9-40f2-bfae-d880d49c66c1', '19025579-99ca-4344-8610-704dae626343', 'ASDC Additional Questions', 6, '[]', '[]', '40397fe8-4841-4e4c-b84a-6ece359ff5ff');
INSERT INTO section VALUES ('0223fe8a-6e0e-4293-9073-e3b798960bfb', '19025579-99ca-4344-8610-704dae626343', 'ASF DAAC Additional Questions', 7, '[]', '[]', 'c606afba-725b-4ae4-9557-1fd33260ae12');
INSERT INTO section VALUES ('43bc4337-f466-47cd-b9b3-4ab8da0ff98c', '19025579-99ca-4344-8610-704dae626343', 'CDDIS Additional Questions', 8, '[]', '[]', 'd551380f-8813-40e4-9763-2a5bb6007cd0');
INSERT INTO section VALUES ('a4918561-3d8d-4ec4-8497-83fc8dff8243', '19025579-99ca-4344-8610-704dae626343', 'GES DISC Additional Questions', 9, '[]', '[]', '1ea1da68-cb95-431f-8dd8-a2cf16d7ef98');
INSERT INTO section VALUES ('8a06b48b-86f8-47f0-8820-8f5d34676f24', '19025579-99ca-4344-8610-704dae626343', 'GHRC DAAC Additional Questions', 10, '[]', '[]', 'ef229725-1cad-485e-a72b-a276d2ca3175');
INSERT INTO section VALUES ('fb649495-b571-4b96-945d-7e2e032c5338', '19025579-99ca-4344-8610-704dae626343', 'LAADS DAAC Additional Questions', 11, '[]', '[]', '9e0628f1-0dde-4ed2-b1e3-690c70326f25');
INSERT INTO section VALUES ('a8a1a34f-aee2-4cbc-9229-1d6c7cf33a75', '19025579-99ca-4344-8610-704dae626343', 'LP DAAC Additional Questions', 12, '[]', '[]', 'de6d5ec9-4728-4f2b-9d43-ae2f0fdac96a');
INSERT INTO section VALUES ('6ab97eca-0641-44f2-a317-9b50d1375a05', '19025579-99ca-4344-8610-704dae626343', 'NSIDC DAAC Additional Questions', 13, '[]', '[]', 'aec3724f-b30b-4b3f-9b9a-e0907d9d14b3');
INSERT INTO section VALUES ('36d021d3-c527-419b-9b77-a48d535c12a8', '19025579-99ca-4344-8610-704dae626343', 'OB.DAAC Additional Questions', 14, '[]', '[]', 'fe75c306-ac04-4689-a702-073d9cb071fe');
INSERT INTO section VALUES ('f1a2136a-7245-4462-a175-40164db59c7b', '19025579-99ca-4344-8610-704dae626343', 'ORNL DAAC Additional Questions', 15, '[]', '[]', '15df4fda-ed0d-417f-9124-558fb5e5b561');
INSERT INTO section VALUES ('0f6771e5-a6e4-4f19-ac85-cc48f526c146', '19025579-99ca-4344-8610-704dae626343', 'PO.DAAC Additional Questions', 16, '[]', '[]', '6b3ea184-57c5-4fc5-a91b-e49708f91b67');
INSERT INTO section VALUES ('e9675ba5-e494-4275-8778-cd3fa68371e3', '19025579-99ca-4344-8610-704dae626343', 'SEDAC Additional Questions', 17, '[]', '[]', '00dcf32a-a4e2-4e55-a0d1-3a74cf100ca1');
INSERT INTO edprole_privilege VALUES ('804b335c-f191-4d26-9b98-1ec1cb62b97d', 'FORM_CREATE');
INSERT INTO edprole_privilege VALUES ('804b335c-f191-4d26-9b98-1ec1cb62b97d', 'FORM_UPDATE');
INSERT INTO edprole_privilege VALUES ('804b335c-f191-4d26-9b98-1ec1cb62b97d', 'FORM_DELETE');
INSERT INTO edprole_privilege VALUES ('29ccab4b-65e2-4764-83ec-77375d29af39', 'FORM_CREATE');
INSERT INTO edprole_privilege VALUES ('29ccab4b-65e2-4764-83ec-77375d29af39', 'FORM_UPDATE');
INSERT INTO edprole_privilege VALUES ('29ccab4b-65e2-4764-83ec-77375d29af39', 'FORM_DELETE');
INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'FORM_CREATE');
INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'FORM_UPDATE');
INSERT INTO edprole_privilege VALUES ('a5b4947a-67d2-434e-9889-59c2fad39676', 'FORM_DELETE');
INSERT INTO workflow VALUES ('c0b4294f-3713-43ea-89af-83eba9eacff1', 'request_forms_workflow', 1, 'Request Forms Workflow', 'This is the default workflow for a new request that covers both forms.');
INSERT INTO workflow VALUES ('0e81909a-f780-40db-9242-a0c3274b6e95', 'data_product_information_workflow', 1, 'Data Product Information Workflow', 'This is the default initial workflow for a new data product information request.');
INSERT INTO workflow VALUES ('056ca100-107e-4fe5-a54a-e5f2d902a27a', 'assign_a_workflow', 1, 'Assign a Workflow', 'This is the default initial workflow.');
INSERT INTO workflow VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'idealized_workflow', 1, 'Idealized Workflow', 'This is an idealize, yet realistic workflow for the purposes of testing and demonstration.');
INSERT INTO step(workflow_id, step_name, type) VALUES ('c0b4294f-3713-43ea-89af-83eba9eacff1', 'init', 'init');
INSERT INTO step(workflow_id, step_name, type, form_id) VALUES ('c0b4294f-3713-43ea-89af-83eba9eacff1', 'data_accession_request_form', 'form', '6c544723-241c-4896-a38c-adbc0a364293');
INSERT INTO step(workflow_id, step_name, type, data) VALUES ('c0b4294f-3713-43ea-89af-83eba9eacff1', 'data_accession_request_form_review', 'review', '{"rollback":"data_accession_request_form","type": "form","form_id":"6c544723-241c-4896-a38c-adbc0a364293"}');
INSERT INTO step(workflow_id, step_name, type, form_id) VALUES ('c0b4294f-3713-43ea-89af-83eba9eacff1', 'data_product_information_form', 'form', '19025579-99ca-4344-8610-704dae626343');
INSERT INTO step(workflow_id, step_name, type, data) VALUES ('c0b4294f-3713-43ea-89af-83eba9eacff1', 'data_product_information_form_review', 'review', '{"rollback":"data_product_information_form","type": "form","form_id":"19025579-99ca-4344-8610-704dae626343"}');
INSERT INTO step(workflow_id, step_name, type) VALUES ('c0b4294f-3713-43ea-89af-83eba9eacff1', 'close', 'close');
INSERT INTO step(workflow_id, step_name, type) VALUES ('0e81909a-f780-40db-9242-a0c3274b6e95', 'init', 'init');
INSERT INTO step(workflow_id, step_name, type, form_id) VALUES ('0e81909a-f780-40db-9242-a0c3274b6e95', 'data_product_information_form', 'form', '19025579-99ca-4344-8610-704dae626343');
INSERT INTO step(workflow_id, step_name, type, data) VALUES ('0e81909a-f780-40db-9242-a0c3274b6e95', 'data_product_information_form_review', 'review', '{"rollback":"data_product_information_form","type": "form","form_id":"19025579-99ca-4344-8610-704dae626343"}');
INSERT INTO step(workflow_id, step_name, type) VALUES ('0e81909a-f780-40db-9242-a0c3274b6e95', 'close', 'close');
INSERT INTO step(workflow_id, step_name, type) VALUES ('056ca100-107e-4fe5-a54a-e5f2d902a27a', 'init', 'init');
INSERT INTO step(workflow_id, step_name, type, data) VALUES ('056ca100-107e-4fe5-a54a-e5f2d902a27a', 'assign_a_workflow', 'action', '{"rollback":"init","type": "init"}');
INSERT INTO step(workflow_id, step_name, type) VALUES ('056ca100-107e-4fe5-a54a-e5f2d902a27a', 'close', 'close');
INSERT INTO step(workflow_id, step_name, type) VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'init', 'init');
INSERT INTO step(workflow_id, step_name, type, form_id) VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'data_accession_request_form', 'form', '6c544723-241c-4896-a38c-adbc0a364293');
INSERT INTO step(workflow_id, step_name, type, data) VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'data_accession_request_form_review', 'review', '{"rollback":"data_accession_request_form","type": "form","form_id":"6c544723-241c-4896-a38c-adbc0a364293"}');
INSERT INTO step(workflow_id, step_name, type, form_id) VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'data_product_information_form', 'form', '19025579-99ca-4344-8610-704dae626343');
INSERT INTO step(workflow_id, step_name, type, data) VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'data_product_information_form_review', 'review', '{"rollback":"data_product_information_form","type": "form","form_id":"19025579-99ca-4344-8610-704dae626343"}');
INSERT INTO step(workflow_id, step_name, type) VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'start_qa', 'action');
INSERT INTO step(workflow_id, step_name, type) VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'complete_qa', 'action');
INSERT INTO step(workflow_id, step_name, type) VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'map_to_meditor', 'service');
INSERT INTO step(workflow_id, step_name, type) VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'send_to_meditor', 'service');
INSERT INTO step(workflow_id, step_name, type) VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'start_meditor_editing', 'action');
INSERT INTO step(workflow_id, step_name, type) VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'complete_meditor_editing', 'action');
INSERT INTO step(workflow_id, step_name, type) VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'get_from_meditor', 'service');
INSERT INTO step(workflow_id, step_name, type) VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'map_from_meditor', 'service');
INSERT INTO step(workflow_id, step_name, type) VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'publish_to_cmr', 'service');
INSERT INTO step(workflow_id, step_name, type) VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'close', 'close');
INSERT INTO step_edge VALUES ('c0b4294f-3713-43ea-89af-83eba9eacff1', 'init', 'data_accession_request_form');
INSERT INTO step_edge VALUES ('c0b4294f-3713-43ea-89af-83eba9eacff1', 'data_accession_request_form', 'data_accession_request_form_review');
INSERT INTO step_edge VALUES ('c0b4294f-3713-43ea-89af-83eba9eacff1', 'data_accession_request_form_review', 'data_product_information_form');
INSERT INTO step_edge VALUES ('c0b4294f-3713-43ea-89af-83eba9eacff1', 'data_product_information_form', 'data_product_information_form_review');
INSERT INTO step_edge VALUES ('c0b4294f-3713-43ea-89af-83eba9eacff1', 'data_product_information_form_review', 'close');
INSERT INTO step_edge VALUES ('0e81909a-f780-40db-9242-a0c3274b6e95', 'init', 'data_product_information_form');
INSERT INTO step_edge VALUES ('0e81909a-f780-40db-9242-a0c3274b6e95', 'data_product_information_form', 'data_product_information_form_review');
INSERT INTO step_edge VALUES ('0e81909a-f780-40db-9242-a0c3274b6e95', 'data_product_information_form_review', 'close');
INSERT INTO step_edge VALUES ('056ca100-107e-4fe5-a54a-e5f2d902a27a', 'init', 'assign_a_workflow');
INSERT INTO step_edge VALUES ('056ca100-107e-4fe5-a54a-e5f2d902a27a', 'assign_a_workflow', 'close');
INSERT INTO step_edge VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'init', 'data_accession_request_form');
INSERT INTO step_edge VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'data_accession_request_form', 'data_accession_request_form_review');
INSERT INTO step_edge VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'data_accession_request_form_review', 'data_product_information_form');
INSERT INTO step_edge VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'data_product_information_form', 'data_product_information_form_review');
INSERT INTO step_edge VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'data_product_information_form_review', 'start_qa');
INSERT INTO step_edge VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'start_qa', 'complete_qa');
INSERT INTO step_edge VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'complete_qa', 'map_to_meditor');
INSERT INTO step_edge VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'map_to_meditor', 'send_to_meditor');
INSERT INTO step_edge VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'send_to_meditor', 'start_meditor_editing');
INSERT INTO step_edge VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'start_meditor_editing', 'complete_meditor_editing');
INSERT INTO step_edge VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'complete_meditor_editing', 'get_from_meditor');
INSERT INTO step_edge VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'get_from_meditor', 'map_from_meditor');
INSERT INTO step_edge VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'map_from_meditor', 'publish_to_cmr');
INSERT INTO step_edge VALUES ('c1690729-b67e-4675-a1a5-b2323f347dff', 'publish_to_cmr', 'close');
UPDATE daac SET workflow_id='056ca100-107e-4fe5-a54a-e5f2d902a27a' WHERE id='40397fe8-4841-4e4c-b84a-6ece359ff5ff';
UPDATE daac SET workflow_id='056ca100-107e-4fe5-a54a-e5f2d902a27a' WHERE id='c606afba-725b-4ae4-9557-1fd33260ae12';
UPDATE daac SET workflow_id='056ca100-107e-4fe5-a54a-e5f2d902a27a' WHERE id='d551380f-8813-40e4-9763-2a5bb6007cd0';
UPDATE daac SET workflow_id='056ca100-107e-4fe5-a54a-e5f2d902a27a' WHERE id='1ea1da68-cb95-431f-8dd8-a2cf16d7ef98';
UPDATE daac SET workflow_id='056ca100-107e-4fe5-a54a-e5f2d902a27a' WHERE id='ef229725-1cad-485e-a72b-a276d2ca3175';
UPDATE daac SET workflow_id='056ca100-107e-4fe5-a54a-e5f2d902a27a' WHERE id='9e0628f1-0dde-4ed2-b1e3-690c70326f25';
UPDATE daac SET workflow_id='056ca100-107e-4fe5-a54a-e5f2d902a27a' WHERE id='de6d5ec9-4728-4f2b-9d43-ae2f0fdac96a';
UPDATE daac SET workflow_id='0e81909a-f780-40db-9242-a0c3274b6e95' WHERE id='aec3724f-b30b-4b3f-9b9a-e0907d9d14b3';
UPDATE daac SET workflow_id='056ca100-107e-4fe5-a54a-e5f2d902a27a' WHERE id='fe75c306-ac04-4689-a702-073d9cb071fe';
UPDATE daac SET workflow_id='c0b4294f-3713-43ea-89af-83eba9eacff1' WHERE id='15df4fda-ed0d-417f-9124-558fb5e5b561';
UPDATE daac SET workflow_id='056ca100-107e-4fe5-a54a-e5f2d902a27a' WHERE id='6b3ea184-57c5-4fc5-a91b-e49708f91b67';
UPDATE daac SET workflow_id='056ca100-107e-4fe5-a54a-e5f2d902a27a' WHERE id='00dcf32a-a4e2-4e55-a0d1-3a74cf100ca1';
UPDATE daac SET workflow_id='056ca100-107e-4fe5-a54a-e5f2d902a27a' WHERE id='1c36f0b9-b7fd-481b-9cab-3bc3cea35413';
DELETE FROM page WHERE page_key='overview';
INSERT INTO page VALUES ('benefits', '[{"id":5,"heading":"Benefits of publishing data at a NASA DAAC (in draft)","paragraphs":["A vital part of science is reproducibility of results that lead to community confidence in findings and conclusions that advance scientific knowledge. Essential for the reproducibility of results is proper curation of the data used to draw conclusions. In order to publish your findings, more and more journals are requiring evidence of data archival at a long-term facility. NASA DAACs provide this service and meet these requirements.","If you publish your data product at a NASA DAAC, we will:"],"list":["Ingest, catalog and archive your data using standards-based engineering processes","Provide a data product landing page containing all important links to data information and access","Obtain a Digital Object Identifier for your data provide and provide a citation for use in publications","Provide you with traceability of where and how your data are used","Make sure your data are accessible via NASA data systems where appropriate","Increase indexing of your data by Google and other search engines","Curate your data set to bring knowledge of the data to a broad and diverse audience"]}]');
INSERT INTO page VALUES ('daacs', '[{"id":1,"heading":"What is a NASA DAAC?","paragraphs":["NASA’s Distributed Active Archive Centers (DAACs) are components of NASA’s Earth Observing System Data and Information System (EOSDIS) which provides science data to a wide community of users. The science systems of EOSDIS are managed by NASA’s Earth Science Data and Information System (ESDIS) Project, part of NASA’s Earth Science Data System (ESDS) Program.","As custodians of NASA Earth Science data, the DAACs provide data publication, data access, and data user support. DAACs are domain-focused data repositories supporting the specific needs of science disciplines, while also enabling cross-disciplinary data usage. Table 1 lists the 12 NASA DAACs and their primary scientific disciplines.","For more information on the DAACs, see the Earthdata EOSDIS DAACs page."],"table":{"caption":"Table 1. NASA DAACs and Science Disciplines","header":["NASA DAAC","Scientific Disciplines"],"rows":[{"number":1,"columns":["Alaska Satellite Facility (ASF)","SAR Products, Change Detection, Sea Ice, Polar Processes"]},{"number":2,"columns":["Atmospheric Science Data Center (ASDC)","Radiation Budget, Clouds, Aerosols, Tropospheric Composition"]},{"number":3,"columns":["Crustal Dynamics Data Information System (CDDIS)","Space Geodesy, Solid Earth"]},{"number":4,"columns":["Global Hydrology Resource Center (GHRC)","Lightning, Severe Weather Interactions, Atmospheric Convection, Hurricanes, Storm-induced Hazards"]},{"number":5,"columns":["Goddard Earth Sciences Data and Information Services Center (GES DISC)","Global Precipitation, Solar Irradiance, Atmospheric Composition and Dynamics, Water and Energy"]},{"number":6,"columns":["Land Processes DAAC (LPDAAC)","Land data products "]},{"number":7,"columns":["Level 1 and Atmosphere Archive and Distribution System (LAADS)","MODIS (Moderate Resolution Imaging Spectrometer) Level 1 data (geolocation, L1A, and radiance L1B) and Atmosphere (Level 2 and Level 3) "]},{"number":8,"columns":["National Snow and Ice Data Center DAAC (NSIDC DAAC)","Cryospheric Processes, Sea Ice, Snow, Ice Sheets, Frozen Ground, Glaciers, Soil Moisture"]},{"number":9,"columns":["Oak Ridge National Laboratory (ORNL)","Biogeochemical Dynamics, Ecological Data, Environmental Processes"]},{"number":10,"columns":["Ocean Biology DAAC (OB.DAAC)","Ocean Biology"]},{"number":11,"columns":["Physical Oceanography DAAC (PO.DAAC)","Gravity, Ocean Circulation, Ocean Heat Budget, Ocean Surface Topography, Ocean Temperature, Ocean Waves, Ocean Winds, Ocean Salinity, Surface Water"]},{"number":12,"columns":["Socioeconomic Data and Application Data Center (SEDAC)","Synthesized Earth science and socio-economic data"]}]}}]');
INSERT INTO page VALUES ('policy', '[{"id":4,"heading":"Data Scope and Acceptance Policy","paragraphs":["Data from NASA science missions and some NASA research programs are automatically assigned to a DAAC by NASA ESDS.  All other data must be approved by NASA ESDS and ESDIS in order to be submitted to a DAAC for publication. This approval process is initiated by submitting the Data Publication Request form.","When a Data Publication Request is received, the DAAC and the DAAC‘s User Working Group will then conduct an assessment of the data product’s alignment with the DAAC’s science domain, the scientific impact and community need, and the DAAC resources necessary to publish and support the data. The DAAC provides the information supplied in your Data Publication Request and their assessment to the NASA ESDIS project and ESDS program for review and approval.  For instructions on how to submit a Data Publication Request, see the Earthdata Pub Instructions for Data Producers page.","For more information on NASA EOSDIS data scope and acceptance policies, visit the Earthdata Adding New Data to EOSDIS page.","NASA’s Earth Observing System Data and Information System (EOSDIS) is responsible for the storage and public distribution of NASA Earth observation data. The scope of data which will be considered for publication at a NASA DAAC includes data:"],"list":["produced by NASA science missions","produced by scientists at NASA facilities","resulting from NASA research program funding","resulting from NASA Applied Science funding if aligned with Earth observation data","created from NASA data","strongly supporting NASA Earth observation data"]}]');
INSERT INTO page VALUES ('publication', '[{"id":2,"heading":"What is Data Publication? (in draft)","paragraphs":["Data publication is the part of the data lifecycle during which data products are released to the public. Data publication involves a series of activities performed cooperatively by data producers and the NASA DAAC.","Although the primary goal of the data publication process is to make your data available to the general public, data publication at a NASA DAAC encompasses much more than this, and begins well before the data are actually released to the public. The data publication process is a collaboration between you and a NASA DAAC, and begins as soon as your data are assigned to a DAAC. [detail to be added]","[A table below will outline the typical data publication activities, as well as the role of the DAAC and the data producer in these activities.] Keep in mind that requirements can differ for each mission or campaign, and each DAAC has its own processes. You may be asked to perform some tasks that are not shown here, and you may not be asked to perform some tasks that are shown here.","For more information on the role of NASA DAACs and Data Producers in the data publication process, visit the Earthdata Adding New Data to EOSDIS page."]}]');
INSERT INTO page VALUES ('steps', '[{"id":2,"heading":"Instructions for Data Producers (in draft)","paragraphs":["As a data producer, you may have an interest in publishing your data at a NASA DAAC or NASA may require you to publish your data at a DAAC. Determining which of these data publication categories applies to you dictates your next step in the data publication process.","[Steps are in draft. They will be included below. Instructions will include a link to the Forms. NOTE: For testing, the link is in Task 2: Select DAAC.]"]}]');
UPDATE input SET label='ORCID' WHERE question_id='80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e2' AND list_order=3;
UPDATE input SET label='ORCID' WHERE question_id='f3e2eab9-6375-4e53-9cc2-3d16f318d333' AND list_order=3;
UPDATE input SET control_id='funding_nasa', label='NASA', type='checkbox', enums='{}', attributes='{}', required_if='[]', show_if='[]', required=False WHERE question_id='8a364184-42ac-48fe-b831-acb2eb08c728' AND list_order=0;
UPDATE input SET control_id='funding_noaa', label='NOAA', type='checkbox', enums='{}', attributes='{}', required_if='[]', show_if='[]', required=False WHERE question_id='8a364184-42ac-48fe-b831-acb2eb08c728' AND list_order=1;
INSERT INTO input VALUES ('8a364184-42ac-48fe-b831-acb2eb08c728', 'funding_nsf', 2, 'NSF', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('8a364184-42ac-48fe-b831-acb2eb08c728', 'funding_usgs', 3, 'USGS', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('8a364184-42ac-48fe-b831-acb2eb08c728', 'funding_university', 4, 'University', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('8a364184-42ac-48fe-b831-acb2eb08c728', 'funding_other', 5, 'Other', 'checkbox', '{}', '{}', '[]','[]',  False);
INSERT INTO input VALUES ('8a364184-42ac-48fe-b831-acb2eb08c728', 'funding_organization_other', 6, 'If University or Other', 'text', '{}', '{}', '[{"field":"funding_university","value":"true","message":"Please provide a University organization."},{"field":"funding_other","value":"true","message":"Please provide a text value for the funding organization."}]','[]',  False);
UPDATE input SET control_id='data_product_doi_exists', label='Has DOI', type='checkbox', required=False WHERE question_id='c9c73e88-837a-42d2-aa1a-50874a333607' AND list_order=0;
INSERT INTO input VALUES ('c9c73e88-837a-42d2-aa1a-50874a333607', 'data_product_doi_value', 1, 'If yes, provide DOI', 'text', '{}', '{}', '[{"field":"data_product_doi_exists","value":"true","message":"You checked that this data product has a DOI."}]','[]',  False);
UPDATE input SET label='ORCID' WHERE question_id='f3e2eab9-6375-4e53-9cc2-3d16f318d332' AND list_order=3;

-- 3/22/22
-- DB Seed Updates
-- This update should be removed when actions/services have been integrated into EDPub.
UPDATE step SET type='action', data='{"rollback":"data_product_information_form_review","type": "review"}' WHERE step_name='start_qa';
UPDATE step SET type='action', data='{"rollback":"start_qa","type": "action"}' WHERE step_name='complete_qa';
UPDATE step SET type='action', data='{"rollback":"complete_qa","type": "action"}' WHERE step_name='map_to_meditor';
UPDATE step SET type='action', data='{"rollback":"map_to_meditor","type": "action"}' WHERE step_name='send_to_meditor';
UPDATE step SET type='action', data='{"rollback":"send_to_meditor","type": "action"}' WHERE step_name='start_meditor_editing';
UPDATE step SET type='action', data='{"rollback":"start_meditor_editing","type": "action"}' WHERE step_name='complete_meditor_editing';
UPDATE step SET type='action', data='{"rollback":"complete_meditor_editing","type": "action"}' WHERE step_name='get_from_meditor';
UPDATE step SET type='action', data='{"rollback":"get_from_meditor","type": "action"}' WHERE step_name='map_from_meditor';
UPDATE step SET type='action', data='{"rollback":"map_from_meditor","type": "action"}' WHERE step_name='publish_to_cmr';

-- Content updates (EDPUB-451)
DELETE FROM input WHERE control_id = 'data_production_latency_amount';
UPDATE question SET long_name = 'Frequency of Data Deliveries' where id = '4c42796a-8ff1-444e-8fc5-82ccad82e5fb';
UPDATE question SET help = 'The Primary Data Producer is often the Principal Investigator, Project Scientist, or Project Manager.' WHERE id = '80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e2';
UPDATE question SET help = 'Examples include NASA programs such as MEaSUREs, Terrestrial Hydrology, Earth Venture, ACCESS, or AIST.' WHERE id = '4ecc885f-daf8-4bc6-a8cd-d30c2a54d085';
UPDATE question SET help = 'This is how the DAAC will refer to this data product during the data publication process. The DAAC will work with you to develop an official data product title in compliance with DAAC/ESDIS standards.' WHERE id = 'f74c6c20-7483-40f9-a63e-58cc20ae8c8f';
UPDATE question SET text = 'What is the science value of this data product?', help = 'For example, describe the benefits to the science community, the strengths compared to similar data products, and/or other data products that it compliments.' WHERE id = '7fd7bccf-5065-4033-9956-9e80bc99c205';
UPDATE question SET text = 'Why are you requesting to have this data product archived and distributed at the DAAC?', help = 'For example, you are publishing a paper and the publisher requires data to be archived in a trusted repository, you have been instructed by a NASA program manager to archive your data at a DAAC, or you want this data product to be distributed with related data products.' WHERE id = 'bd00dbb7-1d3c-46fa-82a4-734236f4e06c';
UPDATE question SET help = 'For example, you are publishing a paper, you are presenting at a conference, or your project has a requirement to publish data by a certain time.' WHERE id = 'f40956c3-9af8-400e-8dd8-c5e2965dcb8a';
UPDATE question SET text = 'Are there any existing documents that you would like to have included in the review of your data product? If "Yes", please provide URLs to the documents.' WHERE id = 'ad568b2f-89fe-4afd-a0bf-9e5832b71ce9';
UPDATE question SET long_name = 'Spatial Coverage', help = 'Examples include Global, Northern Hemisphere, Alaska, Korean Peninsula, East Tropical Pacific, or Gulf Stream.' WHERE id = '228cb0d6-78fb-449a-8061-b1e6fb3f59d1';
UPDATE question SET long_name = 'Temporal Coverage' WHERE id = '4f2dd369-d865-47ba-8504-8694493f129f';
UPDATE question SET text = 'Is there any additional information about the temporal coverage that will help the DAAC understand this data product?' WHERE id = '4f2dd369-d865-47ba-8504-8694493f128f';
UPDATE question SET help = 'Please describe the general nature of the geographic area. For example, a data file covers a single glacier, a 5 x 5m tile, a swath of 25 km across track for a single orbit, a single flight over the study campaign region, or the entire globe.' WHERE id = '91577abc-a59c-40f7-b0e6-f954542e6b19';
UPDATE question SET text = 'Is there any additional information about the spatial coverage that will help the DAAC understand this data product?' WHERE id = 'd1ef0a6f-284e-40a7-9248-75dd8f1f0ded';
UPDATE question SET text = 'What is the NASA Data Processing Level of this data product?', help = 'For description of the processing levels, please refer to the Earthdata Data Processing Levels page. <https://earthdata.nasa.gov/collaborate/open-data-services-and-software/data-information-policy/data-levels>' WHERE id = '0a2fd2eb-62de-40e1-8143-3e8087a4062d';
UPDATE input SET enums = '["Level 0","Level 1A","Level 1B","Level 1C","Level 2","Level 2A","Level 3","Level 3A","Level 4","Other/Unsure"]' WHERE control_id = 'data_processing_level';
UPDATE question SET long_name = 'Number of Data Files', help = 'If the final data product is not complete, please provide your best estimate of the total number of data files.' WHERE id = '40672516-2220-4edc-8c1b-fd9f7e0b979e';


UPDATE question SET help = 'For a description of the open data policy, please refer to the <a href="https://earthdata.nasa.gov/collaborate/open-data-services-and-software/data-information-policy" target=_blank>NASA Earthdata Data and Information Policy web page <i class="fas fa-external-link-alt"></i></a>.' WHERE id = '2dd6c8b1-22a8-4866-91c3-da9b4ce849dc';

UPDATE question SET help = 'For a list of NASA-approved data formats, please refer to the <a href="https://earthdata.nasa.gov/esdis/eso/standards-and-references#data-formats" target=_blank>NASA Earthdata Standards and Practices web page <i class="fas fa-external-link-alt"></i></a>' WHERE id = '50e8d566-b9ab-4bd9-9adc-92a3c8fb5d27';

UPDATE question SET text = 'What is the NASA Data Processing Level of this data product?' WHERE id = '0a2fd2eb-62de-40e1-8143-3e8087a4062d';

UPDATE question SET help = 'For description of the processing levels, please refer to the <a href="https://earthdata.nasa.gov/collaborate/open-data-services-and-software/data-information-policy/data-levels" target=_blank>Earthdata Data Processing Levels page <i class="fas fa-external-link-alt"></i></a>' WHERE id = '0a2fd2eb-62de-40e1-8143-3e8087a4062d';

UPDATE question SET help = 'For a list of NASA-approved data formats, please refer to the <a href="https://earthdata.nasa.gov/esdis/eso/standards-and-references#data-formats" target=_blank>NASA Earthdata Standards and Practices web page <i class="fas fa-external-link-alt"></i></a>.' WHERE id = '50e8d566-b9ab-4bd9-9adc-92a3c8fb5d27';

UPDATE question SET help = 'The DAAC will use this information to construct a data product citation, which is a reference to data for the purpose of credit attribution and facilitation of data access.  <br><br>Example data product citations: <br>McGill, Matthew , Dennis L Hlavka, John E. Yorks and Patrick A. Selmer. 2019. GOES-R PLT Cloud Physics LiDAR (CPL). Dataset available online from the NASA Global Hydrology Resource Center DAAC, Huntsville, Alabama, U.S.A. DOI: http://dx.doi.org/10.5067/GOESRPLT/CPL/DATA101<br><br>CARVE Science Team. 2017. CARVE: In-flight Photos from the CARVE Aircraft, Alaska, 2013-2015. ORNL DAAC, Oak Ridge, Tennessee, USA. https://doi.org/10.3334/ORNLDAAC/1435' WHERE id = '8a364184-42ac-48fe-b831-acb2eb08c729';