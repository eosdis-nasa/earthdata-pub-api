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
DROP table page;

CREATE TABLE IF NOT EXISTS page (
  page_key VARCHAR NOT NULL,
  page_id UUID DEFAULT UUID_GENERATE_V4(),
  page VARCHAR NOT NULL,
  location VARCHAR NOT NULL,
  content JSONB NOT NULL,
  PRIMARY KEY (page_key)
);

INSERT INTO page VALUES ('home', '9e9252c5-5e69-47bf-a3ba-856f4b42f85a', 'home.html', '/', '{"id":1,"heading":"What is Earthdata Pub?","paragraphs":[{"text":"Earthdata Pub is the easy, online place for NASA Earth Science researchers to publish their data at a NASA Distributed Active Archive Center (DAAC).<InfoBubble text=''NASA Distributed Active Archive Centers (DAACs) are custodians of EOS mission data and ensure that data will be easily accessible to users.'' link_title=''NASA Distributed Active Archive Center (DAAC)'' link_url=''/data_producer_resources/nasa_daac'' link_name=''What is a NASA DAAC'' link_text=''View details about the NASA DAACs'' />","list":["Request to publish your data at DAAC","Submit information and files required to publish your data","Track the publication status of your data","Access resources for data producers"]},{"heading":"Earthdata Pub Features","text":"With Earthdata Pub you can create and track your request in a seamless workflow. Some of the features that we provide are:","box_list":[{"heading":"Guided Process","text":"We have simple forms and workflows to help you submit your information in one place."},{"heading":"Real-time Tracking","text":"You will receive status updates and notifications during the lifecycle of your request."},{"heading":"Collaborate with DAACs","text":"Direct access to DAAC staff support through centralized communication tools to help you with your publication requests."}]},{"heading":"Earthdata Pub Process","text":"In order to publish data at a NASA DAAC, it must be approved by the NASA Earth Science Data Systems (ESDS)<InfoBubble text=''NASA ESDS enables Earth science mission success to understand, protect, and preserve our home for ourselves and future generations.'' icon=''fa fa-external-link-alt'' link_title=''NASA Earth Science Data Systems (ESDS)'' link_url=''https://espd.gsfc.nasa.gov/'' link_text=''Go here for more details about the ESDS program'' /> program and the Earth Science Data and Information System (ESDIS)<InfoBubble text=\"NASA ESDIS Project is responsible for providing scientific and other users access to data from NASA''s Earth science missions.\" icon=''fa fa-external-link-alt'' link_title=''Earth Science Data and Information System (ESDIS)'' link_url=''https://www.earthdata.nasa.gov/esdis'' link_text=''Learn more about ESDIS'' /> project. Earthdata Pub helps you to initiate a request to the DAAC for consideration of your Earth Science data. For in-depth details about data publication through Earthdata Pub, go to <OverviewLink name=''Data Publication'' link_title=''Data Publication Process'' link_text=''Data Publication Process'' />."},{"heading":"NASA Earth Science Data Acceptance","text":"The following types of data can be considered for publication at a NASA DAAC:","list":["Produced by NASA science missions","Produced by scientists at NASA facilities","Resulting from NASA research program funding","Resulting from NASA Applied Science funding if aligned with Earth observation data","Created from NASA data","Strongly supporting NASA Earth observation data"]},{"three_columns":[{"text":"<p>Earthdata Pub is a set of tools to help you publish your Earth Science data with a NASA DAAC.</p><p>If you are ready to submit your information for consideration, start here.</p>"},{"text":"<OtherLink link_title=''Get Started'' link_url=''daac/selection'' link_text=''Get Started'' link_class=''btn btn-lg btn-green text-white include-icon'' link_icon=''ic_arrow_up.png'' />"},{"image":"img_edpub_form_types_300.svg","image_alt_text":"home form screenshot image"}]}]}');
-- data_producer_resources
INSERT INTO page VALUES ('data_producer_resources', 'cb169d61-dd65-493b-90d4-d3f74772e6e7', 'data_producer_resources.html', '/data_producer_resources', '{"id":2,"heading":"Data Producer Resources","paragraphs":[{"text":"Below are materials and information to help you submit your data publication request."},{"heading":"Data Producer Docs","box_list":[{"text":"What Is Data Publication","link_name":"Data Publication","box_link":"/data_producer_resources/data_publication","icon":"file-code.svg"},{"text":"What is a NASA DAAC","link_name":"What is a NASA DAAC","box_link":"/data_producer_resources/nasa_daac","icon":"user-friends.svg"},{"text":"How to Use Earthdata Pub","link_name":"How To Use Earthdata Pub","box_link":"/data_producer_resources/how_to_use_edpub","icon":"laptop-code.svg"}]},{"heading":"External NASA Resources","list":["<a title=''Earth Observing System Data and Information System (EOSDIS)'' href=''https://www.earthdata.nasa.gov/eosdis'' class=''ext'' target=_blank>Earth Observing System Data and Information System (EOSDIS)</a>","<a title=''Earth Science Data and Information System (ESDIS)'' href=''https://www.earthdata.nasa.gov/esdis'' class=''ext'' target=_blank>Earth Science Data and Information System (ESDIS)</a>","<a title=''Earth Science Data Systems (ESDS)'' href=''https://espd.gsfc.nasa.gov/'' class=''ext'' target=_blank>Earth Science Data Systems (ESDS)</a>","<a title=''Earthdata EOSDIS DAACs'' href=''https://earthdata.nasa.gov/eosdis/daacs'' class=''ext'' target=_blank>Earthdata EOSDIS DAACs</a>"]}]}');
-- data_publication
INSERT INTO page VALUES ('publication', '147dee30-e087-4afa-9a28-92785cae07fa', 'data_publication.html', '/data_producer_resources/data_publication', '{"id":3,"heading":"What is Data Publication","paragraphs":[{"text":"NASA promotes the full and open sharing of all its data to research and applications communities, private industry, academia, and the general public. Data publication supports the part of the data lifecycle that results in the data being released to the public. Data publication involves a series of activities performed cooperatively by data producers like you and a NASA DAAC."},{"heading":"Data Publication Process","text":"The primary goal of the data publication process is to make your data discoverable, available, and usable. The data publication process is a collaboration between you and a NASA DAAC and begins as soon as your data is assigned to a DAAC. Once your data product<InfoBubble text=''A logically meaningful grouping of similar or related data which is packaged for distribution to users and represented with a single title and Digital Object Identifier (DOI)'' /> has been published, the DAAC will continue to provide support and maintenance of your data product while it remains available to the public. The DAAC''s role is essential in preserving the previous mission data and the information needed so that a new user in the future can understand how the data were used for deriving information."},{"heading":"Data Publication Phases","text":"The table below outlines typical activities performed during the data publication and post-publication phases, as well as your role and the role of the DAAC in these activities. The activities you may be asked to perform could differ from what is shown here depending on a specific mission, project, or data requirements, and DAAC-specific processes.","image":"img_data_pub_infographic.svg","image_alt_text":"Data Publication Phases Image"},{"text":"To publish your data at a NASA DAAC get started at the <OtherLink link_title=''Earthdata Pub Daac Selection Page'' link_url=''daacs/selection'' link_text=''Earthdata Pub Daac Selection Page'' />"}]}');
-- nasa_daac
INSERT INTO page VALUES ('daacs', '20317856-a310-4ad7-98be-f59a910e5e5e', 'nasa_daac.html', '/data_producer_resources/nasa_daac', '{"id":4,"heading":"What is a NASA DAAC","paragraphs":[{"text":"NASA''s Distributed Active Archive Centers (DAACs) are components of NASA''s Earth Observing System Data and Information System (EOSDIS) which provides science data to a wide community of users. The science systems of EOSDIS are managed by NASA''s Earth Science Data and Information System (ESDIS) Project, part of NASA''s Earth Science Data System (ESDS) Program."},{"text":"The DAACs provide data publication, data access, and data user support, as custodians of NASA Earth Science data. DAACs are domain-focused data repositories supporting the specific needs of science disciplines, while also enabling cross-disciplinary data usage."},{"text":"For more information on the DAACs, see the <a title=''Earthdata EOSDIS DAACs page'' href=''https://www.earthdata.nasa.gov/eosdis/daacs'' class=''ext'' target=_blank>Earthdata EOSDIS DAACs page</a>."},{"heading":"NASA DAACS","text":"The table below lists the 12 NASA DAACs with their primary scientific disciplines. Use this to best associate your data request.","table":{"caption":"Table 1. NASA DAACs and Science Disciplines","heading":["NASA DAAC","Scientific Disciplines"],"rows":[{"number":1,"columns":["Alaska Satellite Facility (ASF)","SAR Products, Change Detection, Sea Ice, Polar Processes"]},{"number":2,"columns":["Atmospheric Science Data Center (ASDC)","Radiation Budget, Clouds, Aerosols, Tropospheric Composition"]},{"number":3,"columns":["Crustal Dynamics Data Information System (CDDIS)","Space Geodesy, Solid Earth"]},{"number":4,"columns":["Global Hydrology Resource Center (GHRC)","Lightning, Severe Weather Interactions, Atmospheric Convection, Hurricanes, Storm-induced Hazards"]},{"number":5,"columns":["Goddard Earth Sciences Data and Information Services Center (GES DISC)","Global Precipitation, Solar Irradiance, Atmospheric Composition and Dynamics, Water and Energy"]},{"number":6,"columns":["Land Processes DAAC (LPDAAC)","Land data products "]},{"number":7,"columns":["Level 1 and Atmosphere Archive and Distribution System (LAADS)","MODIS (Moderate Resolution Imaging Spectrometer) Level 1 data (geolocation, L1A, and radiance L1B) and Atmosphere (Level 2 and Level 3) "]},{"number":8,"columns":["National Snow and Ice Data Center DAAC (NSIDC DAAC)","Cryospheric Processes, Sea Ice, Snow, Ice Sheets, Frozen Ground, Glaciers, Soil Moisture"]},{"number":9,"columns":["Oak Ridge National Laboratory (ORNL)","Biogeochemical Dynamics, Ecological Data, Environmental Processes"]},{"number":10,"columns":["Ocean Biology DAAC (OB.DAAC)","Ocean Biology"]},{"number":11,"columns":["Physical Oceanography DAAC (PO.DAAC)","Gravity, Ocean Circulation, Ocean Heat Budget, Ocean Surface Topography, Ocean Temperature, Ocean Waves, Ocean Winds, Ocean Salinity, Surface Water"]},{"number":12,"columns":["Socioeconomic Data and Application Data Center (SEDAC)","Synthesized Earth science and socio-economic data"]}]}}]}');
-- how_to_use_edpub
INSERT INTO page VALUES ('how_to_use_edpub', 'cb1bbdda-5426-44a3-958c-47e83713d638', 'how_to_use_edpub.html', '/data_producer_resources/how_to_use_edpub', '{"id":5,"heading":"How to Use Earthdata Pub","paragraphs":[{"text":"There are a few things to keep in mind when publishing your data."},{"box_list":[{"text":"<a title=''How to Publish Your Data with a DAAC'' href=''#how''>How to Publish Your Data with a DAAC</a>","icon":"globe-americas.svg"},{"text":"<a title=''Data Scope & Acceptance Policy'' href=''#scope''>Data Scope & Acceptance Policy</a>","icon":"clipboard-list.svg"}]},{"heading":"How to Publish with Earthdata Pub","text":"The steps below will guide you through the two-stage data publication process."},{"heading":"Stage 1: Data Accession Request","text":"At this stage in the process, you will need to request approval to publish your data at a DAAC. To begin, submit a Data Accession form."},{"heading":"Create New Accession Request","step":[{"number":1,"heading":"Start New Request","text":"Log into the Earthdata Pub dashboard with your Earthdata Pub account. To create a request, go to the Requests page and click on “New Request”.","icon":"lightbulb.svg","icon_text":"You will need to set up an Earthdata Login account to access the Earthdata Pub dashboard.","button":"<a class=''btn btn-md btn-green text-white ext'' href=''https://urs.earthdata.nasa.gov/users/new'' role=''button'' target=''_blank''>Register</a>"},{"number":2,"heading":"Select a DAAC","text":"Here you will need to select the NASA DAAC you would like to publish and distribute your data, based on your science domain or the type of data. For an overview of each DAAC''s scientific focus area, see . If you are not sure which DAAC to select, you can choose “Unknown”.<br><br>Specifying a DAAC does not guarantee that your data will be published by that DAAC. As your request is reviewed, NASA may determine that a different DAAC is more appropriate.","accordian_header":"List of NASA DAACs","accordian_body":"<table class=''table table-striped''><caption>Table 1. NASA DAACs and Science Disciplines</caption><thead><tr><th>NASA DAAC</th><th>Scientific Disciplines</th></tr></thead><tbody><tr><td>Alaska Satellite Facility (ASF)</td><td>SAR Products, Change Detection, Sea Ice, Polar Processes</td></tr><tr><td>Atmospheric Science Data Center (ASDC)</td><td>Radiation Budget, Clouds, Aerosols, Tropospheric Composition</td></tr><tr><td>Crustal Dynamics Data Information System (CDDIS)</td><td>Space Geodesy, Solid Earth</td></tr><tr><td>Global Hydrology Resource Center (GHRC)</td><td>Lightning, Severe Weather Interactions, Atmospheric Convection, Hurricanes, Storm-induced Hazards</td></tr><tr><td>Goddard Earth Sciences Data and Information Services Center (GES DISC)</td><td>Global Precipitation, Solar Irradiance, Atmospheric Composition and Dynamics, Water and Energy</td></tr><tr><td>Land Processes DAAC (LPDAAC)</td><td>Land data products </td></tr><tr><td>Level 1 and Atmosphere Archive and Distribution System (LAADS)</td><td>MODIS (Moderate Resolution Imaging Spectrometer) Level 1 data (geolocation, L1A, and radiance L1B) and Atmosphere (Level 2 and Level 3) </td></tr><tr><td>National Snow and Ice Data Center DAAC (NSIDC DAAC)</td><td>Cryospheric Processes, Sea Ice, Snow, Ice Sheets, Frozen Ground, Glaciers, Soil Moisture</td></tr><tr><td>Oak Ridge National Laboratory (ORNL)</td><td>Biogeochemical Dynamics, Ecological Data, Environmental Processes</td></tr><tr><td>Ocean Biology DAAC (OB.DAAC)</td><td>Ocean Biology</td></tr><tr><td>Physical Oceanography DAAC (PO.DAAC)</td><td>Gravity, Ocean Circulation, Ocean Heat Budget, Ocean Surface Topography, Ocean Temperature, Ocean Waves, Ocean Winds, Ocean Salinity, Surface Water</td></tr><tr><td>Socioeconomic Data and Application Data Center (SEDAC)</td><td>Synthesized Earth science and socio-economic data</td></tr></tbody></table>"},{"number":3,"heading":"Fill in the request form","text":"This form allows you to describe your data and is used to initiate the review and approval of your data for publication at a DAAC. While you fill in the form, you should save your progress as you go along."},{"number":4,"heading":"Submit your request","text":"Submitting your request will initiate the review process. Please keep in mind that the review process may take up to several weeks."}]},{"heading":"Track Your Request Status","text":"You can track the status of your data accession request on the Requests page of the <OtherLink link_title=''Earthdata Pub Dashboard'' link_url=''dashboard/'' link_text=''Earthdata Pub Dashboard'' />."},{"heading":"Communicate with the DAAC","text":"The DAAC may contact you for additional information during the data accession process. When a message is posted in Earthdata Pub you will receive an email notification with a link to the Conversations page."},{"heading":"Receive the Approval Decision","text":"After the DAAC has reviewed your request they will make a determination and mark that decision in the Earthdata Pub dashboard.","grouped_note":[{"heading":"Approval","icon":"check-square.svg","icon_text":"If your accession request has been approved, you will move to stage 2 in the publication process."},{"heading":"Denial","icon":"times-circle.svg","icon_text":"If your accession request has not been selected to move on, the DAAC may advise with the reason why in the request''s notes and you will receive a confirmation email about the request''s status."}]},{"heading":"Stage 2: Data Publication Request","text":"When your Data Accession Request is approved, you will receive an invitation to submit a Data Publication Request. You can complete the Data Publication Request when you are ready to work with the DAAC to publish your data."},{"heading":"Complete the Publication Request","step":[{"number":1,"heading":"Continuation After Approval","text":"You will receive an email with the next steps to your data publication request."},{"number":2,"heading":"Status Change","text":"In the dashboard, you will see a new status update and that the request form state has changed from accession to publication mode."},{"number":3,"heading":"To Access the Form","text":"In the Earthdata Pub dashboard, go to the Requests page and click on the Data Publication Form button in the Next Action column. Once you click on this action and are sent to the form, you will notice that some of the fields are pre-populated from your previously approved Data Accession Form.","icon":"lightbulb.svg","icon_text":"You can save your progress and return to the form later."},{"number":4,"heading":"Fill & Complete Form","text":"If you have any questions while filling out the request you can send the DAAC a message/reply on the Conversations page. Once you have submitted the publication request then the DAAC will proceed to work with you to publish the data product."}]},{"heading":"Collaborate with the DAAC","text":"The data publication process is a collaboration between you and the DAAC. The information you provide in the Data Publication form, along with sample data and related documentation, will be reviewed by the DAAC. You may be asked to clarify information provided in the Data Publication form or to provide additional information. If the DAAC needs to communicate with you they will post a message on the Conversations page in Earthdata Pub."},{"heading":"Track Your Publication Status","text":"You can track the status of your data product<InfoBubble text=''A logically meaningful grouping of similar or related data which is packaged for distribution to users and represented with a single title and Digital Object Identifier (DOI)'' /> through the publication process on the Requests page in the <OtherLink link_title=''Earthdata Pub Dashboard'' link_url=''dashboard/'' link_text=''Earthdata Pub Dashboard'' />","icon":"sticky-note.svg","icon_text":"The length of time required to publish your data product will vary depending on the complexity and volume of the data, and an agreed Level of Service Agreement you entered into with the DAAC. The NASA DAAC publishing your data product can provide a publication time estimate."},{"heading":"Data Product is Published","text":"When your data has been published, you will receive an email notification with the following details:","list":["The data citation<InfoBubble text=''Reference or citation of other dataset evidence or sources.'' icon=''fa fa-external-link-alt'' link_title=''Data Citation Information'' link_url=''https://www.earthdata.nasa.gov/learn/articles/open-data-and-the-importance-of-data-citations-the-nasa-eosdis-perspective'' link_text=''For More Information on Data Citation'' />","The Digital Object Identifier (DOI)<InfoBubble text=''A DOI is a unique sequence of numbers and letters that identify an object, such as a dataset or journal article.'' icon=''fa fa-external-link-alt'' link_title=''DOI information'' link_url=''https://www.earthdata.nasa.gov/engage/doi-process'' link_text='' View information on our DOI Process'' />","The data access link<InfoBubble text=''A public URL / link to the data product.'' />"]},{"text":"<b>*</b>In order to start at Stage 2, you will need an invitation from the DAAC to submit a Data Publication Request. This will be sent automatically upon approval of your Data Accession Request. If you have not received an invitation to submit a Data Publication Request, you cannot submit a Data Publication Request and should start at Stage 1."},{"text":"For more information on what can be expected during the approval and publication process, see <OverviewLink name=''Data Publication'' link_title=''Data Publication Process'' link_text=''Data Publication Process'' />","icon":"sticky-note.svg","icon_text":"Some data publication steps and services may vary between NASA DAACs."},{"button":"<OtherLink link_title=''Start New Request'' link_url=''dashboard/requests'' link_text=''Start New Request'' link_class=''btn btn-md btn-green text-white ext'' />"},{"heading":"Data Scope and Acceptance Policy","text":"NASA''s Earth Observing System Data and Information System (EOSDIS) is responsible for the storage and public distribution of NASA Earth observation data. The scope of data which will be considered for publication at a NASA DAAC includes data:","list":["Produced by NASA science missions","Produced by scientists at NASA facilities","Resulting from NASA research program funding","Resulting from NASA Applied Science funding if aligned with Earth observation data","Created from NASA data","Strongly supporting NASA Earth observation data"]},{"text":"Data from NASA science missions and some NASA research programs are automatically assigned to a DAAC by NASA ESDS. All other data must be approved by NASA ESDS and ESDIS in order to be submitted to a DAAC for publication. This approval process is initiated by submitting the Data Accession Request form."},{"text":"When a Data Accession Request is received, the DAAC and the DAAC''s User Working Group will then conduct an assessment of the data product''s alignment with the DAAC''s science domain, the scientific impact and community need, and the DAAC resources necessary to publish and support the data. The DAAC provides the information supplied in your Data Accession Request and their assessment to the NASA ESDIS project and ESDS program for review and approval.  For instructions on how to submit a Data Accession Request, go to <OverviewLink name=''How To Use Earthdata Pub'' link_title=''How To Use Earthdata Pub'' link_text=''How To Use Earthdata Pub'' />."}]}');

