/* eslint-disable max-len, no-unused-expressions */
const stringToBool = (inputString) => {
  if (inputString?.toLowerCase() === 'true' || inputString?.toLowerCase() === 'yes') {
    return true;
  }
  return false;
};

// The Additional Attributes value property in UMMC v1.17.0 must be a string
// even if the data type is not a string
const stringToBoolString = (inputString) => stringToBool(inputString).toString();

function stripNullsFromObject(obj) {
  return Object.fromEntries(
    Object.entries(obj)
      // eslint-disable-next-line no-unused-vars
      .filter(([_, v]) => v != null && !Number.isNaN(v))
      .map(([k, v]) => [k, v === Object(v) ? stripNullsFromObject(v) : v])
  );
}

const mapEDPubToUmmc = async (formData) => {
  if (typeof formData !== 'object' || formData === null) return {};

  // Previously processing level was mapped to additional attributes but is being
  // remapped to Processing Level since this is where it should exist
  const dataProcessingLevel = formData.data_processing_level ? {
    ProcessingLevel: {
      Id: formData.data_processing_level === 'Other/Unsure' ? formData.data_processing_other_info : formData.data_processing_level
    }
  } : {};

  delete formData.data_processing_level;
  delete formData.data_processing_other_info;

  // Previously data producer, POC, and long term contact were mapped to DataCenter
  // but are being remapped to Contact Persons to avoid assumption that person is
  // affiliated with a DAAC
  const dataProducerSplitName = formData.data_producer_info_name?.split(' ') || [];
  delete formData.data_producer_info_name;

  const dataProducerAffiliation = formData.data_producer_info_organization
        && formData.data_producer_info_department
    ? `${formData.data_producer_info_organization} - ${formData.data_producer_info_department}`
    : formData.data_producer_info_organization || formData.data_producer_info_department;
  delete formData.data_producer_info_organization;
  delete formData.data_producer_info_department;

  const contactPerson = (dataProducerSplitName || formData.data_producer_info_email || formData.data_producer_info_orcid || dataProducerAffiliation) ? {
    ContactPersons: [
      {
        Roles: ['Science Contact'],
        FirstName: dataProducerSplitName[0] || '',
        LastName: dataProducerSplitName.length > 1 ? dataProducerSplitName.slice(-1)[0] : '',
        ContactInformation: {
          ContactMechanisms: [
            {
              Type: 'Email',
              Value: formData.data_producer_info_email
            }, ...(formData.data_producer_info_orcid ? [{
              Type: 'Other',
              Value: `ORCID: ${formData.data_producer_info_orcid}`
            }] : [])
          ]
        },
        NonDataCenterAffiliation: dataProducerAffiliation
      }
    ]
  } : {};
  delete formData.data_producer_info_email;
  delete formData.data_producer_info_orcid;

  if (!stringToBool(formData.same_as_poc_name_data_producer_info_name) && formData.poc_name) {
    const pocSplitName = formData.poc_name.split(' ') || [];
    delete formData.poc_name;
    const pocAffiliation = formData.poc_organization && formData.poc_department
      ? `${formData.poc_organization} - ${formData.poc_department}`
      : formData.poc_organization || formData.poc_department;
    delete formData.poc_organization;
    delete formData.poc_department;

    contactPerson.ContactPersons.push({
      Roles: ['Science Contact'],
      FirstName: pocSplitName[0] || '',
      LastName: pocSplitName.length > 1 ? pocSplitName.slice(-1)[0] : '',
      ContactInformation: {
        ContactMechanisms: [
          {
            Type: 'Email',
            Value: formData.poc_email
          }, ...(formData.poc_orcid ? [{
            Type: 'Other',
            Value: `ORCID: ${formData.poc_orcid}`
          }] : [])
        ]
      },
      NonDataCenterAffiliation: pocAffiliation
    });
    delete formData.poc_email;
    delete formData.poc_orcid;
  }
  delete formData.same_as_poc_name_data_producer_info_name;

  if (!stringToBool(formData.same_as_long_term_support_poc_name_data_producer_info_name) && formData.long_term_support_poc_name) {
    const ltsPocSplitName = formData.long_term_support_poc_name?.split(' ') || [];
    delete formData.long_term_support_poc_name;

    const ltsPocAffiliation = formData.long_term_support_poc_organization
            && formData.long_term_support_poc_department
      ? `${formData.long_term_support_poc_organization} - ${formData.long_term_support_poc_department}`
      : formData.long_term_support_poc_organization || formData.long_term_support_poc_department;
    delete formData.long_term_support_poc_organization;
    delete formData.long_term_support_poc_department;

    contactPerson.ContactPersons.push({
      Roles: ['Science Contact'],
      FirstName: ltsPocSplitName[0] || '',
      LastName: ltsPocSplitName.length > 1 ? ltsPocSplitName.slice(-1)[0] : '',
      ContactInformation: {
        ContactMechanisms: [
          {
            Type: 'Email',
            Value: formData.long_term_support_poc_email
          }, ...(formData.long_term_support_poc_orcid ? [{
            Type: 'Other',
            Value: `ORCID: ${formData.long_term_support_poc_orcid}`
          }] : [])
        ]
      },
      NonDataCenterAffiliation: ltsPocAffiliation
    });
    delete formData.long_term_support_poc_email;
    delete formData.long_term_support_poc_orcid;
  }
  delete formData.same_as_long_term_support_poc_name_data_producer_info_name;

  // Previously data producer citations were mapped to additional attributes but
  // is being remapped to Collection Citations since this is where it should exist
  let creatorsString = '';
  formData.data_producers_table?.forEach((creator) => {
    const creatorString = [creator?.producer_first_name, creator.producer_middle_initial || '', creator?.producer_last_name_or_organization].join(' ');
    creatorsString = creatorsString ? [creatorsString, creatorString].join(', ') : creatorString;
  });
  delete formData.data_producers_table;

  const dataProducersTableCitations = creatorsString ? {
    CollectionCitations: [{ Creator: creatorsString }]
  } : {};

  const abstract = { Abstract: formData.data_product_description };
  delete formData.data_product_description;

  const doi = formData.data_product_doi_value ? {
    DOI: { DOI: formData.data_product_doi_value }
  } : {
    DOI: { MissingReason: 'Not Applicable' }
  };
  delete formData.data_product_doi_value;

  const entryTitle = {
    EntryTitle: formData.data_product_name_value || 'Entry Title Not Provided'
  };
  delete formData.data_product_name_value;

  const temporalExtent = (formData.product_temporal_coverage_start || formData.product_temporal_coverage_end) ? {
    TemporalExtents: [{
      RangeDateTimes: [{
        BeginningDateTime: formData.product_temporal_coverage_start
          && new Date(formData.product_temporal_coverage_start),
        EndingDateTime: formData.product_temporal_coverage_end
          && new Date(formData.product_temporal_coverage_end)
      }]
    }]
  } : {};
  delete formData.product_temporal_coverage_start;
  delete formData.product_temporal_coverage_end;

  const spatialExtent = {
    SpatialExtent: {
      GranuleSpatialRepresentation: 'CARTESIAN',
      SpatialCoverageType: formData.spatial_vertical_answer?.toUpperCase() === 'YES' ? 'HORIZONTAL_VERTICAL' : 'HORIZONTAL',
      HorizontalSpatialDomain: {
        Geometry: {
          CoordinateSystem: 'CARTESIAN',
          BoundingRectangles: []
        }
      }
    }
  };
  delete formData.spatial_vertical_answer;

  let tmpArr = [{
    WestBoundingCoordinate: Number(formData.spatial_horizontal_1_west),
    NorthBoundingCoordinate: Number(formData.spatial_horizontal_1_north),
    EastBoundingCoordinate: Number(formData.spatial_horizontal_1_east),
    SouthBoundingCoordinate: Number(formData.spatial_horizontal_1_south)
  }, {
    WestBoundingCoordinate: Number(formData.spatial_horizontal_2_west),
    NorthBoundingCoordinate: Number(formData.spatial_horizontal_2_north),
    EastBoundingCoordinate: Number(formData.spatial_horizontal_2_east),
    SouthBoundingCoordinate: Number(formData.spatial_horizontal_2_south)
  }, {
    WestBoundingCoordinate: Number(formData.spatial_horizontal_3_west),
    NorthBoundingCoordinate: Number(formData.spatial_horizontal_3_north),
    EastBoundingCoordinate: Number(formData.spatial_horizontal_3_east),
    SouthBoundingCoordinate: Number(formData.spatial_horizontal_3_south)
  }];

  // Strip nulls and empty objects
  tmpArr = tmpArr.filter((value) => Object.keys(stripNullsFromObject(value)).length !== 0);
  spatialExtent.SpatialExtent.HorizontalSpatialDomain.Geometry.BoundingRectangles = spatialExtent.SpatialExtent.HorizontalSpatialDomain.Geometry.BoundingRectangles.concat(tmpArr);
  // Delete spatial extent information
  ['west', 'north', 'east', 'south'].forEach((direction) => {
    [1, 2, 3].forEach((directionSet) => {
      delete formData[`spatial_horizontal_${directionSet}_${direction}`];
    });
  });

  if (spatialExtent?.SpatialExtent?.SpatialCoverageType === 'HORIZONTAL_VERTICAL') {
    const isDepth = formData.spatial_vertical_details_lower > formData.spatial_vertical_details_upper;
    const upperStr = `${formData.spatial_vertical_details_upper} ${formData.spatial_vertical_details_upper_units}`;
    const lowerStr = `${formData.spatial_vertical_details_lower} ${formData.spatial_vertical_details_lower_units}`;
    spatialExtent.SpatialExtent.VerticalSpatialDomains = [
      {
        Type: `Minimum ${isDepth ? 'Depth' : 'Altitude'}`,
        Value: isDepth ? upperStr : lowerStr
      },
      {
        Type: `Maximum ${isDepth ? 'Depth' : 'Altitude'}`,
        Value: isDepth ? lowerStr : upperStr
      }
    ];
  }
  delete formData.spatial_vertical_details_lower;
  delete formData.spatial_vertical_details_upper;
  delete formData.spatial_vertical_details_lower_units;
  delete formData.spatial_vertical_details_upper_units;

  // Additional Attributes
  const additionalAttributes = [];

  formData.browse_images_other && additionalAttributes.push({
    Name: 'browse_images_other',
    Description: 'Additional information about browse images',
    DataType: 'STRING',
    Value: formData.browse_images_other
  });
  delete formData.browse_images_other;

  formData.browse_images_provided && additionalAttributes.push({
    Name: 'browse_images_provided',
    Description: 'Will browse images representing the data be provided as part of this data product?',
    DataType: 'BOOLEAN',
    Value: stringToBoolString(formData.browse_images_provided)
  });
  delete formData.browse_images_provided;

  formData.data_accession_approval_dependencies_radios && additionalAttributes.push({
    Name: 'data_accession_approval_dependencies_radios',
    Description: 'Do you have any dependencies related to this data product being approved to be published at the DAAC?',
    DataType: 'STRING',
    Value: formData.data_accession_approval_dependencies_radios
  });
  delete formData.data_accession_approval_dependencies_radios;

  formData.data_accession_reason_description && additionalAttributes.push({
    Name: 'data_accession_reason_description',
    Description: 'Why are you requesting to have this data product archived and distributed at the DAAC?',
    DataType: 'STRING',
    Value: formData.data_accession_reason_description
  });
  delete formData.data_accession_reason_description;

  formData.data_delivery_frequency && additionalAttributes.push({
    Name: 'data_delivery_frequency',
    Description: 'What is the anticipated frequency of additional data deliveries to the DAAC?',
    DataType: 'STRING',
    Value: formData.data_delivery_frequency
  });
  delete formData.data_delivery_frequency;

  formData.data_file_compression_answer && additionalAttributes.push({
    Name: 'data_file_compression_answer',
    Description: 'Is internal compression applied to the data files in this data product?',
    DataType: 'BOOLEAN',
    Value: stringToBoolString(formData.data_file_compression_answer)
  });
  delete formData.data_file_compression_answer;

  formData.data_format_ascii && additionalAttributes.push({
    Name: 'data_format_ascii',
    Description: 'Was data provided in ASCII format?',
    DataType: 'BOOLEAN',
    Value: stringToBoolString(formData.data_format_ascii)
  });
  delete formData.data_format_ascii;

  formData.data_format_geotiff && additionalAttributes.push({
    Name: 'data_format_geotiff',
    Description: 'Was data provided in GeoTIFF format?',
    DataType: 'BOOLEAN',
    Value: stringToBoolString(formData.data_format_geotiff)
  });
  delete formData.data_format_geotiff;

  formData.data_format_hdf5 && additionalAttributes.push({
    Name: 'data_format_hdf5',
    Description: 'Was data provided in HDF5 format?',
    DataType: 'BOOLEAN',
    Value: stringToBoolString(formData.data_format_hdf5)
  });
  delete formData.data_format_hdf5;

  formData.data_format_hdf_eos && additionalAttributes.push({
    Name: 'data_format_hdf_eos',
    Description: 'Was data provided in HDF-EOS 5 format?',
    DataType: 'BOOLEAN',
    Value: stringToBoolString(formData.data_format_hdf_eos)
  });
  delete formData.data_format_hdf_eos;

  formData.data_format_ogc_kml && additionalAttributes.push({
    Name: 'data_format_ogc_kml',
    Description: 'Was data provided in OGC KML format?',
    DataType: 'BOOLEAN',
    Value: stringToBoolString(formData.data_format_ogc_kml)
  });
  delete formData.data_format_ogc_kml;

  formData.data_format_netcdf_4 && additionalAttributes.push({
    Name: 'data_format_netcdf_4',
    Description: 'Was data provided in NetCDF-4 format?',
    DataType: 'BOOLEAN',
    Value: stringToBoolString(formData.data_format_netcdf_4)
  });
  delete formData.data_format_netcdf_4;

  formData.data_format_netcdf_classic && additionalAttributes.push({
    Name: 'data_format_netcdf_classic',
    Description: 'Was data provided in NetCDF Classic format?',
    DataType: 'BOOLEAN',
    Value: stringToBoolString(formData.data_format_netcdf_classic)
  });
  delete formData.data_format_netcdf_classic;

  formData.data_format_other && formData.data_format_other_info && additionalAttributes.push({
    Name: 'data_format_other',
    Description: `Was data provided in ${formData.data_format_other_info} format?`,
    DataType: 'BOOLEAN',
    Value: stringToBoolString(formData.data_format_other)
  });
  delete formData.data_format_other;
  delete formData.data_format_other_info;

  formData.data_product_documentation_url && additionalAttributes.push({
    Name: 'data_product_documentation_url',
    Description: "Are there any existing documents that you would like to have included in the review of your data product? If 'Yes', please provide URLs to the documents.",
    DataType: 'STRING',
    Value: formData.data_product_documentation_url
  });
  delete formData.data_product_documentation_url;

  // The Additional Attributes value property in UMMC v1.17.0 must be a string
  // even if the data type is not a string
  formData.data_product_number_of_files && additionalAttributes.push({
    Name: 'data_product_number_of_files',
    Description: 'What is the estimated or actual total number of files in this data product?',
    DataType: 'INT',
    Value: formData.data_product_number_of_files
  });
  delete formData.data_product_number_of_files;

  // Added more context to question in description field
  formData.data_product_restrictions_explanation && additionalAttributes.push({
    Name: 'data_product_restrictions_explanation',
    Description: 'If data product cannot be pulicly released, please provide a brief explanation.',
    DataType: 'STRING',
    Value: formData.data_product_restrictions_explanation
  });
  delete formData.data_product_restrictions_explanation;

  formData.data_product_restrictions_public && additionalAttributes.push({
    Name: 'data_product_restrictions_public',
    Description: 'Can this data product be publicly released in compliance with NASA"s Open Data Policy?',
    DataType: 'STRING',
    Value: formData.data_product_restrictions_public
  });
  delete formData.data_product_restrictions_public;

  formData.data_product_status && additionalAttributes.push({
    Name: 'data_product_status',
    Description: 'After this data product has been published at the DAAC, will you continue to collect or create new data to extend the time series?',
    DataType: 'BOOLEAN',
    Value: stringToBoolString(formData.data_product_status)
  });
  delete formData.data_product_status;

  formData.data_product_type_model && additionalAttributes.push({
    Name: 'data_product_type_model',
    Description: 'Are data within this data product model output?',
    DataType: 'BOOLEAN',
    Value: stringToBoolString(formData.data_product_type_model)
  });
  delete formData.data_product_type_model;

  formData.data_product_type_observational && additionalAttributes.push({
    Name: 'data_product_type_observational',
    Description: 'Are data within this data product observational?',
    DataType: 'BOOLEAN',
    Value: stringToBoolString(formData.data_product_type_observational)
  });
  delete formData.data_product_type_observational;

  // The Additional Attributes value property in UMMC v1.17.0 must be a string
  // even if the data type is not a string
  formData.data_product_volume_amount && formData.data_product_volume_units && additionalAttributes.push({
    Name: 'data_product_volume_amount',
    Description: 'What is the estimated or actual total volume of this data product?',
    DataType: 'FLOAT',
    Value: formData.data_product_volume_amount,
    ParameterUnitsOfMeasure: formData.data_product_volume_units
  });
  delete formData.data_product_volume_amount;
  delete formData.data_product_volume_units;

  formData.data_production_latency_units && additionalAttributes.push({
    Name: 'data_production_latency_units',
    Description: 'What is the expected time difference between the latest data observation reference time and the delivery of that data to the DAAC?',
    DataType: 'STRING',
    Value: formData.data_production_latency_units
  });
  delete formData.data_production_latency_units;

  formData.example_file_url && additionalAttributes.push({
    Name: 'example_file_url',
    Description: 'Please provide a URL to a sample file(s).',
    DataType: 'STRING',
    Value: formData.example_file_url
  });
  delete formData.example_file_url;

  // The Additional Attributes value property in UMMC v1.17.0 must be a string
  // even if the data type is not a string
  formData.file_temporal_coverage_answer && formData.file_temporal_coverage_units && additionalAttributes.push({
    Name: 'file_temporal_coverage_answer',
    Description: 'On average, how much time is covered by an individual data file?',
    DataType: 'FLOAT',
    Value: formData.file_temporal_coverage_answer,
    ParameterUnitsOfMeasure: formData.file_temporal_coverage_units
  });
  delete formData.file_temporal_coverage_answer;
  delete formData.file_temporal_coverage_units;

  formData.funding_grant_number && additionalAttributes.push({
    Name: 'funding_grant_number',
    Description: 'If available, please provide the grant number for the funding that supported the creation of this data product.',
    DataType: 'STRING',
    Value: formData.funding_grant_number
  });
  delete formData.funding_grant_number;

  formData.funding_nasa && additionalAttributes.push({
    Name: 'funding_nasa',
    Description: 'Did NASA help fund the creation of this data product?',
    DataType: 'BOOLEAN',
    Value: stringToBoolString(formData.funding_nasa)
  });
  delete formData.funding_nasa;

  formData.funding_noaa && additionalAttributes.push({
    Name: 'funding_noaa',
    Description: 'Did NOAA help fund the creation of this data product?',
    DataType: 'BOOLEAN',
    Value: stringToBoolString(formData.funding_noaa)
  });
  delete formData.funding_noaa;

  formData.funding_nsf && additionalAttributes.push({
    Name: 'funding_nsf',
    Description: 'Did NSF help fund the creation of this data product?',
    DataType: 'BOOLEAN',
    Value: stringToBoolString(formData.funding_nsf)
  });
  delete formData.funding_nsf;

  formData.funding_organization_other && additionalAttributes.push({
    Name: 'funding_organization_other',
    Description: 'Name(s) of University/other organization(s) that funded the creation of this data product',
    DataType: 'STRING',
    Value: formData.funding_organization_other
  });
  delete formData.funding_organization_other;

  formData.funding_other && additionalAttributes.push({
    Name: 'funding_other',
    Description: 'Did another organization help fund the creation of this data product?',
    DataType: 'BOOLEAN',
    Value: stringToBoolString(formData.funding_other)
  });
  delete formData.funding_other;

  formData.funding_program_name && additionalAttributes.push({
    Name: 'funding_program_name',
    Description: 'Under what program or program element within the funding organization was this data product created?',
    DataType: 'STRING',
    Value: formData.funding_program_name
  });
  delete formData.funding_program_name;

  formData.funding_university && additionalAttributes.push({
    Name: 'funding_university',
    Description: 'Did a University help fund the creation of this data product?',
    DataType: 'BOOLEAN',
    Value: stringToBoolString(formData.funding_university)
  });
  delete formData.funding_university;

  formData.funding_usgs && additionalAttributes.push({
    Name: 'funding_usgs',
    Description: 'Did USGS help fund the creation of this data product?',
    DataType: 'BOOLEAN',
    Value: stringToBoolString(formData.funding_usgs)
  });
  delete formData.funding_usgs;

  formData.model_data_product && additionalAttributes.push({
    Name: 'model_data_product',
    Description: 'What is the name and version of the model used to produce this data product?',
    DataType: 'STRING',
    Value: formData.model_data_product
  });
  delete formData.model_data_product;

  formData.platform_instrument && additionalAttributes.push({
    Name: 'platform_instrument',
    Description: 'What platform(s) and instrument(s) were used to collect the data within this data product?',
    DataType: 'STRING',
    Value: formData.platform_instrument
  });
  delete formData.platform_instrument;

  formData.science_value_description && additionalAttributes.push({
    Name: 'science_value_description',
    Description: 'What is the science value of this data product?',
    DataType: 'STRING',
    Value: formData.science_value_description
  });
  delete formData.science_value_description;

  // The Additional Attributes value property in UMMC v1.17.0 must be a string
  // even if the data type is not a string
  formData.value_temporal_resolution_answer && formData.value_temporal_resolution_units && additionalAttributes.push({
    Name: 'value_temporal_resolution_answer',
    Description: 'On average, what is the temporal resolution of an individual data value within the data files?',
    DataType: 'FLOAT',
    Value: formData.value_temporal_resolution_answer,
    ParameterUnitsOfMeasure: formData.value_temporal_resolution_units
  });
  delete formData.value_temporal_resolution_answer;
  delete formData.value_temporal_resolution_units;

  formData.variables_text && additionalAttributes.push({
    Name: 'variables_text',
    Description: 'What are the primary variables represented in this data product?',
    DataType: 'STRING',
    Value: formData.variables_text
  });
  delete formData.variables_text;

  // The following were mapped to variables which don't actually exist in UMM-C so
  // they have been remapped to the additional attributes section
  formData.data_accession_approval_dependencies_explanation && additionalAttributes.push({
    Name: 'data_accession_approval_dependencies_explanation',
    Description: 'Please provide a brief explanation of any dependencies related to this data product being approved to be published at the DAAC.',
    DataType: 'STRING',
    Value: formData.data_accession_approval_dependencies_explanation
  });
  delete formData.data_accession_approval_dependencies_explanation;

  formData.spatial_data_file && additionalAttributes.push({
    Name: 'spatial_data_file',
    Description: 'In general, how much geographical area is covered by an individual data file?',
    DataType: 'STRING',
    Value: formData.spatial_data_file
  });
  delete formData.spatial_data_file;

  formData.spatial_general_region && additionalAttributes.push({
    Name: 'spatial_general_region',
    Description: 'What is the general geographic region covered by this data product?',
    DataType: 'STRING',
    Value: formData.spatial_general_region
  });
  delete formData.spatial_general_region;

  formData.spatial_notes_textarea && additionalAttributes.push({
    Name: 'spatial_notes_textarea',
    Description: 'Is there any additional spatial information that will help the DAAC understand this data product?',
    DataType: 'STRING',
    Value: formData.spatial_notes_textarea
  });
  delete formData.spatial_notes_textarea;

  formData.spatial_resolution && additionalAttributes.push({
    Name: 'spatial_resolution',
    Description: 'What is the spatial resolution of an individual data value within the data files?',
    DataType: 'STRING',
    Value: formData.spatial_resolution
  });
  delete formData.spatial_resolution;

  formData.temporal_coverage_notes_textarea && additionalAttributes.push({
    Name: 'temporal_coverage_notes_textarea',
    Description: 'Is there any additional temporal information that will help the DAAC understand this data product?',
    DataType: 'STRING',
    Value: formData.temporal_coverage_notes_textarea
  });
  delete formData.temporal_coverage_notes_textarea;

  const metadataDates = {
    MetadataDates: [
      {
        Date: new Date(),
        Type: 'CREATE'
      },
      {
        Date: new Date(),
        Type: 'UPDATE'
      }
    ]
  };

  const metadataSpecification = {
    MetadataSpecification: {
      URL: 'https://cdn.earthdata.nasa.gov/umm/collection/v1.17.0',
      Name: 'UMM-C',
      Version: '1.17.0'
    }
  };

  // Added to capture DAAC specific questions
  Object.keys(formData).forEach((extra) => {
    additionalAttributes.push({
      Name: extra,
      Description: `Additional EDPub Form Response with id: ${extra}`,
      DataType: 'STRING',
      Value: typeof formData[extra] === 'object' ? JSON.stringify(formData[extra]) : `${formData[extra]}`
    });
    delete formData[extra];
  });

  // Stringify then parse to avoid errors with undefined in JSON by removing attributes
  // with undefined value
  // TODO- Test how CMR handles this in case some are required attributes
  return JSON.parse(JSON.stringify({
    ...(dataProcessingLevel || {}),
    ...(contactPerson || {}),
    ...(dataProducersTableCitations || {}),
    ...(abstract || {}),
    ...(doi || {}),
    ...(entryTitle || {}),
    ...(temporalExtent || {}),
    ...(spatialExtent || {}),
    ...(additionalAttributes ? { AdditionalAttributes: additionalAttributes } : {}),
    ...(metadataDates || {}),
    ...(metadataSpecification || {})
  }));
};

module.exports.mapEDPubToUmmc = mapEDPubToUmmc;
