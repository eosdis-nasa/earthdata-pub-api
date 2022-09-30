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
DROP TABLE page

CREATE TABLE IF NOT EXISTS page (
  page_key VARCHAR NOT NULL,
  page_id UUID DEFAULT UUID_GENERATE_V4(),
  page VARCHAR NOT NULL,
  location VARCHAR NOT NULL,
  content JSONB NOT NULL,
  PRIMARY KEY (page_key)
);

-- home
INSERT INTO page VALUES ('home', '9e9252c5-5e69-47bf-a3ba-856f4b42f85a', 'home.html', '/', '{"id":1,"heading":"What is Earthdata Pub?","paragraphs":[{"text":"Earthdata Pub is the easy, online place for NASA Earth Science researchers to publish their data at a <a title=''NASA Distributed Active Archive Center (DAAC)'' href=''/data_producer_resources/nasa_daac''>NASA Distributed Active Archive Center (DAAC)</a><span class=''fa fa-info-circle nasa-daac''>.  Using Earthdata Pub you can:","list":["Request to publish your data at DAAC","Submit information and files required to publish your data","Track the publication status of your data","Access resources for data producers"]},{"heading":"Earthdata Pub Features","text":"With Earthdata Pub you can create and track your request in a seamless workflow. Some of the features that we provide are:","box_list":[{"heading":"Guided Process","text":"We have simple forms and workflows to help you submit your information in one place."},{"heading":"Real-time Tracking","text":"You will receive status updates and notifications during the lifecycle of your request."},{"heading":"Collaborate with DAACs","text":"Direct access to DAAC staff support through centralized communication tools to help you with your publication requests."}]},{"heading":"Earthdata Pub Process","text":"In order to publish data at a NASA DAAC, it must be approved by the <a title=''NASA Earth Science Data Systems (ESDS)'' href=''https://espd.gsfc.nasa.gov/'' class=''ext'' target=_blank>NASA Earth Science Data Systems (ESDS)</a><span class=''fa fa-info-circle esds''> program and the <a title=''Earth Science Data and Information System (ESDIS)'' href=''https://www.earthdata.nasa.gov/esdis'' class=''ext'' target=_blank>Earth Science Data and Information System (ESDIS)</a><span class=''fa fa-info-circle esdis''> project. Earthdata Pub helps you to initiate a request to the DAAC for consideration of your Earth Science data. For in-depth details about data publication through Earthdata Pub, go to <a title=''Data Publication Process'' href=''/data_producer_resources/data_publication''>Data Publication Process</a>."},{"heading":"NASA Earth Science Data Acceptance","text":"The following types of data can be considered for publication at a NASA DAAC:","list":["Produced by NASA science missions","Produced by scientists at NASA facilities","Resulting from NASA research program funding","Resulting from NASA Applied Science funding if aligned with Earth observation data","Created from NASA data","Strongly supporting NASA Earth observation data"]}]}');
-- data_producer_resources
INSERT INTO page VALUES ('data_producer_resources', 'cb169d61-dd65-493b-90d4-d3f74772e6e7', 'data_producer_resources.html', '/data_producer_resources', '{"id":2,"heading":"Data Producer Resources","paragraphs":[{"text":"Below are materials and information to help you submit your data publication request."},{"heading":"Data Producer Docs","box_list":[{"text":"What Is Data Publication","box_link":"<a title=''Data Publication'' href=''/data_producer_resources/data_publication''>Data Publication</a>","icon":"file-code.svg"},{"text":"What Is a NASA DAAC","box_link":"<a title=''What Is a NASA DAAC'' href=''/data_producer_resources/nasa_daac''>What Is a NASA DAAC</a>","icon":"user-friends.svg"},{"text":"How to Use Earthdata Pub","box_link":"<a title=''How to Use Earthdata Pub'' href=''/data_producer_resources/how_to_use_edpub''>How to Use Earthdata Pub</a>","icon":"laptop-code.svg"}]},{"heading":"External NASA Resources","list":["<a title=''Earth Observing System Data and Information System (EOSDIS)'' href=''https://www.earthdata.nasa.gov/eosdis'' class=''ext'' target=_blank>Earth Observing System Data and Information System (EOSDIS)</a>","<a title=''Earth Science Data and Information System (ESDIS)'' href=''https://www.earthdata.nasa.gov/esdis'' class=''ext'' target=_blank>Earth Science Data and Information System (ESDIS)</a>","<a title=''Earth Science Data Systems (ESDS)'' href=''https://espd.gsfc.nasa.gov/'' class=''ext'' target=_blank>Earth Science Data Systems (ESDS)</a>","<a title=''Earthdata EOSDIS DAACs'' href=''https://earthdata.nasa.gov/eosdis/daacs'' class=''ext'' target=_blank>Earthdata EOSDIS DAACs</a>"]}]}');
-- data_publication
INSERT INTO page VALUES ('publication', '147dee30-e087-4afa-9a28-92785cae07fa', 'data_publication.html', '/data_producer_resources/data_publication', '{"id":3,"heading":"What is Data Publication","paragraphs":[{"text":"NASA promotes the full and open sharing of all its data to research and applications communities, private industry, academia, and the general public. Data publication supports the part of the data lifecycle that results in the data being released to the public. Data publication involves a series of activities performed cooperatively by data producers like you and a NASA DAAC."},{"heading":"Data Publication Process","text":"The primary goal of the data publication process is to make your data discoverable, available, and usable. The data publication process is a collaboration between you and a NASA DAAC and begins as soon as your data is assigned to a DAAC. Once your data product<span class=''fa fa-info-circle data-product''> has been published, the DAAC will continue to provide support and maintenance of your data product while it remains available to the public. The DAAC''s role is essential in preserving the previous mission data and the information needed so that a new user in the future can understand how the data were used for deriving information."},{"heading":"Data Publication Phases","text":"The table below outlines typical activities performed during the data publication and post-publication phases, as well as your role and the role of the DAAC in these activities. The activities you may be asked to perform could differ from what is shown here depending on a specific mission, project, or data requirements, and DAAC-specific processes.","image":"img_data_pub_infographic.png","image_alt_text":"Data Publication Phases Image"},{"text":"To publish your data at a NASA DAAC get started at the <a title=''Earthdata Pub Daac Selection Page'' href=''https://pub.earthdata.nasa.gov/forms/daac/selection''>Earthdata Pub Daac Selection Page</a>."}]}');
-- nasa_daac
INSERT INTO page VALUES ('daacs', '20317856-a310-4ad7-98be-f59a910e5e5e', 'nasa_daac.html', '/data_producer_resources/nasa_daac', '{"id":4,"heading":"What is a NASA DAAC","paragraphs":[{"text":"NASA''s Distributed Active Archive Centers (DAACs) are components of NASA''s Earth Observing System Data and Information System (EOSDIS) which provides science data to a wide community of users. The science systems of EOSDIS are managed by NASA''s Earth Science Data and Information System (ESDIS) Project, part of NASA''s Earth Science Data System (ESDS) Program."},{"text":"The DAACs provide data publication, data access, and data user support, as custodians of NASA Earth Science data. DAACs are domain-focused data repositories supporting the specific needs of science disciplines, while also enabling cross-disciplinary data usage."},{"text":"For more information on the DAACs, see the <a title=''Earthdata EOSDIS DAACs page'' href=''https://www.earthdata.nasa.gov/eosdis/daacs'' class=''ext'' target=_blank>Earthdata EOSDIS DAACs page</a>."},{"heading":"NASA DAACS","text":"The table below lists the 12 NASA DAACs with their primary scientific disciplines. Use this to best associate your data request.","table":{"caption":"Table 1. NASA DAACs and Science Disciplines","heading":["NASA DAAC","Scientific Disciplines"],"rows":[{"number":1,"columns":["Alaska Satellite Facility (ASF)","SAR Products, Change Detection, Sea Ice, Polar Processes"]},{"number":2,"columns":["Atmospheric Science Data Center (ASDC)","Radiation Budget, Clouds, Aerosols, Tropospheric Composition"]},{"number":3,"columns":["Crustal Dynamics Data Information System (CDDIS)","Space Geodesy, Solid Earth"]},{"number":4,"columns":["Global Hydrology Resource Center (GHRC)","Lightning, Severe Weather Interactions, Atmospheric Convection, Hurricanes, Storm-induced Hazards"]},{"number":5,"columns":["Goddard Earth Sciences Data and Information Services Center (GES DISC)","Global Precipitation, Solar Irradiance, Atmospheric Composition and Dynamics, Water and Energy"]},{"number":6,"columns":["Land Processes DAAC (LPDAAC)","Land data products "]},{"number":7,"columns":["Level 1 and Atmosphere Archive and Distribution System (LAADS)","MODIS (Moderate Resolution Imaging Spectrometer) Level 1 data (geolocation, L1A, and radiance L1B) and Atmosphere (Level 2 and Level 3) "]},{"number":8,"columns":["National Snow and Ice Data Center DAAC (NSIDC DAAC)","Cryospheric Processes, Sea Ice, Snow, Ice Sheets, Frozen Ground, Glaciers, Soil Moisture"]},{"number":9,"columns":["Oak Ridge National Laboratory (ORNL)","Biogeochemical Dynamics, Ecological Data, Environmental Processes"]},{"number":10,"columns":["Ocean Biology DAAC (OB.DAAC)","Ocean Biology"]},{"number":11,"columns":["Physical Oceanography DAAC (PO.DAAC)","Gravity, Ocean Circulation, Ocean Heat Budget, Ocean Surface Topography, Ocean Temperature, Ocean Waves, Ocean Winds, Ocean Salinity, Surface Water"]},{"number":12,"columns":["Socioeconomic Data and Application Data Center (SEDAC)","Synthesized Earth science and socio-economic data"]}]}}]}');
-- how_to_use_edpub
INSERT INTO page VALUES ('how_to_use_edpub', 'cb1bbdda-5426-44a3-958c-47e83713d638', 'how_to_use_edpub.html', '/data_producer_resources/how_to_use_edpub', '{"id":5,"heading":"How to Use Earthdata Pub","paragraphs":[{"text":"There are a few things to keep in mind when publishing your data."},{"box_list":[{"text":"<a title=''How to Publish Your Data with a DAAC'' href=''#how''>How to Publish Your Data with a DAAC</a>"},{"text":"<a title=''Data Scope & Acceptance Policy'' href=''#scope''>Data Scope & Acceptance Policy</a>"}]},{"heading":"How to Publish with Earthdata Pub","text":"The steps below will guide you through the two-stage data publication process."},{"heading":"Stage 1: Data Accession Request","text":"At this stage in the process, you will need to request approval to publish your data at a DAAC. To begin, submit a Data Accession form."},{"heading":"Create New Accession Request","step":[{"number":1,"heading":"Start New Request","text":"Log into the Earthdata Pub dashboard with your Earthdata Pub account. To create a request, go to the Requests page and click on “New Request”.","icon_text":"You will need to set up an Earthdata Login account to access the Earthdata Pub dashboard.","button":"<input type=''button'' title=''Register at Earthdata Login'' href=''https://urs.earthdata.nasa.gov/users/new'' class=''ext'' target=_blank>Register</input>"},{"number":2,"heading":"Select a DAAC","text":"Here you will need to select the NASA DAAC you would like to publish and distribute your data, based on your science domain or the type of data. For an overview of each DAAC''s scientific focus area, see <a title=''What is a NASA DAAC.'' href=''/data_producer_resources/nasa_daac''>What is a NASA DAAC</a>. If you are not sure which DAAC to select, you can choose “Unknown”.<br><br>Specifying a DAAC does not guarantee that your data will be published by that DAAC. As your request is reviewed, NASA may determine that a different DAAC is more appropriate.","accordian":"<div class=''eui-accordion is-closed''><header class=''eui-accordion__header''><h2 class=''list_of_nasa_daacs'' id=''list_of_nasa_daacs''>List of NASA DAACs</h2><div class=''eui-accordion__icon'' tabindex=''0''><i class=''eui-icon eui-fa-chevron-circle-down''></i><span class=''eui-sr-only''>Toggle List of NASA DAACs</span></div></header><div class=''eui-accordion__body''>INSERT NASA TABLE HERE FROM HTML</div></div>"},{"number":3,"heading":"Fill in the request form","text":"This form allows you to describe your data and is used to initiate the review and approval of your data for publication at a DAAC. While you fill in the form, you should save your progress as you go along.","image":"img_edpub_dp_data_accession_form_example.png","image_alt_text":"Data Accession Form Example Image"},{"number":4,"heading":"Submit your request","text":"Submitting your request will initiate the review process. Please keep in mind that the review process may take up to several weeks."}]},{"heading":"Track Your Request Status","text":"You can track the status of your data accession request on the Requests page of the <a title=''Earthdata Pub Dashboard'' href=''https://pub.earthdata.nasa.gov/dashboard''>Earthdata Pub Dashboard</a>."},{"heading":"Communicate with the DAAC","text":"The DAAC may contact you for additional information during the data accession process. When a message is posted in Earthdata Pub you will receive an email notification with a link to the Conversations page."},{"heading":"Receive the Approval Decision","text":"After the DAAC has reviewed your request they will make a determination and mark that decision in the Earthdata Pub dashboard."},{"heading":"Approval","text":"If your accession request has been approved, you will move to stage 2 in the publication process."},{"heading":"Denial","text":"If your accession request has not been selected to move on, the DAAC may advise with the reason why in the request''s notes and you will receive a confirmation email about the request''s status."},{"heading":"Stage 2: Data Publication Request","text":"When your Data Accession Request is approved, you will receive an invitation to submit a Data Publication Request. You can complete the Data Publication Request when you are ready to work with the DAAC to publish your data."},{"heading":"Complete the Publication Request","step":[{"number":1,"heading":"Continuation After Approval","text":"You will receive an email with the next steps to your data publication request."},{"number":2,"heading":"Status Change","text":"In the dashboard, you will see a new status update and that the request form state has changed from accession to publication mode."},{"number":3,"heading":"To Access the Form","text":"In the Earthdata Pub dashboard, go to the Requests page and click on the Data Publication Form button in the Next Action column. Once you click on this action and are sent to the form, you will notice that some of the fields are pre-populated from your previously approved Data Accession Form.","tip":"You can save your progress and return to the form later."},{"number":4,"heading":"Fill & Complete Form","text":"If you have any questions while filling out the request you can send the DAAC a message/reply on the Conversations page. Once you have submitted the publication request then the DAAC will proceed to work with you to publish the data product."}]},{"heading":"Collaborate with the DAAC","text":"The data publication process is a collaboration between you and the DAAC. The information you provide in the Data Publication form, along with sample data and related documentation, will be reviewed by the DAAC. You may be asked to clarify information provided in the Data Publication form or to provide additional information. If the DAAC needs to communicate with you they will post a message on the Conversations page in Earthdata Pub."},{"heading":"Track Your Publication Status","text":"You can track the status of your data product<span class=''fa fa-info-circle data-product''> through the publication process on the Requests page in the <a title=''Earthdata Pub Dashboard'' href=''https://pub.earthdata.nasa.gov/dashboard/''>Earthdata Pub Dashboard</a>","note":"The length of time required to publish your data product will vary depending on the complexity and volume of the data, and an agreed Level of Service Agreement you entered into with the DAAC. The NASA DAAC publishing your data product can provide a publication time estimate."},{"heading":"Data Product is Published","text":"When your data has been published, you will receive an email notification with the following details:","list":["The data citation","The Digital Object Identifier (DOI)","The data access link"]},{"text":"<b>*</b>In order to start at Stage 2, you will need an invitation from the DAAC to submit a Data Publication Request. This will be sent automatically upon approval of your Data Accession Request. If you have not received an invitation to submit a Data Publication Request, you cannot submit a Data Publication Request and should start at Stage 1."},{"text":"For more information on what can be expected during the approval and publication process, see <a title=''What is Data Publication'' href=''/data_producer_resources/data_publication''>What is Data Publication</a>.","note":"Some data publication steps and services may vary between NASA DAACs."},{"button":"<input type=''button'' title=''Start New Request'' href=''https://pub.earthdata.nasa.gov/dashboard/requests''>Start New Request</input>"},{"heading":"Data Scope and Acceptance Policy","text":"NASA''s Earth Observing System Data and Information System (EOSDIS) is responsible for the storage and public distribution of NASA Earth observation data. The scope of data which will be considered for publication at a NASA DAAC includes data:","list":["Produced by NASA science missions","Produced by scientists at NASA facilities","Resulting from NASA research program funding","Resulting from NASA Applied Science funding if aligned with Earth observation data","Created from NASA data","Strongly supporting NASA Earth observation data"]},{"text":"Data from NASA science missions and some NASA research programs are automatically assigned to a DAAC by NASA ESDS. All other data must be approved by NASA ESDS and ESDIS in order to be submitted to a DAAC for publication. This approval process is initiated by submitting the Data Accession Request form."},{"text":"When a Data Accession Request is received, the DAAC and the DAAC''s User Working Group will then conduct an assessment of the data product''s alignment with the DAAC''s science domain, the scientific impact and community need, and the DAAC resources necessary to publish and support the data. The DAAC provides the information supplied in your Data Accession Request and their assessment to the NASA ESDIS project and ESDS program for review and approval.  For instructions on how to submit a Data Accession Request, go to <a title=''How To Use Earthdata Pub'' href=''/data_producer_resources/how_to_use_edpub''>How To Use Earthdata Pub</a>."}]}');