--10/23/22 Add confirmation form
INSERT INTO form VALUES ('de7e5c40-584a-493b-919d-8f7f3f1e9e3c', 'confirmation_form', 1, 'Confirmation Form', 'This form is used to confirm request information which might be used for external applications such as collection metadata curation.');
INSERT INTO section VALUES ('933da7a8-4db6-4b7b-b128-d815fe151d29', 'de7e5c40-584a-493b-919d-8f7f3f1e9e3c', 'Metadata Information', 0, '[]', '[]', NULL);
INSERT INTO question VALUES ('0be3cdbd-da86-4879-bf94-e6a07de7cfe1', 'collection_short_name', 1, 'Collection Short Name', 'What is the collection short name which will be used for this dataset?', 'The Short Name is an abbreviated or shortened name used to identify a dataset. The Short Name and Version Id combination must be unique per provider in the CMR.');
INSERT INTO question VALUES ('38cdfe14-6861-4ada-bd70-0545f65eeb03', 'collection_version', 1, 'Collection Version', 'What is the collection version which will be used for this dataset?', 'The Version element indicates the version of the dataset and should be consistent throughout the metadata record. The Short Name and Version Id combination must be unique per provider in the CMR.');
INSERT INTO section_question VALUES ('933da7a8-4db6-4b7b-b128-d815fe151d29', '0be3cdbd-da86-4879-bf94-e6a07de7cfe1', 0, '[]', '[]');
INSERT INTO section_question VALUES ('933da7a8-4db6-4b7b-b128-d815fe151d29', '38cdfe14-6861-4ada-bd70-0545f65eeb03', 1, '[]', '[]');
INSERT INTO input VALUES ('0be3cdbd-da86-4879-bf94-e6a07de7cfe1', 'collection_short_name', 0, 'Collection Short Name', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO input VALUES ('38cdfe14-6861-4ada-bd70-0545f65eeb03', 'collection_version', 0, 'Collection Version', 'text', '{}', '{}', '[]','[]',  True);
INSERT INTO step(step_name, type, form_id) VALUES ('confirmation_form', 'form', 'de7e5c40-584a-493b-919d-8f7f3f1e9e3c');
UPDATE step_edge SET next_step_name='confirmation_form' WHERE workflow_id='45e8d0e8-d8c9-47e1-85a2-5b5db6e34dd8' AND step_name='data_publication_request_form_review';
INSERT INTO step_edge VALUES ('45e8d0e8-d8c9-47e1-85a2-5b5db6e34dd8', 'confirmation_form', 'send_to_meditor_after_publication_form_review');

--10/23/22 Add actions
INSERT INTO action VALUES ('3fe93672-cd91-45d4-863b-c6d0d63f8c8c', 'send_to_meditor', 1, 'Send To mEditor Action', 'This action is used to send collection metadata from EDPub to mEditor.', 'sendToMeditor.js');
INSERT INTO action VALUES ('f812eb99-7c4a-46a8-8d8f-30ae509fe21c', 'map_edpub_to_ummc', 1, 'Map EDPub To UMMC Action', 'This action is map EDPub question reponses to a JSON UMMC format.', 'mapEDPubToUmmc.js');
UPDATE step SET data='' WHERE step_name='send_to_meditor';
INSERT INTO step(step_name, type, action_id) VALUES ('map_question_response_to_ummc', 'action', 'f812eb99-7c4a-46a8-8d8f-30ae509fe21c');
UPDATE step_edge SET next_step_name='map_question_response_to_ummc' WHERE workflow_id='45e8d0e8-d8c9-47e1-85a2-5b5db6e34dd8' AND step_name='confirmation_form';
INSERT INTO step_edge VALUES ('45e8d0e8-d8c9-47e1-85a2-5b5db6e34dd8', 'map_question_response_to_ummc', 'send_to_meditor_after_publication_form_review');

--10/25/22 Update ASF and ASDC disciplines
UPDATE daac SET discipline='SAR Products, Change Detection, Sea Ice, Polar Processes' WHERE id='c606afba-725b-4ae4-9557-1fd33260ae12';
UPDATE daac SET discipline='Radiation Budget, Clouds, Aerosols, Tropospheric Composition' WHERE id='40397fe8-4841-4e4c-b84a-6ece359ff5ff';