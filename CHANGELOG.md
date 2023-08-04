# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

<!-- Unreleased changes can be added here. -->
- Added daac_name to submission call to save having to do request in the dashboard.
- Refresh token extension fixed
- Content update - Temporal and Spatial sections
- Content update - Changed 'Temporal Coverage Notes' to 'Temporal Information Notes'
- Content update - Changed 'Spatial Coverage Notes' to 'Spatial Information Notes'
- Content update - help text on Spatial Resolution question on Data Publication Form
- Content update - Added "Instantaneous" and help text to file_temporal_coverage
- Content updates for data_product_status and product_temporal_coverage
- Content updates:
  - Added Department to contact information
  - Changed 'Temporal Information Notes' to 'Additional Temporal Information'
  - Changed 'Additional Temporal Information' question and help
  - Changed 'Spatial Information Notes' to 'Additional Spatial Information'
  - Changed 'Additional Spatial Information' question
  - Data 'Product Spatial Coverage' to 'Data Product Spatial Region' (edpub795)
  - Temporal and Spatial sections
  - Changed 'Temporal Coverage Notes' to 'Temporal Information Notes'
  - Changed 'Spatial Coverage Notes' to 'Spatial Information Notes'
  - help text on Spatial Resolution question on Data Publication Form
  - Added "Instantaneous" and help text to file_temporal_coverage
  - data_product_status and product_temporal_coverage

## 1.0.14

- Content updates:
  - Temporal and Spatial sections
  - Changed 'Temporal Coverage Notes' to 'Temporal Information Notes' (EDPUB-798)
  - Changed 'Spatial Coverage Notes' to 'Spatial Information Notes'
  - Help text on Spatial Resolution question on Data Publication Form (EDPUB-796)
  - Added "Instantaneous" and help text to file_temporal_coverage (EDPUB-794)
  - data_product_status and product_temporal_coverage
- Add support for querying notes by step id
- Change methods to look at privileges v roles
- Replace step_id with step_name for searching by messages by step (EDPUB-951)
- Fix notification proxy
- Add support for proper signing with hash (EDPUB-952)

## 1.0.13 - 2023-06-22

- Update assign Idealized workflow to Example Workflow and made it the default.
- Implement question versioning
- Content update - "Data Product Restrictions" to "Open Data Policy"
- Fix to look at privileges for workflow step
- Add terraform for upload bucket deployment
- Limit api input sanitization to only specific calls to prevent duplicate work
- Add GES DISC community workflow
- Add updates to original db init.
- Remove conditional build of upload bucket
- Remove references to environment variable
- Fixed to look at privileges for workflow step

## 1.0.12 - 2023-03-23

- Action consumer updated to aws sdk v3
- Data file upload added but disabled
- Updated doi question verbage and help text (EDPUB-792)
- Updated sample file help text (EDPUB-780)
- Updated science value question (EDPUB-774)
- Updated data format question text (EDPUB-778)
- Updated Node version to v18.14.1

## 1.0.11 - 2023-02-10

- Resolved snyk vulnerabilities
- Added question privileges to admin role
- Updated content based on kayako and jira tickets from info team and others
- Updated content based on google doc feedback from info team
- Updated ghrc hydrology to hydrometeorology
- Updated disciplines for ASF and ASDC DAACs
- Added support for roll based viewing and editing of questions
- Added support for deleting an input for a question

## 1.0.10 - 2022-10-25

- Changed png files to use svg files instead

## 1.0.9 - 2022-10-11

- Updated page structure and content for latest overview pages.

## 1.0.8 - 2022-09-02

- Added ASDC workflow darkhorse.

## 1.0.7 - 2022-08-29

- Updated producer table content to include middle initial.

## 1.0.6 - 2022-08-15

- Added ORNL and GHRC workflows.

## 1.0.5 - 2022-06-22

- Changed DOI content and added attributes for numbers to enforce positive number validation.

## 1.0.4 - 2022-05-12

- Updated old form name fragments to current form names

## 1.0.3 - 2022-05-05

- Added hidden column to groups to hide daacs not yet onboarding

## 1.0.2 - 2022-05-11

- Updated required if content and some other content tweaks

## 1.0.1 - 2022-04-13

- Updated to Node v14.19.1

## 1.0.0 - 2022-03-29

- EDPub MVP release

## 0.1.0

- Updated content to display links in forms properly.
- Updated Review Method not to use step type in condition.
- Added content changes. Changed 'Orcid' to 'ORCID', the inputs for data_product_doi, and the inputs for 'funding organization'
- Added additional workflows to test both forms and to assign workflows.
- Updated Permissions for 'Data Producer', 'Data Point of Contact' and 'Data Manager' to include forms permissions.
- Reduced vulnerabilities
- Updated CONTRIBUTING.md
- Add NASA Apache 2.0 license
- Updated content for table type to support inline editing
- Updated table type json elements
- Added CONTRIBUTING.md
- Lint fixes
- Added method for adding users to conversation
- Terraform cleanups and metrics report fix

## 0.0.0 - 2021-08-01

- Changelog initiated
