module.exports.model = (path) => ({
  $schema: 'http://json-schema.org/draft-04/schema#',
  title: 'UMM-C',
  type: 'object',
  additionalProperties: false,
  properties: {
    MetadataLanguage: {
      description: 'The language used in the metadata record.',
      $ref: `#${path}LanguageType`
    },
    MetadataDates: {
      description: 'Dates related to activities involving the metadata record itself.  For example, Future Review date is the date that the metadata record is scheduled to be reviewed.',
      type: 'array',
      items: { $ref: `#${path}DateType` },
      minItems: 0
    },
    DirectoryNames: {
      description: 'Formerly called Internal Directory Name (IDN) Node (IDN_Node). This element has been used historically by the GCMD internally to identify association, responsibility and/or ownership of the dataset, service or supplemental information. Note: This field only occurs in the DIF. When a DIF record is retrieved in the ECHO10 or ISO 19115 formats, this element will not be translated. The controlled vocabulary for directory names is maintained in the Keyword Management System (KMS).',
      type: 'array',
      items: { $ref: `#${path}DirectoryNameType` },
      minItems: 0
    },
    EntryTitle: {
      description: 'The title of the collection or service described by the metadata.',
      $ref: `#${path}EntryTitleType`
    },
    DOI: {
      description: "This element stores the DOI (Digital Object Identifier) that identifies the collection. Note: The values should start with the directory indicator which in ESDIS' case is 10.  If the DOI was registered through ESDIS, the beginning of the string should be 10.5067. The DOI URL is not stored here; it should be stored as a RelatedURL. The DOI organization that is responsible for creating the DOI is described in the Authority element. For ESDIS records the value of https://doi.org/ should be used. For those that want to specify that a DOI is not applicable or unknown use the second option.",
      $ref: `#${path}DoiType`
    },
    AssociatedDOIs: {
      description: "This element stores DOIs that are associated with the collection such as from campaigns and other related sources. Note: The values should start with the directory indicator which in ESDIS' case is 10.  If the DOI was registered through ESDIS, the beginning of the string should be 10.5067. The DOI URL is not stored here; it should be stored as a RelatedURL. The DOI organization that is responsible for creating the DOI is described in the Authority element. For ESDIS records the value of https://doi.org/ should be used.",
      type: 'array',
      items: { $ref: `#${path}AssociatedDoiType` },
      minItems: 1
    },
    Abstract: {
      description: 'A brief description of the collection or service the metadata represents.',
      $ref: `#${path}AbstractType`
    },
    Purpose: {
      description: 'Suggested usage or purpose for the collection data or service.',
      $ref: `#${path}PurposeType`
    },
    DataLanguage: {
      description: 'Describes the language used in the preparation, storage, and description of the collection. It is the language of the collection data themselves.   It does not refer to the language used in the metadata record (although this may be the same language).',
      $ref: `#${path}LanguageType`
    },
    DataDates: {
      description: 'Dates related to activities involving the collection data.  For example, Creation date is the date that the collection data first entered the data archive system.',
      type: 'array',
      items: { $ref: `#${path}DateType` },
      minItems: 1
    },
    DataCenters: {
      description: 'Information about the data centers responsible for this collection and its metadata.',
      type: 'array',
      items: {
        $ref: `#${path}DataCenterType`
      },
      minItems: 1
    },
    ContactGroups: {
      description: 'Information about the personnel groups responsible for this collection and its metadata.',
      type: 'array',
      items: {
        $ref: `#${path}ContactGroupType`
      }
    },
    ContactPersons: {
      description: 'Information about the personnel responsible for this collection and its metadata.',
      type: 'array',
      items: {
        $ref: `#${path}ContactPersonType`
      }
    },
    CollectionDataType: {
      description: "This element is used to identify the collection's ready for end user consumption latency from when the data was acquired by an instrument. NEAR_REAL_TIME is defined to be ready for end user consumption 1 to 3 hours after data acquisition. LOW_LATENCY is defined to be ready for consumption 3 to 24 hours after data acquisition. EXPEDITED is defined to be 1 to 4 days after data acquisition. SCIENCE_QUALITY is defined to mean that a collection has been fully and completely processed which usually takes between 2 to 3 weeks after data acquisition. OTHER is defined for collection where the latency is between EXPEDITED and SCIENCE_QUALITY.",
      $ref: `#${path}CollectionDataTypeEnum`
    },
    StandardProduct: {
      description: 'This element is reserved for NASA records only. A Standard Product is a product that has been vetted to ensure that they are complete, consistent, maintain integrity, and satifies the goals of the Earth Observing System mission. The NASA product owners have also commmitted to archiving and maintaining the data products. More information can be found here: https://earthdata.nasa.gov/eosdis/science-system-description/eosdis-standard-products.',
      type: 'boolean'
    },
    ProcessingLevel: {
      description: 'The identifier for the processing level of the collection (e.g., Level0, Level1A).',
      $ref: `#${path}ProcessingLevelType`
    },
    CollectionCitations: {
      description: 'Information required to properly cite the collection in professional scientific literature. This element provides information for constructing a citation for the item itself, and is not designed for listing bibliographic references of scientific research articles arising from search results. A list of references related to the research results should be in the Publication Reference element.',
      type: 'array',
      items: {
        $ref: `#${path}ResourceCitationType`
      },
      minItems: 0
    },
    CollectionProgress: {
      description: 'This element describes the production status of the data set. There are five choices for Data Providers: PLANNED refers to data sets to be collected in the future and are thus unavailable at the present time. For Example: The Hydro spacecraft has not been launched, but information on planned data sets may be available. ACTIVE refers to data sets currently in production or data that is continuously being collected or updated. For Example: data from the AIRS instrument on Aqua is being collected continuously. COMPLETE refers to data sets in which no updates or further data collection will be made. For Example: Nimbus-7 SMMR data collection has been completed. DEPRECATED refers to data sets that have been retired, but still can be retrieved. Usually newer products exist that replace the retired data set. NOT APPLICABLE refers to data sets in which a collection progress is not applicable such as a calibration collection. There is a sixth value of NOT PROVIDED that should not be used by a data provider. It is currently being used as a value when a correct translation cannot be done with the current valid values, or when the value is not provided by the data provider.',
      $ref: `#${path}CollectionProgressEnum`
    },
    Quality: {
      description: 'Free text description of the quality of the collection data.  Description may include: 1) succinct description of the quality of data in the collection; 2) Any quality assurance procedures followed in producing the data in the collection; 3) indicators of collection quality or quality flags - both validated or invalidated; 4) recognized or potential problems with quality; 5) established quality control mechanisms; and 6) established quantitative quality measurements.',
      $ref: `#${path}QualityType`
    },
    UseConstraints: {
      description: 'Designed to protect privacy and/or intellectual property by allowing the author to specify how the collection may or may not be used after access is granted. This includes any special restrictions, legal prerequisites, terms and conditions, and/or limitations on using the item. Providers may request acknowledgement of the item from users and claim no responsibility for quality and completeness. Note: Use Constraints describe how the item may be used once access has been granted; and is distinct from Access Constraints, which refers to any constraints in accessing the item.',
      $ref: `#${path}UseConstraintsType`
    },
    AccessConstraints: {
      description: "Allows the author to constrain access to the collection. This includes any special restrictions, legal prerequisites, limitations and/or warnings on obtaining collection data. Some words that may be used in this element's value include: Public, In-house, Limited, None. The value field is used for special ACL rules (Access Control Lists (http://en.wikipedia.org/wiki/Access_control_list)). For example it can be used to hide metadata when it isn't ready for public consumption.",
      $ref: `#${path}AccessConstraintsType`
    },
    ArchiveAndDistributionInformation: {
      description: 'This element and all of its sub elements exist for display purposes. It allows a data provider to provide archive and distribution information up front to an end user, to help them decide if they can use the product.',
      $ref: `#${path}ArchiveAndDistributionInformationType`
    },
    DirectDistributionInformation: {
      description: 'This element allows end users to get direct access to data products that are stored in the Amazon Web Service (AWS) S3 buckets. The sub elements include S3 credentials end point and a documentation URL as well as bucket prefix names and an AWS region.',
      $ref: `#${path}DirectDistributionInformationType`
    },
    PublicationReferences: {
      description: 'Describes key bibliographic citations pertaining to the collection.',
      type: 'array',
      items: {
        $ref: `#${path}PublicationReferenceType`
      },
      minItems: 0
    },
    ISOTopicCategories: {
      description: 'Identifies the topic categories from the EN ISO 19115-1:2014 Geographic Information – Metadata – Part 1: Fundamentals (http://www.isotc211.org/) Topic Category Code List that pertain to this collection, based on the Science Keywords associated with the collection. An ISO Topic Category is a high-level thematic classification to assist in the grouping of and search for available collections. The controlled vocabulary for ISO topic categories is maintained in the Keyword Management System (KMS).',
      type: 'array',
      items: { type: 'string', minLength: 1, maxLength: 4000 },
      minItems: 0
    },
    ScienceKeywords: {
      description: 'Controlled Science Keywords describing the collection.  The controlled vocabulary for Science Keywords is maintained in the Keyword Management System (KMS).',
      type: 'array',
      items: {
        $ref: `#${path}ScienceKeywordType`
      },
      minItems: 1
    },
    AncillaryKeywords: {
      description: 'Allows authors to provide words or phrases outside of the controlled Science Keyword vocabulary, to further describe the collection.',
      type: 'array',
      items: {
        $ref: `#${path}AncillaryKeywordStringType`
      },
      minItems: 0
    },
    AdditionalAttributes: {
      description: 'The data’s distinctive attributes of the collection (i.e. attributes used to describe the unique characteristics of the collection which extend beyond those defined).',
      type: 'array',
      items: {
        $ref: `#${path}AdditionalAttributeType`
      },
      minItems: 0
    },
    MetadataAssociations: {
      description: 'This element is used to identify other services, collections, visualizations, granules, and other metadata types and resources that are associated with or dependent on the data described by the metadata. This element is also used to identify a parent metadata record if it exists. This usage should be reserved for instances where a group of metadata records are subsets that can be better represented by one parent metadata record, which describes the entire set. In some instances, a child may point to more than one parent. The EntryId is the same as the element described elsewhere in this document where it contains an ID and Version.',
      type: 'array',
      items: {
        $ref: `#${path}MetadataAssociationType`
      },
      minItems: 1
    },
    TemporalExtents: {
      description: 'This class contains attributes which describe the temporal range of a specific collection. Temporal Extent includes a specification of the Temporal Range Type of the collection, which is one of Range Date Time, Single Date Time, or Periodic Date Time',
      type: 'array',
      items: {
        $ref: `#${path}TemporalExtentType`
      },
      minItems: 1
    },
    PaleoTemporalCoverages: {
      description: 'For paleoclimate or geologic data, PaleoTemporalCoverage is the length of time represented by the data collected. PaleoTemporalCoverage should be used when the data spans time frames earlier than yyyy-mm-dd = 0001-01-01.',
      type: 'array',
      items: { $ref: `#${path}PaleoTemporalCoverageType` },
      minItems: 0
    },
    TemporalKeywords: {
      description: 'One or more words or phrases that describe the temporal resolution of the dataset.',
      type: 'array',
      items: {
        $ref: `#${path}KeywordStringType`
      },
      minItems: 0
    },
    SpatialExtent: { $ref: `#${path}SpatialExtentType` },
    TilingIdentificationSystems: {
      description: 'Name of the two-dimensional tiling system for the collection.  Previously called TwoDCoordinateSystem.',
      type: 'array',
      items: { $ref: `#${path}TilingIdentificationSystemType` },
      minItems: 0
    },
    SpatialInformation: {
      description: 'The reference frame or system in which altitudes (elevations) are given. The information contains the datum name, distance units and encoding method, which provide the definition for the system. This field also stores the characteristics of the reference frame or system from which depths are measured. The additional information in the field is geometry reference data etc.',
      $ref: `#${path}SpatialInformationType`
    },
    SpatialKeywords: {
      description: 'This is deprecated and will be removed. Use LocationKeywords instead. Controlled hierarchical keywords used to specify the spatial location of the collection.   The controlled vocabulary for spatial keywords is maintained in the Keyword Management System (KMS).  The Spatial Keyword hierarchy includes one or more of the following layers: Location_Category (e.g., Continent), Location_Type (e.g. Africa), Location_Subregion1 (e.g., Central Africa), Location_Subregion2 (e.g., Cameroon), and Location_Subregion3.',
      type: 'array',
      items: {
        $ref: `#${path}KeywordStringType`
      },
      minItems: 1
    },
    LocationKeywords: {
      description: 'Controlled hierarchical keywords used to specify the spatial location of the collection.   The controlled vocabulary for spatial keywords is maintained in the Keyword Management System (KMS).  The Spatial Keyword hierarchy includes one or more of the following layers: Category (e.g., Continent), Type (e.g. Africa), Subregion1 (e.g., Central Africa), Subregion2 (e.g., Cameroon), and Subregion3. DetailedLocation exists outside the hierarchy.',
      type: 'array',
      items: { $ref: `#${path}LocationKeywordType` }
    },
    Platforms: {
      description: 'Information about the relevant platform(s) used to acquire the data in the collection. The controlled vocabulary for platform types is maintained in the Keyword Management System (KMS), and includes Spacecraft, Aircraft, Vessel, Buoy, Platform, Station, Network, Human, etc.',
      type: 'array',
      items: { $ref: `#${path}PlatformType` },
      minItems: 1
    },
    Projects: {
      description: 'The name of the scientific program, field campaign, or project from which the data were collected. This element is intended for the non-space assets such as aircraft, ground systems, balloons, sondes, ships, etc. associated with campaigns. This element may also cover a long term project that continuously creates new data sets — like MEaSUREs from ISCCP and NVAP or CMARES from MISR. Project also includes the Campaign sub-element to support multiple campaigns under the same project.',
      type: 'array',
      items: { $ref: `#${path}ProjectType` },
      minItems: 1
    },
    RelatedUrls: {
      description: 'This element describes any data/service related URLs that include project home pages, services, related data archives/servers, metadata extensions, direct links to online software packages, web mapping services, links to images, or other data.',
      type: 'array',
      items: {
        $ref: `#${path}RelatedUrlType`
      },
      minItems: 1
    },
    ShortName: {
      description: 'The short name associated with the collection.',
      $ref: `#${path}ShortNameType`
    },
    Version: {
      description: 'The Version of the collection.',
      $ref: `#${path}VersionType`
    },
    VersionDescription: {
      description: 'The Version Description of the collection.',
      $ref: `#${path}VersionDescriptionType`
    },
    MetadataSpecification: {
      description: "Requires the client, or user, to add in schema information into every collection record. It includes the schema's name, version, and URL location. The information is controlled through enumerations at the end of this schema.",
      $ref: `#${path}MetadataSpecificationType`
    }
  },
  required: [
    'ShortName',
    'Version',
    'EntryTitle',
    'Abstract',
    'DOI',
    'DataCenters',
    'ProcessingLevel',
    'ScienceKeywords',
    'TemporalExtents',
    'SpatialExtent',
    'Platforms',
    'CollectionProgress',
    'MetadataSpecification'
  ],
  definitions: {
    UseConstraintsDescriptionType: {
      type: 'object',
      additionalProperties: false,
      description: 'This sub-element either contains a license summary or free-text description that details the permitted use or limitation of this collection.',
      properties: {
        Description: {
          description: 'This sub-element either contains a license summary or free-text description that details the permitted use or limitation of this collection.',
          type: 'string',
          minLength: 1,
          maxLength: 4000
        }
      }
    },
    UseConstraintsDescType: {
      description: 'This sub-element either contains a license summary or free-text description that details the permitted use or limitation of this collection.',
      type: 'string',
      minLength: 1,
      maxLength: 4000
    },
    FreeAndOpenDataType: {
      description: "This sub-element if true, describes to end users and machines that this collection's data is free of charge and open for any use the user sees fit.",
      type: 'boolean'
    },
    UseConstraintsType: {
      description: 'This element defines how the data may or may not be used after access is granted to assure the protection of privacy or intellectual property. This includes license text, license URL, or any special restrictions, legal prerequisites, terms and conditions, and/or limitations on using the data set. Data providers may request acknowledgement of the data from users and claim no responsibility for quality and completeness of data.',
      oneOf: [
        {
          type: 'object',
          additionalProperties: false,
          description: 'This element defines how the data may or may not be used after access is granted to assure the protection of privacy or intellectual property. This includes license text, license URL, or any special restrictions, legal prerequisites, terms and conditions, and/or limitations on using the data set. Data providers may request acknowledgement of the data from users and claim no responsibility for quality and completeness of data.',
          properties: {
            Description: { $ref: `#${path}UseConstraintsDescType` },
            FreeAndOpenData: { $ref: `#${path}FreeAndOpenDataType` }
          },
          required: [ 'Description' ]
        },
        {
          type: 'object',
          additionalProperties: false,
          description: 'This element defines how the data may or may not be used after access is granted to assure the protection of privacy or intellectual property. This includes license text, license URL, or any special restrictions, legal prerequisites, terms and conditions, and/or limitations on using the data set. Data providers may request acknowledgement of the data from users and claim no responsibility for quality and completeness of data.',
          properties: {
            Description: { $ref: `#${path}UseConstraintsDescType` },
            LicenseURL: {
              description: 'This element holds the URL and associated information to access the License on the web. If this element is used the LicenseText element cannot be used.',
              $ref: `#${path}OnlineResourceType`
            },
            FreeAndOpenData: { $ref: `#${path}FreeAndOpenDataType` }
          },
          required: [ 'LicenseURL' ]
        },
        {
          type: 'object',
          additionalProperties: false,
          description: 'This element defines how the data may or may not be used after access is granted to assure the protection of privacy or intellectual property. This includes license text, license URL, or any special restrictions, legal prerequisites, terms and conditions, and/or limitations on using the data set. Data providers may request acknowledgement of the data from users and claim no responsibility for quality and completeness of data.',
          properties: {
            Description: { $ref: `#${path}UseConstraintsDescType` },
            LicenseText: {
              description: 'This element holds the actual license text. If this element is used the LicenseUrl element cannot be used.',
              type: 'string',
              minLength: 1,
              maxLength: 20000
            },
            FreeAndOpenData: { $ref: `#${path}FreeAndOpenDataType` }
          },
          required: [ 'LicenseText' ]
        }
      ]
    },
    DirectoryNameType: {
      type: 'object',
      additionalProperties: false,
      description: 'Formerly called Internal Directory Name (IDN) Node (IDN_Node). This element has been used historically by the GCMD internally to identify association, responsibility and/or ownership of the dataset, service or supplemental information. Note: This field only occurs in the DIF. When a DIF record is retrieved in the ECHO10 or ISO 19115 formats, this element will not be translated.',
      properties: {
        ShortName: {
          $ref: `#${path}ShortNameType`
        },
        LongName: {
          $ref: `#${path}LongNameType`
        }
      },
      required: [ 'ShortName' ]
    },
    ProcessingLevelType: {
      type: 'object',
      additionalProperties: false,
      description: 'This element contains the Processing Level Id and the Processing Level Description',
      properties: {
        ProcessingLevelDescription: {
          description: "Description of the meaning of the Processing Level Id, e.g., the Description for the Level4 Processing Level Id might be 'Model output or results from analyses of lower level data'",
          type: 'string',
          minLength: 1,
          maxLength: 2048
        },
        Id: {
          description: 'An identifier indicating the level at which the data in the collection are processed, ranging from Level0 (raw instrument data at full resolution) to Level4 (model output or analysis results).  The value of Processing Level Id is chosen from a controlled vocabulary.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        }
      },
      required: [ 'Id' ]
    },
    PaleoTemporalCoverageType: {
      type: 'object',
      additionalProperties: false,
      description: 'For paleoclimate or geologic data, PaleoTemporalCoverage is the length of time represented by the data collected. PaleoTemporalCoverage should be used when the data spans time frames earlier than yyyy-mm-dd = 0001-01-01.',
      properties: {
        ChronostratigraphicUnits: {
          description: 'Hierarchy of terms indicating units of geologic time, i.e., eon (e.g, Phanerozoic), era (e.g., Cenozoic), period (e.g., Paleogene), epoch (e.g., Oligocene), and stage or age (e.g, Chattian).',
          type: 'array',
          items: { $ref: `#${path}ChronostratigraphicUnitType` },
          minItems: 0
        },
        StartDate: {
          description: 'A string indicating the number of years furthest back in time, including units, e.g., 100 Ga.  Units may be Ga (billions of years before present), Ma (millions of years before present), ka (thousands of years before present) or ybp (years before present).',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        EndDate: {
          description: 'A string indicating the number of years closest to the present time, including units, e.g., 10 ka.  Units may be Ga (billions of years before present), Ma (millions of years before present), ka (thousands of years before present) or ybp (years before present).',
          type: 'string',
          minLength: 1,
          maxLength: 80
        }
      }
    },
    ChronostratigraphicUnitType: {
      type: 'object',
      additionalProperties: false,
      properties: {
        Eon: {
          $ref: `#${path}KeywordStringType`
        },
        Era: {
          $ref: `#${path}KeywordStringType`
        },
        Epoch: {
          $ref: `#${path}KeywordStringType`
        },
        Stage: {
          $ref: `#${path}KeywordStringType`
        },
        DetailedClassification: {
          $ref: `#${path}KeywordStringType`
        },
        Period: {
          $ref: `#${path}KeywordStringType`
        }
      },
      required: [ 'Eon' ]
    },
    SpatialExtentType: {
      type: 'object',
      additionalProperties: false,
      description: 'Specifies the geographic and vertical (altitude, depth) coverage of the data.',
      properties: {
        SpatialCoverageType: {
          description: "Denotes whether the collection's spatial coverage requires horizontal, vertical, horizontal and vertical, orbit, or vertical and orbit in the spatial domain and coordinate system definitions.",
          $ref: `#${path}SpatialCoverageTypeEnum`
        },
        HorizontalSpatialDomain: { $ref: `#${path}HorizontalSpatialDomainType` },
        VerticalSpatialDomains: {
          type: 'array',
          items: { $ref: `#${path}VerticalSpatialDomainType` }
        },
        OrbitParameters: { $ref: `#${path}OrbitParametersType` },
        GranuleSpatialRepresentation: { $ref: `#${path}GranuleSpatialRepresentationEnum` }
      },
      required: [ 'GranuleSpatialRepresentation' ]
    },
    SpatialCoverageTypeEnum: {
      type: 'string',
      enum: [
        'HORIZONTAL',
        'VERTICAL',
        'ORBITAL',
        'HORIZONTAL_VERTICAL',
        'ORBITAL_VERTICAL',
        'HORIZONTAL_ORBITAL',
        'HORIZONTAL_VERTICAL_ORBITAL'
      ]
    },
    HorizontalSpatialDomainType: {
      type: 'object',
      additionalProperties: false,
      description: 'Information about a collection with horizontal spatial coverage.',
      properties: {
        ZoneIdentifier: {
          description: "The appropriate numeric or alpha code used to identify the various zones in the collection's grid coordinate system.",
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        Geometry: { $ref: `#${path}GeometryType` },
        ResolutionAndCoordinateSystem: {
          description: 'Specifies the horizontal spatial extents coordinate system and its resolution.',
          $ref: `#${path}ResolutionAndCoordinateSystemType`
        }
      },
      required: [ 'Geometry' ]
    },
    GeometryType: {
      type: 'object',
      additionalProperties: false,
      properties: {
        CoordinateSystem: { $ref: `#${path}CoordinateSystemEnum` },
        Points: {
          type: 'array',
          items: { $ref: `#${path}PointType` },
          minItems: 1
        },
        BoundingRectangles: {
          type: 'array',
          items: { $ref: `#${path}BoundingRectangleType` },
          minItems: 1
        },
        GPolygons: {
          type: 'array',
          items: { $ref: `#${path}GPolygonType` },
          minItems: 1
        },
        Lines: {
          type: 'array',
          items: { $ref: `#${path}LineType` },
          minItems: 1
        }
      },
      required: [ 'CoordinateSystem' ],
      anyOf: [
        { required: [ 'Points' ] },
        { required: [ 'BoundingRectangles' ] },
        { required: [ 'GPolygons' ] },
        { required: [ 'Lines' ] }
      ]
    },
    CoordinateSystemEnum: { type: 'string', enum: [ 'CARTESIAN', 'GEODETIC' ] },
    PointType: {
      type: 'object',
      additionalProperties: false,
      description: 'The longitude and latitude values of a spatially referenced point in degrees.',
      properties: {
        Longitude: { $ref: `#${path}LongitudeType` },
        Latitude: { $ref: `#${path}LatitudeType` }
      },
      required: [ 'Longitude', 'Latitude' ]
    },
    LatitudeType: {
      description: 'The latitude value of a spatially referenced point, in degrees.  Latitude values range from -90 to 90.',
      type: 'number',
      minimum: -90,
      maximum: 90
    },
    LongitudeType: {
      description: 'The longitude value of a spatially referenced point, in degrees.  Longitude values range from -180 to 180.',
      type: 'number',
      minimum: -180,
      maximum: 180
    },
    BoundingRectangleType: {
      type: 'object',
      additionalProperties: false,
      properties: {
        WestBoundingCoordinate: { $ref: `#${path}LongitudeType` },
        NorthBoundingCoordinate: { $ref: `#${path}LatitudeType` },
        EastBoundingCoordinate: { $ref: `#${path}LongitudeType` },
        SouthBoundingCoordinate: { $ref: `#${path}LatitudeType` }
      },
      required: [
        'WestBoundingCoordinate',
        'NorthBoundingCoordinate',
        'EastBoundingCoordinate',
        'SouthBoundingCoordinate'
      ]
    },
    GPolygonType: {
      type: 'object',
      additionalProperties: false,
      properties: {
        Boundary: { $ref: `#${path}BoundaryType` },
        ExclusiveZone: { $ref: `#${path}ExclusiveZoneType` }
      },
      required: [ 'Boundary' ]
    },
    BoundaryType: {
      type: 'object',
      additionalProperties: false,
      description: 'A boundary is set of points connected by straight lines representing a polygon on the earth. It takes a minimum of three points to make a boundary. Points must be specified in counter-clockwise order and closed (the first and last vertices are the same).',
      properties: {
        Points: {
          type: 'array',
          items: { $ref: `#${path}PointType` },
          minItems: 4
        }
      },
      required: [ 'Points' ]
    },
    ExclusiveZoneType: {
      type: 'object',
      additionalProperties: false,
      description: 'Contains the excluded boundaries from the GPolygon.',
      properties: {
        Boundaries: {
          type: 'array',
          items: { $ref: `#${path}BoundaryType` },
          minItems: 1
        }
      },
      required: [ 'Boundaries' ]
    },
    LineType: {
      type: 'object',
      additionalProperties: false,
      properties: {
        Points: {
          type: 'array',
          items: { $ref: `#${path}PointType` },
          minItems: 2
        }
      },
      required: [ 'Points' ]
    },
    VerticalSpatialDomainType: {
      type: 'object',
      additionalProperties: false,
      properties: {
        Type: {
          description: 'Describes the type of the area of vertical space covered by the collection locality.',
          $ref: `#${path}VerticalSpatialDomainTypeEnum`
        },
        Value: {
          description: 'Describes the extent of the area of vertical space covered by the collection. Must be accompanied by an Altitude Encoding Method description. The datatype for this attribute is the value of the attribute VerticalSpatialDomainType. The unit for this attribute is the value of either DepthDistanceUnits or AltitudeDistanceUnits.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        }
      },
      required: [ 'Type', 'Value' ]
    },
    VerticalSpatialDomainTypeEnum: {
      type: 'string',
      enum: [
        'Atmosphere Layer',
        'Maximum Altitude',
        'Maximum Depth',
        'Minimum Altitude',
        'Minimum Depth'
      ]
    },
    FootprintType: {
      type: 'object',
      additionalProperties: false,
      description: "The largest width of an instrument's footprint as measured on the Earths surface. The largest Footprint takes the place of SwathWidth in the Orbit Backtrack Algorithm if SwathWidth does not exist. The optional description element allows the user of the record to be able to distinguish between the different footprints of an instrument if it has more than 1.",
      properties: {
        Footprint: {
          description: "The largest width of an instrument's footprint as measured on the Earths surface. The largest Footprint takes the place of SwathWidth in the Orbit Backtrack Algorithm if SwathWidth does not exist.",
          type: 'number'
        },
        FootprintUnit: {
          description: "The Footprint value's unit.",
          enum: [ 'Kilometer', 'Meter' ]
        },
        Description: {
          description: 'The description element allows the user of the record to be able to distinguish between the different footprints of an instrument if it has more than 1.',
          type: 'string'
        }
      },
      required: [ 'Footprint', 'FootprintUnit' ]
    },
    OrbitParametersType: {
      type: 'object',
      additionalProperties: false,
      description: 'Orbit parameters for the collection used by the Orbital Backtrack Algorithm.',
      properties: {
        SwathWidth: {
          description: 'Total observable width of the satellite sensor nominally measured at the equator.',
          type: 'number'
        },
        SwathWidthUnit: {
          description: "The SwathWidth value's unit.",
          enum: [ 'Kilometer', 'Meter' ]
        },
        Footprints: {
          description: "A list of instrument footprints or field of views. A footprint holds the largest width of the described footprint as measured on the earths surface along with the width's unit. An optional description element exists to be able to distinguish between the footprints, if that is desired. This element is optional. If this element is used at least 1 footprint must exist in the list.",
          type: 'array',
          items: { $ref: `#${path}FootprintType` },
          minItems: 1
        },
        OrbitPeriod: {
          description: 'The time in decimal minutes the satellite takes to make one full orbit.',
          type: 'number'
        },
        OrbitPeriodUnit: {
          description: "The Orbit Period value's unit.",
          enum: [ 'Decimal Minute' ]
        },
        InclinationAngle: {
          description: 'The heading of the satellite as it crosses the equator on the ascending pass. This is the same as (180-declination) and also the same as the highest latitude achieved by the satellite.',
          type: 'number'
        },
        InclinationAngleUnit: {
          description: "The InclinationAngle value's unit.",
          enum: [ 'Degree' ]
        },
        NumberOfOrbits: {
          description: 'The number of full orbits composing each granule. This may be a fraction of an orbit.',
          type: 'number'
        },
        StartCircularLatitude: {
          description: 'The latitude start of the orbit relative to the equator. This is used by the backtrack search algorithm to treat the orbit as if it starts from the specified latitude. This is optional and will default to 0 if not specified.',
          type: 'number'
        },
        StartCircularLatitudeUnit: {
          description: "The StartCircularLatitude value's unit.",
          enum: [ 'Degree' ]
        }
      },
      anyOf: [
        { required: [ 'SwathWidth', 'SwathWidthUnit' ] },
        { required: [ 'Footprints' ] }
      ],
      required: [
        'OrbitPeriod',
        'OrbitPeriodUnit',
        'InclinationAngle',
        'InclinationAngleUnit',
        'NumberOfOrbits'
      ],
      dependencies: { StartCircularLatitude: [ 'StartCircularLatitudeUnit' ] }
    },
    GranuleSpatialRepresentationEnum: {
      type: 'string',
      enum: [ 'CARTESIAN', 'GEODETIC', 'ORBIT', 'NO_SPATIAL' ]
    },
    TilingIdentificationSystemType: {
      type: 'object',
      additionalProperties: false,
      description: 'Information about a two-dimensional tiling system related to this collection.',
      properties: {
        TilingIdentificationSystemName: { $ref: `#${path}TilingIdentificationSystemNameEnum` },
        Coordinate1: { $ref: `#${path}TilingCoordinateType` },
        Coordinate2: { $ref: `#${path}TilingCoordinateType` }
      },
      required: [
        'TilingIdentificationSystemName',
        'Coordinate1',
        'Coordinate2'
      ]
    },
    TilingCoordinateType: {
      type: 'object',
      additionalProperties: false,
      description: 'Defines the minimum and maximum value for one dimension of a two dimensional coordinate system.',
      properties: {
        MinimumValue: { type: 'number' },
        MaximumValue: { type: 'number' }
      }
    },
    TilingIdentificationSystemNameEnum: {
      type: 'string',
      enum: [
        'CALIPSO',
        'MISR',
        'MODIS Tile EASE',
        'MODIS Tile SIN',
        'WELD Alaska Tile',
        'WELD CONUS Tile',
        'WRS-1',
        'WRS-2',
        'Military Grid Reference System'
      ]
    },
    SpatialInformationType: {
      type: 'object',
      additionalProperties: false,
      description: 'This entity stores the reference frame or system from which horizontal and vertical spatial domains are measured. The horizontal reference frame includes a Geodetic Model, Geographic Coordinates, and Local Coordinates. The Vertical reference frame includes altitudes (elevations) and depths.',
      properties: {
        VerticalCoordinateSystem: { $ref: `#${path}VerticalCoordinateSystemType` },
        SpatialCoverageType: {
          description: 'Denotes whether the spatial coverage of the collection is horizontal, vertical, horizontal and vertical, orbit, or vertical and orbit.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        }
      },
      required: [ 'SpatialCoverageType' ]
    },
    VerticalCoordinateSystemType: {
      type: 'object',
      additionalProperties: false,
      properties: {
        AltitudeSystemDefinition: { $ref: `#${path}AltitudeSystemDefinitionType` },
        DepthSystemDefinition: { $ref: `#${path}DepthSystemDefinitionType` }
      }
    },
    AltitudeDistanceUnitsEnum: {
      description: 'The units in which altitude measurements are recorded.',
      type: 'string',
      enum: [ 'HectoPascals', 'Kilometers', 'Millibars' ]
    },
    DepthDistanceUnitsEnum: {
      description: 'The units in which depth measurements are recorded.',
      type: 'string',
      enum: [ 'Fathoms', 'Feet', 'HectoPascals', 'Meters', 'Millibars' ]
    },
    AltitudeSystemDefinitionType: {
      type: 'object',
      additionalProperties: false,
      description: "The reference frame or system from which altitude is measured. The term 'altitude' is used instead of the common term 'elevation' to conform to the terminology in Federal Information Processing Standards 70-1 and 173. The information contains the datum name, distance units and encoding method, which provide the definition for the system.",
      properties: {
        DatumName: {
          description: 'The identification given to the level surface taken as the surface of reference from which measurements are compared.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        DistanceUnits: {
          description: 'The units in which measurements are recorded.',
          $ref: `#${path}AltitudeDistanceUnitsEnum`
        },
        Resolutions: {
          description: 'The minimum distance possible between two adjacent values, expressed in distance units of measure for the collection.',
          type: 'array',
          items: { type: 'number' },
          minItems: 0
        }
      }
    },
    DepthSystemDefinitionType: {
      type: 'object',
      additionalProperties: false,
      description: 'The reference frame or system from which depth is measured. The information contains the datum name, distance units and encoding method, which provide the definition for the system.',
      properties: {
        DatumName: {
          description: 'The identification given to the level surface taken as the surface of reference from which measurements are compared.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        DistanceUnits: {
          description: 'The units in which measurements are recorded.',
          $ref: `#${path}DepthDistanceUnitsEnum`
        },
        Resolutions: {
          description: 'The minimum distance possible between two adjacent values, expressed in distance units of measure for the collection.',
          type: 'array',
          items: { type: 'number' },
          minItems: 0
        }
      }
    },
    ResolutionAndCoordinateSystemType: {
      description: "This class defines the horizontal spatial extents coordinate system and the data product's horizontal data resolution. The horizontal data resolution is defined as the smallest horizontal distance between successive elements of data in a dataset. This is synonymous with terms such as ground sample distance, sample spacing and pixel size. It is to be noted that the horizontal data resolution could be different in the two horizontal dimensions. Also, it is different from the spatial resolution of an instrument, which is the minimum distance between points that an instrument can see as distinct.",
      type: 'object',
      oneOf: [
        {
          additionalProperties: false,
          properties: {
            Description: {
              description: 'This element holds a description about the resolution and coordinate system for people to read.',
              $ref: `#${path}DescriptionType`
            },
            GeodeticModel: {
              description: 'This element describes the geodetic model for the data product.',
              $ref: `#${path}GeodeticModelType`
            }
          },
          required: [ 'GeodeticModel' ]
        },
        {
          additionalProperties: false,
          properties: {
            Description: {
              description: 'This element holds a description about the resolution and coordinate system for people to read.',
              $ref: `#${path}DescriptionType`
            },
            GeodeticModel: {
              description: 'This element describes the geodetic model for the data product.',
              $ref: `#${path}GeodeticModelType`
            },
            HorizontalDataResolution: {
              description: 'This class defines a number of the data products horizontal data resolution. The horizontal data resolution is defined as the smallest horizontal distance between successive elements of data in a dataset. This is synonymous with terms such as ground sample distance, sample spacing and pixel size. It is to be noted that the horizontal data resolution could be different in the two horizontal dimensions. Also, it is different from the spatial resolution of an instrument, which is the minimum distance between points that an instrument can see as distinct.',
              $ref: `#${path}HorizontalDataResolutionType`
            }
          },
          required: [ 'HorizontalDataResolution' ]
        },
        {
          additionalProperties: false,
          properties: {
            Description: {
              description: 'This element holds a description about the resolution and coordinate system for people to read.',
              $ref: `#${path}DescriptionType`
            },
            GeodeticModel: {
              description: 'This element describes the geodetic model for the data product.',
              $ref: `#${path}GeodeticModelType`
            },
            LocalCoordinateSystem: {
              description: 'This element describes the local coordinate system for the data product.',
              $ref: `#${path}LocalCoordinateSystemType`
            }
          },
          required: [ 'LocalCoordinateSystem' ]
        }
      ]
    },
    DescriptionType: {
      description: 'This element defines what a description is.',
      type: 'string',
      minLength: 1,
      maxLength: 2048
    },
    GeodeticModelType: {
      description: 'This element describes the geodetic model for the data product.',
      type: 'object',
      additionalProperties: false,
      properties: {
        HorizontalDatumName: {
          description: 'The identification given to the reference system used for defining the coordinates of points.',
          $ref: `#${path}DatumNameType`
        },
        EllipsoidName: {
          description: "Identification given to established representation of the Earth's shape.",
          type: 'string',
          minLength: 1,
          maxLength: 255
        },
        SemiMajorAxis: {
          description: 'Radius of the equatorial axis of the ellipsoid.',
          type: 'number'
        },
        DenominatorOfFlatteningRatio: {
          description: "The ratio of the Earth's major axis to the difference between the major and the minor.",
          type: 'number'
        }
      }
    },
    DatumNameType: {
      description: 'The identification given to the level surface taken as the surface of reference from which measurements are compared.',
      type: 'string',
      minLength: 1,
      maxLength: 80
    },
    HorizontalDataResolutionType: {
      description: 'This class defines a number of the data products horizontal data resolution. The horizontal data resolution is defined as the smallest horizontal distance between successive elements of data in a dataset. This is synonymous with terms such as ground sample distance, sample spacing and pixel size. It is to be noted that the horizontal data resolution could be different in the two horizontal dimensions. Also, it is different from the spatial resolution of an instrument, which is the minimum distance between points that an instrument can see as distinct.',
      type: 'object',
      additionalProperties: false,
      properties: {
        VariesResolution: {
          description: 'Varies Resolution object describes a data product that has a number of resolution values.',
          $ref: `#${path}HorizontalDataResolutionVariesType`
        },
        PointResolution: {
          description: 'Point Resolution object describes a data product that is from a point source.',
          $ref: `#${path}HorizontalDataResolutionPointType`
        },
        NonGriddedResolutions: {
          description: 'Non Gridded Resolutions object describes resolution data for non gridded data products.',
          type: 'array',
          items: {
            $ref: `#${path}HorizontalDataResolutionNonGriddedType`
          },
          minItems: 1
        },
        NonGriddedRangeResolutions: {
          description: 'Non Gridded Range Resolutions object describes range resolution data for non gridded data products.',
          type: 'array',
          items: {
            $ref: `#${path}HorizontalDataResolutionNonGriddedRangeType`
          },
          minItems: 1
        },
        GriddedResolutions: {
          description: 'Gridded Resolutions object describes resolution data for gridded data products.',
          type: 'array',
          items: {
            $ref: `#${path}HorizontalDataResolutionGriddedType`
          },
          minItems: 1
        },
        GriddedRangeResolutions: {
          description: 'Gridded Range Resolutions object describes range resolution data for gridded data products.',
          type: 'array',
          items: {
            $ref: `#${path}HorizontalDataResolutionGriddedRangeType`
          },
          minItems: 1
        },
        GenericResolutions: {
          description: 'Generic Resolutions object describes general resolution data for a data product where it is not known if a data product is gridded or not.',
          type: 'array',
          items: {
            $ref: `#${path}HorizontalDataGenericResolutionType`
          },
          minItems: 1
        }
      }
    },
    HorizontalDataResolutionVariesType: {
      description: 'Varies Resolution object describes a data product that has a number of resolution values.',
      type: 'string',
      enum: [ 'Varies' ]
    },
    HorizontalDataResolutionPointType: {
      description: 'Point Resolution object describes a data product that is from a point source.',
      type: 'string',
      enum: [ 'Point' ]
    },
    HorizontalDataResolutionNonGriddedType: {
      description: 'Non Gridded Resolutions object describes resolution data for non gridded data products.',
      type: 'object',
      additionalProperties: false,
      properties: {
        XDimension: {
          description: 'The minimum difference between two adjacent values on a horizontal plane in the X axis. In most cases this is along the longitudinal axis.',
          type: 'number'
        },
        YDimension: {
          description: 'The minimum difference between two adjacent values on a horizontal plan in the Y axis. In most cases this is along the latitudinal axis.',
          type: 'number'
        },
        Unit: {
          description: 'Units of measure used for the XDimension and YDimension values.',
          $ref: `#${path}HorizontalDataResolutionUnitEnum`
        },
        ViewingAngleType: {
          description: 'This element describes the angle of the measurement with respect to the instrument that gives an understanding of the specified resolution.',
          $ref: `#${path}HorizontalResolutionViewingAngleType`
        },
        ScanDirection: {
          description: 'This element describes the instrument scanning direction.',
          $ref: `#${path}HorizontalResolutionScanDirectionType`
        }
      },
      anyOf: [
        { required: [ 'XDimension', 'Unit' ] },
        { required: [ 'YDimension', 'Unit' ] }
      ]
    },
    HorizontalDataResolutionNonGriddedRangeType: {
      description: 'Non Gridded Range Resolutions object describes range resolution data for non gridded data products.',
      type: 'object',
      additionalProperties: false,
      properties: {
        MinimumXDimension: {
          description: 'The minimum, minimum difference between two adjacent values on a horizontal plane in the X axis. In most cases this is along the longitudinal axis.',
          type: 'number'
        },
        MinimumYDimension: {
          description: 'The minimum, minimum difference between two adjacent values on a horizontal plan in the Y axis. In most cases this is along the latitudinal axis.',
          type: 'number'
        },
        MaximumXDimension: {
          description: 'The maximum, minimum difference between two adjacent values on a horizontal plane in the X axis. In most cases this is along the longitudinal axis.',
          type: 'number'
        },
        MaximumYDimension: {
          description: 'The maximum, minimum difference between two adjacent values on a horizontal plan in the Y axis. In most cases this is along the latitudinal axis.',
          type: 'number'
        },
        Unit: {
          description: 'Units of measure used for the XDimension and YDimension values.',
          $ref: `#${path}HorizontalDataResolutionUnitEnum`
        },
        ViewingAngleType: {
          description: 'This element describes the angle of the measurement with respect to the instrument that gives an understanding of the specified resolution.',
          $ref: `#${path}HorizontalResolutionViewingAngleType`
        },
        ScanDirection: {
          description: 'This element describes the instrument scanning direction.',
          $ref: `#${path}HorizontalResolutionScanDirectionType`
        }
      },
      anyOf: [
        {
          required: [ 'MinimumXDimension', 'MaximumXDimension', 'Unit' ]
        },
        {
          required: [ 'MinimumYDimension', 'MaximumYDimension', 'Unit' ]
        }
      ]
    },
    HorizontalDataResolutionGriddedType: {
      description: 'Gridded Resolutions object describes resolution data for gridded data products.',
      type: 'object',
      additionalProperties: false,
      properties: {
        XDimension: {
          description: 'The minimum difference between two adjacent values on a horizontal plane in the X axis. In most cases this is along the longitudinal axis.',
          type: 'number'
        },
        YDimension: {
          description: 'The minimum difference between two adjacent values on a horizontal plan in the Y axis. In most cases this is along the latitudinal axis.',
          type: 'number'
        },
        Unit: {
          description: 'Units of measure used for the XDimension and YDimension values.',
          $ref: `#${path}HorizontalDataResolutionUnitEnum`
        }
      },
      anyOf: [
        { required: [ 'XDimension', 'Unit' ] },
        { required: [ 'YDimension', 'Unit' ] }
      ]
    },
    HorizontalDataResolutionGriddedRangeType: {
      description: 'Gridded Range Resolutions object describes range resolution data for gridded data products.',
      type: 'object',
      additionalProperties: false,
      properties: {
        MinimumXDimension: {
          description: 'The minimum, minimum difference between two adjacent values on a horizontal plane in the X axis. In most cases this is along the longitudinal axis.',
          type: 'number'
        },
        MinimumYDimension: {
          description: 'The minimum, minimum difference between two adjacent values on a horizontal plan in the Y axis. In most cases this is along the latitudinal axis.',
          type: 'number'
        },
        MaximumXDimension: {
          description: 'The maximum, minimum difference between two adjacent values on a horizontal plane in the X axis. In most cases this is along the longitudinal axis.',
          type: 'number'
        },
        MaximumYDimension: {
          description: 'The maximum, minimum difference between two adjacent values on a horizontal plan in the Y axis. In most cases this is along the latitudinal axis.',
          type: 'number'
        },
        Unit: {
          description: 'Units of measure used for the XDimension and YDimension values.',
          $ref: `#${path}HorizontalDataResolutionUnitEnum`
        }
      },
      anyOf: [
        {
          required: [ 'MinimumXDimension', 'MaximumXDimension', 'Unit' ]
        },
        {
          required: [ 'MinimumYDimension', 'MaximumYDimension', 'Unit' ]
        }
      ]
    },
    HorizontalDataGenericResolutionType: {
      description: 'Generic Resolutions object describes general resolution data for a data product where it is not known if a data product is gridded or not.',
      type: 'object',
      additionalProperties: false,
      properties: {
        XDimension: {
          description: 'The minimum difference between two adjacent values on a horizontal plane in the X axis. In most cases this is along the longitudinal axis.',
          type: 'number'
        },
        YDimension: {
          description: 'The minimum difference between two adjacent values on a horizontal plan in the Y axis. In most cases this is along the latitudinal axis.',
          type: 'number'
        },
        Unit: {
          description: 'Units of measure used for the XDimension and YDimension values.',
          $ref: `#${path}HorizontalDataResolutionUnitEnum`
        }
      },
      anyOf: [
        { required: [ 'XDimension', 'Unit' ] },
        { required: [ 'YDimension', 'Unit' ] }
      ]
    },
    HorizontalDataResolutionUnitEnum: {
      description: 'Units of measure used for the geodetic latitude and longitude resolution values (e.g., decimal degrees).',
      type: 'string',
      enum: [
        'Decimal Degrees',
        'Kilometers',
        'Meters',
        'Statute Miles',
        'Nautical Miles',
        'Not provided'
      ]
    },
    HorizontalResolutionViewingAngleType: {
      description: 'This element describes the angle of the measurement with respect to the instrument that give an understanding of the specified resolution.',
      type: 'string',
      enum: [ 'At Nadir', 'Scan Extremes' ]
    },
    HorizontalResolutionScanDirectionType: {
      description: 'This element describes the instrument scanning direction.',
      type: 'string',
      enum: [ 'Along Track', 'Cross Track' ]
    },
    LocalCoordinateSystemType: {
      type: 'object',
      additionalProperties: false,
      properties: {
        GeoReferenceInformation: {
          description: 'The information provided to register the local system to the Earth (e.g. control points, satellite ephemeral data, and inertial navigation data).',
          type: 'string',
          minLength: 1,
          maxLength: 2048
        },
        Description: {
          description: 'A description of the Local Coordinate System and geo-reference information.',
          type: 'string',
          minLength: 1,
          maxLength: 2048
        }
      }
    },
    CollectionDataTypeEnum: {
      description: "This element is used to identify the collection's ready for end user consumption latency from when the data was acquired by an instrument. NEAR_REAL_TIME is defined to be ready for end user consumption 1 to 3 hours after data acquisition. LOW_LATENCY is defined to be ready for consumption 3 to 24 hours after data acquisition. EXPEDITED is defined to be 1 to 4 days after data acquisition. SCIENCE_QUALITY is defined to mean that a collection has been fully and completely processed which usually takes between 2 to 3 weeks after data acquisition. OTHER is defined for collection where the latency is between EXPEDITED and SCIENCE_QUALITY.",
      type: 'string',
      enum: [
        'NEAR_REAL_TIME',
        'LOW_LATENCY',
        'EXPEDITED',
        'SCIENCE_QUALITY',
        'OTHER'
      ]
    },
    CollectionProgressEnum: {
      description: 'This element describes the production status of the data set. There are five choices for Data Providers: PLANNED refers to data sets to be collected in the future and are thus unavailable at the present time. For Example: The Hydro spacecraft has not been launched, but information on planned data sets may be available. ACTIVE refers to data sets currently in production or data that is continuously being collected or updated. For Example: data from the AIRS instrument on Aqua is being collected continuously. COMPLETE refers to data sets in which no updates or further data collection will be made. For Example: Nimbus-7 SMMR data collection has been completed. DEPRECATED refers to data sets that have been retired, but still can be retrieved. Usually newer products exist that replace the retired data set. NOT APPLICABLE refers to data sets in which a collection progress is not applicable such as a calibration collection. There is a sixth value of NOT PROVIDED that should not be used by a data provider. It is currently being used as a value when a correct translation cannot be done with the current valid values, or when the value is not provided by the data provider.',
      type: 'string',
      enum: [
        'ACTIVE',
        'PLANNED',
        'COMPLETE',
        'DEPRECATED',
        'NOT APPLICABLE',
        'NOT PROVIDED'
      ]
    },
    LocationKeywordType: {
      description: 'This element defines a hierarchical location list. It replaces SpatialKeywords. The controlled vocabulary for location keywords is maintained in the Keyword Management System (KMS). Each tier must have data in the tier above it.',
      type: 'object',
      additionalProperties: false,
      properties: {
        Category: {
          description: 'Top-level controlled keyword hierarchical level that contains the largest general location where the collection data was taken from.',
          $ref: `#${path}KeywordStringType`
        },
        Type: {
          description: 'Second-tier controlled keyword hierarchical level that contains the regional location where the collection data was taken from',
          $ref: `#${path}KeywordStringType`
        },
        Subregion1: {
          description: 'Third-tier controlled keyword hierarchical level that contains the regional sub-location where the collection data was taken from',
          $ref: `#${path}KeywordStringType`
        },
        Subregion2: {
          description: 'Fourth-tier controlled keyword hierarchical level that contains the regional sub-location where the collection data was taken from',
          $ref: `#${path}KeywordStringType`
        },
        Subregion3: {
          description: 'Fifth-tier controlled keyword hierarchical level that contains the regional sub-location where the collection data was taken from',
          $ref: `#${path}KeywordStringType`
        },
        DetailedLocation: {
          description: 'Uncontrolled keyword hierarchical level that contains the specific location where the collection data was taken from. Exists outside the hierarchy.',
          $ref: `#${path}KeywordStringType`
        }
      },
      required: [ 'Category' ]
    },
    ArchiveDistributionFormatTypeEnum: {
      description: 'Defines the possible values for the Archive or Distribution file format type.',
      type: 'string',
      enum: [ 'Native', 'Supported' ]
    },
    ArchiveDistributionFormatDescriptionType: {
      description: 'Allows a data provider to provide supporting information about the stated format.',
      type: 'string',
      minLength: 1,
      maxLength: 80
    },
    ArchiveDistributionUnitEnum: {
      description: 'Defines the possible values for the archive and distribution size units.',
      type: 'string',
      enum: [ 'KB', 'MB', 'GB', 'TB', 'PB', 'NA' ]
    },
    DistributionMediaType: {
      description: 'This element defines the media by which the end user can obtain the distributable item. Examples of media include: CD-ROM, 9 track tape, diskettes, hard drives, online, transparencies, hardcopy, etc.',
      type: 'string',
      minLength: 1,
      maxLength: 80
    },
    FileArchiveInformationType: {
      description: 'This element defines a single archive artifact which a data provider would like to inform an end user that it exists.',
      anyOf: [
        {
          type: 'object',
          additionalProperties: false,
          properties: {
            Format: {
              description: 'This element defines a single format for an archival artifact. Examples of format include: ascii, binary, GRIB, BUFR, HDF4, HDF5, HDF-EOS4, HDF-EOS5, jpeg, png, tiff, geotiff, kml. The controlled vocabulary for formats is maintained in the Keyword Management System (KMS).',
              type: 'string',
              minLength: 1,
              maxLength: 80
            },
            FormatType: {
              description: "Allows the provider to state whether the archivable item's format is its native format or another supported format.",
              $ref: `#${path}ArchiveDistributionFormatTypeEnum`
            },
            FormatDescription: {
              description: 'Allows the record provider to provide supporting documentation about the Format.',
              $ref: `#${path}ArchiveDistributionFormatDescriptionType`
            },
            AverageFileSize: {
              description: 'An approximate average size of the archivable item. This gives an end user an idea of the magnitude for each archivable file if more than 1 exists.',
              type: 'number'
            },
            AverageFileSizeUnit: {
              description: 'Unit of measure for the average file size.',
              $ref: `#${path}ArchiveDistributionUnitEnum`
            },
            TotalCollectionFileSize: {
              description: 'An approximate total size of all of the archivable items within a collection. This gives an end user an idea of the magnitude for all of archivable files combined.',
              type: 'number'
            },
            TotalCollectionFileSizeUnit: {
              description: 'Unit of measure for the total collection file size.',
              $ref: `#${path}ArchiveDistributionUnitEnum`
            },
            Description: {
              description: 'Provides the data provider a way to convey more information about the archivable item.',
              type: 'string',
              minLength: 1,
              maxLength: 1024
            }
          },
          required: [ 'Format' ],
          dependencies: {
            AverageFileSize: [ 'AverageFileSizeUnit' ],
            TotalCollectionFileSize: [ 'TotalCollectionFileSizeUnit' ]
          }
        },
        {
          type: 'object',
          additionalProperties: false,
          properties: {
            Format: {
              description: 'This element defines a single format for an archival artifact. Examples of format include: ascii, binary, GRIB, BUFR, HDF4, HDF5, HDF-EOS4, HDF-EOS5, jpeg, png, tiff, geotiff, kml. The controlled vocabulary for formats is maintained in the Keyword Management System (KMS).',
              type: 'string',
              minLength: 1,
              maxLength: 80
            },
            FormatType: {
              description: "Allows the provider to state whether the archivable item's format is its native format or another supported format.",
              $ref: `#${path}ArchiveDistributionFormatTypeEnum`
            },
            FormatDescription: {
              description: 'Allows the record provider to provide supporting documentation about the Format.',
              $ref: `#${path}ArchiveDistributionFormatDescriptionType`
            },
            AverageFileSize: {
              description: 'An approximate average size of the archivable item. This gives an end user an idea of the magnitude for each archivable file if more than 1 exists.',
              type: 'number'
            },
            AverageFileSizeUnit: {
              description: 'Unit of measure for the average file size.',
              $ref: `#${path}ArchiveDistributionUnitEnum`
            },
            TotalCollectionFileSizeBeginDate: {
              description: 'The date of which this collection started to collect data.  This date is used by users to be able to calculate the current total collection file size. The date needs to be in the yyyy-MM-ddTHH:mm:ssZ format; for example: 2018-01-01T10:00:00Z.',
              format: 'date-time',
              type: 'string'
            },
            Description: {
              description: 'Provides the data provider a way to convey more information about the archivable item.',
              type: 'string',
              minLength: 1,
              maxLength: 1024
            }
          },
          required: [ 'Format' ],
          dependencies: {
            AverageFileSize: [ 'AverageFileSizeUnit' ],
            TotalCollectionFileSizeBeginDate: [ 'AverageFileSize' ]
          }
        }
      ]
    },
    FileDistributionInformationType: {
      description: 'This element defines a single artifact that is distributed by the data provider. This element only includes the distributable artifacts that can be obtained by the user without the user having to invoke a service. These should be documented in the UMM-S specification.',
      anyOf: [
        {
          type: 'object',
          additionalProperties: false,
          properties: {
            Format: {
              description: 'This element defines a single format for a distributable artifact. Examples of format include: ascii, binary, GRIB, BUFR, HDF4, HDF5, HDF-EOS4, HDF-EOS5, jpeg, png, tiff, geotiff, kml.',
              type: 'string',
              minLength: 1,
              maxLength: 80
            },
            FormatType: {
              description: "Allows the provider to state whether the distributable item's format is its native format or another supported format.",
              $ref: `#${path}ArchiveDistributionFormatTypeEnum`
            },
            FormatDescription: {
              description: 'Allows the record provider to provide supporting documentation about the Format.',
              $ref: `#${path}ArchiveDistributionFormatDescriptionType`
            },
            Media: {
              description: 'This element defines the media by which the end user can obtain the distributable item. Each media type is listed separately. Examples of media include: CD-ROM, 9 track tape, diskettes, hard drives, online, transparencies, hardcopy, etc.',
              type: 'array',
              items: { $ref: `#${path}DistributionMediaType` },
              minItems: 1
            },
            AverageFileSize: {
              description: 'An approximate average size of the distributable item. This gives an end user an idea of the magnitude for each distributable file if more than 1 exists.',
              type: 'number'
            },
            AverageFileSizeUnit: {
              description: 'Unit of measure for the average file size.',
              $ref: `#${path}ArchiveDistributionUnitEnum`
            },
            TotalCollectionFileSize: {
              description: 'An approximate total size of all of the distributable items within a collection. This gives an end user an idea of the magnitude for all of distributable files combined.',
              type: 'number'
            },
            TotalCollectionFileSizeUnit: {
              description: 'Unit of measure for the total collection file size.',
              $ref: `#${path}ArchiveDistributionUnitEnum`
            },
            Description: {
              description: 'Provides the data provider a way to convey more information about the distributable item.',
              type: 'string',
              minLength: 1,
              maxLength: 1024
            },
            Fees: {
              description: 'Conveys the price one has to pay to obtain the distributable item.',
              type: 'string',
              minLength: 1,
              maxLength: 255
            }
          },
          required: [ 'Format' ],
          dependencies: {
            AverageFileSize: [ 'AverageFileSizeUnit' ],
            TotalCollectionFileSize: [ 'TotalCollectionFileSizeUnit' ]
          }
        },
        {
          type: 'object',
          additionalProperties: false,
          properties: {
            Format: {
              description: 'This element defines a single format for a distributable artifact. Examples of format include: ascii, binary, GRIB, BUFR, HDF4, HDF5, HDF-EOS4, HDF-EOS5, jpeg, png, tiff, geotiff, kml.',
              type: 'string',
              minLength: 1,
              maxLength: 80
            },
            FormatType: {
              description: "Allows the provider to state whether the distributable item's format is its native format or another supported format.",
              $ref: `#${path}ArchiveDistributionFormatTypeEnum`
            },
            FormatDescription: {
              description: 'Allows the record provider to provide supporting documentation about the Format.',
              $ref: `#${path}ArchiveDistributionFormatDescriptionType`
            },
            Media: {
              description: 'This element defines the media by which the end user can obtain the distributable item. Each media type is listed separately. Examples of media include: CD-ROM, 9 track tape, diskettes, hard drives, online, transparencies, hardcopy, etc.',
              type: 'array',
              items: { $ref: `#${path}DistributionMediaType` },
              minItems: 1
            },
            AverageFileSize: {
              description: 'An approximate average size of the distributable item. This gives an end user an idea of the magnitude for each distributable file if more than 1 exists.',
              type: 'number'
            },
            AverageFileSizeUnit: {
              description: 'Unit of measure for the average file size.',
              $ref: `#${path}ArchiveDistributionUnitEnum`
            },
            TotalCollectionFileSizeBeginDate: {
              description: 'The date of which this collection started to collect data.  This date is used by users to be able to calculate the current total collection file size. The date needs to be in the yyyy-MM-ddTHH:mm:ssZ format; for example: 2018-01-01T10:00:00Z.',
              format: 'date-time',
              type: 'string'
            },
            Description: {
              description: 'Provides the data provider a way to convey more information about the distributable item.',
              type: 'string',
              minLength: 1,
              maxLength: 1024
            },
            Fees: {
              description: 'Conveys the price one has to pay to obtain the distributable item.',
              type: 'string',
              minLength: 1,
              maxLength: 255
            }
          },
          required: [ 'Format' ],
          dependencies: {
            AverageFileSize: [ 'AverageFileSizeUnit' ],
            TotalCollectionFileSizeBeginDate: [ 'AverageFileSize' ]
          }
        }
      ]
    },
    ArchiveAndDistributionInformationType: {
      type: 'object',
      additionalProperties: false,
      description: 'This element and all of its sub elements exist for display purposes. It allows a data provider to provide archive and distribution information up front to an end user, to help them decide if they can use the product.',
      properties: {
        FileArchiveInformation: {
          description: 'This element defines a single archive artifact which a data provider would like to inform an end user that it exists.',
          type: 'array',
          items: { $ref: `#${path}FileArchiveInformationType` },
          minItems: 1
        },
        FileDistributionInformation: {
          description: 'This element defines a single artifact that is distributed by the data provider. This element only includes the distributable artifacts that can be obtained by the user without the user having to invoke a service. These should be documented in the UMM-S specification.',
          type: 'array',
          items: { $ref: `#${path}FileDistributionInformationType` },
          minItems: 1
        }
      },
      anyOf: [
        { required: [ 'FileArchiveInformation' ] },
        { required: [ 'FileDistributionInformation' ] }
      ]
    },
    DirectDistributionInformationType: {
      type: 'object',
      additionalProperties: false,
      description: 'This element allows end users to get direct access to data products that are stored in the Amazon Web Service (AWS) S3 buckets. The sub elements include S3 credentials end point and a documentation URL as well as bucket prefix names and an AWS region.',
      properties: {
        Region: {
          description: 'Defines the possible values for the Amazon Web Service US Regions where the data product resides.',
          $ref: `#${path}DirectDistributionInformationRegionEnum`
        },
        S3BucketAndObjectPrefixNames: {
          description: 'Defines the possible values for the Amazon Web Service US S3 bucket and/or object prefix names.',
          type: 'array',
          items: {
            type: 'string',
            minLength: 1,
            maxLength: 1024,
            pattern: '[!-~]{1,1024}'
          },
          minItems: 1
        },
        S3CredentialsAPIEndpoint: {
          description: 'Defines the URL where the credentials are stored.',
          type: 'string',
          format: 'uri',
          minLength: 1,
          maxLength: 1024
        },
        S3CredentialsAPIDocumentationURL: {
          description: 'Defines the URL where the credential documentation are stored.',
          type: 'string',
          format: 'uri',
          minLength: 1,
          maxLength: 1024
        }
      },
      required: [
        'Region',
        'S3CredentialsAPIEndpoint',
        'S3CredentialsAPIDocumentationURL'
      ]
    },
    DirectDistributionInformationRegionEnum: {
      description: 'Defines the possible values for the Amazon Web Service US Regions where the data product resides.',
      type: 'string',
      enum: [ 'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2' ]
    },
    AssociatedDoiType: {
      type: 'object',
      additionalProperties: false,
      description: "This element stores the DOI (Digital Object Identifier) that identifies the collection. Note: The values should start with the directory indicator which in ESDIS' case is 10.  If the DOI was registered through ESDIS, the beginning of the string should be 10.5067. The DOI URL is not stored here; it should be stored as a RelatedURL. The DOI organization that is responsible for creating the DOI is described in the Authority element. For ESDIS records the value of https://doi.org/ should be used. NASA metadata providers are strongly encouraged to include DOI and DOI Authority for their collections using CollectionDOI property.",
      properties: {
        DOI: {
          description: "This element stores the DOI (Digital Object Identifier) that identifies the collection.  Note: The values should start with the directory indicator which in ESDIS' case is 10.  If the DOI was registered through ESDIS, the beginning of the string should be 10.5067. The DOI URL is not stored here; it should be stored as a RelatedURL.",
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        Title: {
          description: "The title of the DOI landing page. The title describes the DOI object to a user, so they don't have to look it up themselves to understand the association.",
          $ref: `#${path}TitleType`
        },
        Authority: {
          description: 'The DOI organization that is responsible for creating the DOI is described in the Authority element. For ESDIS records the value of https://doi.org/ should be used.',
          $ref: `#${path}AuthorityType`
        }
      },
      required: [ 'DOI' ]
    },
    MetadataSpecificationType: {
      type: 'object',
      additionalProperties: false,
      description: 'This object requires any metadata record that is validated by this schema to provide information about the schema.',
      properties: {
        URL: {
          description: 'This element represents the URL where the schema lives. The schema can be downloaded.',
          type: 'string',
          enum: [ 'https://cdn.earthdata.nasa.gov/umm/collection/v1.17.0' ]
        },
        Name: {
          description: 'This element represents the name of the schema.',
          type: 'string',
          enum: [ 'UMM-C' ]
        },
        Version: {
          description: 'This element represents the version of the schema.',
          type: 'string',
          enum: [ '1.17.0' ]
        }
      },
      required: [ 'URL', 'Name', 'Version' ]
    }
  }
});

module.exports.refs = ['UMMCMN'];
  