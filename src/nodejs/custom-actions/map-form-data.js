const mapping = {
  // "data_producer_info_name": "",
  // "data_producer_info_organization": "text",
  // "data_producer_info_email": "email",
  // "data_producer_info_orcid": "text",
  // "publication_poc_name": "text",
  // "publication_poc_organization": "text",
  // "publication_poc_email": "email",
  // "publication_poc_orcid": "text",
  // "funding_organization_name": "radio",
  // "funding_organization_other": "text",
  // "funding_program_name": "text",
  "data_product_name_value": (value) => [{ path: '$', assign: { 'ShortName': value, 'EntryTitle': value } }] ,
  "data_product_description": (value) => [{ path: '$', assign: { 'Abstract': value } }],
  //"publication_dois": (value) => [{ path: '$.PublicationReferences[n].DOI', type: 'space_delimited_list', assign: { 'DOI' : value} }],
  "science_value_description": (value) => [{ path: '$', assign: { 'Purpose': value } }],
  // "data_submission_reason_description": "textarea",
  // "data_submission_approval_dependencies_radios": "radio",
  // "data_submission_approval_dependencies_explanation": "text",
  // "data_product_restrictions_public": "radio",
  // "data_product_restrictions_explanation": "text",
  // "data_product_documentation_upload": "file",
  // "data_product_documentation_url": "text",
  // "data_product_doi_exists": "checkbox",
  "data_product_doi_value": (value) => [{ path: '$', assign: { 'DOI': { 'DOI': value } } }],
  // "product_temporal_coverage_start": "date",
  // "product_temporal_coverage_end": "date",
  // "product_temporal_coverage_ongoing": "radio",
  // "data_product_status": "radio",
  // "data_production_latency_amount": "number",
  // "data_production_latency_units": "radio",
  // "spatial_general_region": "text",
  // "data_format_ascii": "checkbox",
  // "data_format_geotiff": "checkbox",
  // "data_format_hdf5": "checkbox",
  // "data_format_hdf_eos": "checkbox",
  // "data_format_ogc_kml": "checkbox",
  // "data_format_netcdf_4": "checkbox",
  // "data_format_netcdf_classic": "checkbox",
  // "data_format_other": "checkbox",
  // "data_format_other_info": "text",
  // "data_product_volume_amount": "number",
  // "data_product_volume_units": "radio",
  // "example_file_upload": "file",
  // "example_file_url": "text",
  // "long_term_support_poc_name": "text",
  // "long_term_support_poc_organization": "text",
  // "long_term_support_poc_email": "email",
  // "long_term_support_poc_orcid": "text",
  // "funding_grant_number": "text",
  // "producer_group_org_row1": "text",
  // "producer_group_fname_row1": "text",
  // "producer_group_lname_row1": "text",
  // "producer_group_org_row2": "text",
  // "producer_group_fname_row2": "text",
  // "producer_group_lname_row2": "text",
  // "producer_group_org_row3": "text",
  // "producer_group_fname_row3": "text",
  // "producer_group_lname_row3": "text",
  // "data_product_type_observational": "checkbox",
  // "data_product_type_model": "checkbox",
  // "platform_instrument": "text",
  // "model_data_product": "text",
  // "data_processing_level": "radio",
  // "data_processing_other_info": "text",
  // "file_temporal_coverage_answer": "number",
  // "file_temporal_coverage_units": "radio",
  // "value_temporal_coverage_answer": "number",
  // "value_temporal_coverage_units": "radio",
  // "temporal_coverage_notes_textarea": "textarea",
  // "spatial_horizontal_1": "bbox",
  // "spatial_horizontal_2": "bbox",
  // "spatial_horizontal_3": "bbox",
  // "spatial_vertical_answer": "radio",
  // "spatial_vertical_details_upper": "number",
  // "spatial_vertical_details_upper_units": "radio",
  // "spatial_vertical_details_lower": "number",
  // "spatial_vertical_details_lower_units": "radio",
  // "spatial_data_file": "text",
  // "spatial_resolution": "text",
  // "spatial_notes_textarea": "textarea",
  // "variables_text": "text",
  // "data_product_number_of_files": "number",
  // "data_file_compression_answer": "radio",
  // "browse_images_provided": "radio",
  // "browse_images_other": "text",
  // "data_delivery_frequency": "radio",
  // "additional_file_upload": "file",
  // "additional_file_url": "text"
}

async function execute({ submission, data, AWS, DatabaseUtil, MessageUtil, Schema }) {
  const { metadata, form_data: formData } = submission;
  Object.entries(formData).reduce
}

module.export.execute = execute;


{
  "id": "389653ca-9743-4a2f-b6b8-4d819d728bfc",
  "form_id": "6c544723-241c-4896-a38c-adbc0a364293",
  "data": {
    "data_producer_info_name": "a",
    "data_producer_info_organization": "a",
    "data_producer_info_email": "a",
    "publication_poc_name": "a",
    "publication_poc_organization": "a",
    "publication_poc_email": "a",
    "funding_program_name": "a",
    "data_product_name_value": "a",
    "data_product_description": "a",
    "publication_dois": "a",
    "science_value_description": "a",
    "data_submission_reason_description": "a",
    "data_submission_approval_dependencies_radios": "No",
    "data_product_restrictions_public": "Yes",
    "product_temporal_coverage_start": "2021-02-11",
    "product_temporal_coverage_end": "2021-02-11",
    "product_temporal_coverage_ongoing": "No",
    "data_product_status": "No",
    "spatial_general_region": "a",
    "data_product_volume_amount": "1",
    "data_product_volume_units": "KB"
  }
}
