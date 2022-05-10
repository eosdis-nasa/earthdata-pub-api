module.exports.model = (path) => ({
  $schema: 'http://json-schema.org/draft-04/schema#',
  definitions: {
    LanguageType: {
      description: 'Describes the language used in the preparation, storage, and description of the collection. It is the language of the collection data themselves.   It does not refer to the language used in the metadata record (although this may be the same language). The name of the language used for this field is defined in ISO 639.',
      type: 'string',
      minLength: 1,
      maxLength: 25
    },
    DateType: {
      type: 'object',
      additionalProperties: false,
      description: 'Specifies the date and its type.',
      properties: {
        Date: {
          description: 'This is the date that an event associated with the collection or its metadata occurred.',
          format: 'date-time',
          type: 'string'
        },
        Type: {
          description: 'This is the type of event associated with the date.  For example, Creation, Last Revision.  Type is chosen from a picklist.',
          $ref: `#${path}LineageDateEnum`
        }
      },
      required: ['Date', 'Type']
    },
    EntryIdType: {
      description: 'This is the ID of the metadata record.  It is only unique when combined with the version.',
      type: 'string',
      minLength: 1,
      maxLength: 80
    },
    DataCenterType: {
      type: 'object',
      additionalProperties: false,
      description: 'Defines a data center which is either an organization or institution responsible for distributing, archiving, or processing the data, etc.',
      properties: {
        Roles: {
          description: 'This is the roles of the data center.',
          type: 'array',
          items: { $ref: `#${path}DataCenterRoleEnum` },
          minItems: 1
        },
        ShortName: {
          description: 'This is the short name of the data center. The controlled vocabulary for data center short names is maintained in the Keyword Management System (KMS).',
          $ref: `#${path}DataCenterShortNameType`
        },
        LongName: {
          description: 'This is the long name of the data center.',
          $ref: `#${path}LongNameType`
        },
        Uuid: {
          description: 'Uuid of the data center.',
          $ref: `#${path}UuidType`
        },
        ContactGroups: {
          description: 'This is the contact groups of the data center.',
          type: 'array',
          items: { $ref: `#${path}ContactGroupType` }
        },
        ContactPersons: {
          description: 'This is the contact persons of the data center.',
          type: 'array',
          items: { $ref: `#${path}ContactPersonType` }
        },
        ContactInformation: {
          description: 'This is the contact information of the data center.',
          $ref: `#${path}ContactInformationType`
        }
      },
      required: ['Roles', 'ShortName']
    },
    ContactGroupType: {
      type: 'object',
      additionalProperties: false,
      properties: {
        Roles: {
          description: 'This is the roles of the data contact.',
          type: 'array',
          items: { $ref: `#${path}DataContactRoleEnum` },
          minItems: 1
        },
        Uuid: {
          description: 'Uuid of the data contact.',
          $ref: `#${path}UuidType`
        },
        NonDataCenterAffiliation: {
          description: 'This is the contact person or group that is not affiliated with the data centers.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        ContactInformation: {
          description: 'This is the contact information of the data contact.',
          $ref: `#${path}ContactInformationType`
        },
        GroupName: {
          description: 'This is the contact group name.',
          type: 'string',
          minLength: 1,
          maxLength: 255
        }
      },
      required: ['Roles', 'GroupName']
    },
    ContactPersonType: {
      type: 'object',
      properties: {
        Roles: {
          description: 'This is the roles of the data contact.',
          type: 'array',
          items: { $ref: `#${path}DataContactRoleEnum` },
          minItems: 1
        },
        Uuid: {
          description: 'Uuid of the data contact.',
          $ref: `#${path}UuidType`
        },
        NonDataCenterAffiliation: {
          description: 'This is the contact person or group that is not affiliated with the data centers.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        ContactInformation: {
          description: 'This is the contact information of the data contact.',
          $ref: `#${path}ContactInformationType`
        },
        FirstName: {
          description: 'First name of the individual.',
          type: 'string',
          minLength: 1,
          maxLength: 255
        },
        MiddleName: {
          description: 'Middle name of the individual.',
          type: 'string',
          minLength: 1,
          maxLength: 255
        },
        LastName: {
          description: 'Last name of the individual.',
          type: 'string',
          minLength: 1,
          maxLength: 255
        }
      },
      required: ['Roles', 'LastName']
    },
    ContactInformationType: {
      type: 'object',
      additionalProperties: false,
      description: 'Defines the contact information of a data center or data contact.',
      properties: {
        RelatedUrls: {
          description: 'A URL associated with the contact, e.g., the home page for the DAAC which is responsible for the collection.',
          type: 'array',
          items: { $ref: `#${path}RelatedUrlType` },
          minItems: 0
        },
        ServiceHours: {
          description: 'Time period when the contact answers questions or provides services.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        ContactInstruction: {
          description: 'Supplemental instructions on how or when to contact the responsible party.',
          type: 'string',
          minLength: 1,
          maxLength: 2048
        },
        ContactMechanisms: {
          description: 'Mechanisms of contacting.',
          type: 'array',
          items: { $ref: `#${path}ContactMechanismType` }
        },
        Addresses: {
          description: 'Contact addresses.',
          type: 'array',
          items: { $ref: `#${path}AddressType` }
        }
      }
    },
    ContactMechanismType: {
      type: 'object',
      additionalProperties: false,
      description: 'Method for contacting the data contact. A contact can be available via phone, email, Facebook, or Twitter.',
      properties: {
        Type: {
          description: 'This is the method type for contacting the responsible party - phone, email, Facebook, or Twitter.',
          $ref: `#${path}ContactMechanismTypeEnum`
        },
        Value: {
          description: 'This is the contact phone number, email address, Facebook address, or Twitter handle associated with the contact method.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        }
      },
      required: ['Type', 'Value']
    },
    AddressType: {
      type: 'object',
      additionalProperties: false,
      description: 'This entity contains the physical address details for the contact.',
      properties: {
        StreetAddresses: {
          description: 'An address line for the street address, used for mailing or physical addresses of organizations or individuals who serve as contacts for the collection.',
          type: 'array',
          items: { type: 'string', minLength: 1, maxLength: 1024 },
          minItems: 0
        },
        City: {
          description: 'The city portion of the physical address.',
          type: 'string',
          minLength: 1,
          maxLength: 100
        },
        StateProvince: {
          description: 'The state or province portion of the physical address.',
          type: 'string',
          minLength: 1,
          maxLength: 100
        },
        Country: {
          description: 'The country of the physical address.',
          type: 'string',
          minLength: 1,
          maxLength: 100
        },
        PostalCode: {
          description: 'The zip or other postal code portion of the physical address.',
          type: 'string',
          minLength: 1,
          maxLength: 20
        }
      }
    },
    RelatedUrlType: {
      type: 'object',
      additionalProperties: false,
      description: 'Represents Internet sites that contain information related to the data, as well as related Internet sites such as project home pages, related data archives/servers, metadata extensions, online software packages, web mapping services, and calibration/validation data.',
      properties: {
        Description: {
          description: 'Description of the web page at this URL.',
          type: 'string',
          minLength: 1,
          maxLength: 4000
        },
        URLContentType: {
          description: "A keyword describing the distinct content type of the online resource to this resource. (e.g., 'DATACENTER URL', 'DATA CONTACT URL', 'DISTRIBUTION URL'). The valid values are contained in the KMS System: https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096?gtm_keyword=Related%20URL%20Content%20Types&gtm_scheme=rucontenttype.",
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        Type: {
          description: "A keyword describing the type of the online resource to this resource. This helps the GUI to know what to do with this resource. (e.g., 'GET DATA', 'GET SERVICE', 'GET VISUALIZATION'). The valid values are contained in the KMS System: https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096?gtm_keyword=Related%20URL%20Content%20Types&gtm_scheme=rucontenttype.",
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        Subtype: {
          description: "A keyword describing the subtype of the online resource to this resource. This further helps the GUI to know what to do with this resource. (e.g., 'MEDIA', 'BROWSE', 'OPENDAP', 'OPENSEARCH', 'WEB COVERAGE SERVICES', 'WEB FEATURE SERVICES', 'WEB MAPPING SERVICES', 'SSW', 'ESI'). The valid values are contained in the KMS System: https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096?gtm_keyword=Related%20URL%20Content%20Types&gtm_scheme=rucontenttype.",
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        URL: {
          description: "The URL for the relevant web page (e.g., the URL of the responsible organization's home page, the URL of the collection landing page, the URL of the download site for the collection).",
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        GetData: {
          description: 'The data distribution information for the relevant web page (e.g., browse, media).',
          $ref: `#${path}GetDataType`
        },
        GetService: {
          description: 'The service distribution for the relevant web page (e.g., OPeNDAP, OpenSearch, WCS, WFS, WMS).',
          $ref: `#${path}GetServiceType`
        }
      },
      required: ['URL', 'URLContentType', 'Type']
    },
    GetDataType: {
      description: 'Represents the information needed for a DistributionURL where data is retrieved.',
      type: 'object',
      additionalProperties: false,
      properties: {
        Format: {
          description: 'The format of the data.  The controlled vocabulary for formats is maintained in the Keyword Management System (KMS)',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        MimeType: {
          description: 'The mime type of the service.',
          $ref: `#${path}URLMimeTypeEnum`
        },
        Size: { description: 'The size of the data.', type: 'number' },
        Unit: {
          description: 'Unit of information, together with Size determines total size in bytes of the data.',
          type: 'string',
          enum: ['KB', 'MB', 'GB', 'TB', 'PB']
        },
        Fees: {
          description: 'The fee for ordering the collection data.  The fee is entered as a number, in US Dollars.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        Checksum: {
          description: 'The checksum, usually a SHA1 or md5 checksum for the data file.',
          type: 'string',
          minLength: 1,
          maxLength: 50
        }
      },
      required: ['Format', 'Size', 'Unit']
    },
    GetServiceType: {
      description: 'Represents a Service through a URL where the service will act on data and return the result to the caller.',
      type: 'object',
      additionalProperties: false,
      properties: {
        Format: {
          description: 'The format of the data.',
          $ref: `#${path}GetServiceTypeFormatEnum`
        },
        MimeType: {
          description: 'The mime type of the service.',
          $ref: `#${path}URLMimeTypeEnum`
        },
        Protocol: {
          description: 'The protocol of the service.',
          type: 'string',
          enum: ['HTTP', 'HTTPS', 'FTP', 'FTPS', 'Not provided']
        },
        FullName: {
          description: 'The full name of the service.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        DataID: {
          description: 'The data identifier of the data provided by the service. Typically, this is a file name.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        DataType: {
          description: 'The data type of the data provided by the service.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        URI: {
          description: 'The URI of the data provided by the service.',
          type: 'array',
          items: { type: 'string', minLength: 1, maxLength: 1024 },
          minItems: 1
        }
      },
      required: ['MimeType', 'Protocol', 'FullName', 'DataID', 'DataType']
    },
    OnlineResourceType: {
      type: 'object',
      additionalProperties: false,
      description: 'Describes the online resource pertaining to the data.',
      properties: {
        Linkage: {
          description: 'The URL of the website related to the online resource.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        Protocol: {
          description: 'The protocol of the linkage for the online resource, such as https, svn, ftp, etc.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        ApplicationProfile: {
          description: 'The application profile holds the name of the application that can service the data. For example if the URL points to a word document, then the applicationProfile is MS-Word.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        Name: {
          description: 'The name of the online resource.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        Description: {
          description: 'The description of the online resource.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        Function: {
          description: 'The function of the online resource. In ISO where this class originated the valid values are: download, information, offlineAccess, order, and search.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        MimeType: {
          description: 'The mime type of the online resource.',
          $ref: `#${path}URLMimeTypeEnum`
        }
      },
      required: ['Linkage']
    },
    ResourceCitationType: {
      type: 'object',
      additionalProperties: false,
      description: 'Building block text fields used to construct the recommended language for citing the collection in professional scientific literature.  The citation language constructed from these fields references the collection itself, and is not designed for listing bibliographic references of scientific research articles arising from search results. A list of references related to the research results should be in the Publication Reference element.',
      properties: {
        Version: {
          description: 'The version of the collection.',
          $ref: `#${path}VersionType`
        },
        Title: {
          description: 'The title of the collection; this is the same as the collection Entry Title.',
          $ref: `#${path}TitleType`
        },
        Creator: {
          description: "The name of the organization(s) or individual(s) with primary intellectual responsibility for the collection's development.",
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        Editor: {
          description: 'The individual(s) responsible for changing the data in the collection.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        SeriesName: {
          description: 'The name of the data series, or aggregate data of which the data is a part.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        ReleaseDate: {
          description: 'The date when the collection was made available for release.',
          format: 'date-time',
          type: 'string'
        },
        ReleasePlace: {
          description: 'The name of the city (and state or province and country if needed) where the collection was made available for release.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        Publisher: {
          description: 'The name of the individual or organization that made the collection available for release.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        IssueIdentification: {
          description: 'The volume or issue number of the publication (if applicable).',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        DataPresentationForm: {
          description: 'The mode in which the data are represented, e.g. atlas, image, profile, text, etc.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        OtherCitationDetails: {
          description: 'Additional free-text citation information.',
          type: 'string',
          minLength: 1,
          maxLength: 4000
        },
        OnlineResource: {
          description: 'The URL of the landing page for the collection.',
          $ref: `#${path}OnlineResourceType`
        }
      }
    },
    DoiType: {
      oneOf: [
        {
          type: 'object',
          additionalProperties: false,
          description: "This element stores the DOI (Digital Object Identifier) that identifies the collection. Note: The values should start with the directory indicator which in ESDIS' case is 10.  If the DOI was registered through ESDIS, the beginning of the string should be 10.5067. The DOI URL is not stored here; it should be stored as a RelatedURL. The DOI organization that is responsible for creating the DOI is described in the Authority element. For ESDIS records the value of https://doi.org/ should be used. For those that want to specify that a DOI is not applicable or unknown for their record, use the second option.",
          properties: {
            DOI: {
              description: "This element stores the DOI (Digital Object Identifier) that identifies the collection.  Note: The values should start with the directory indicator which in ESDIS' case is 10.  If the DOI was registered through ESDIS, the beginning of the string should be 10.5067. The DOI URL is not stored here; it should be stored as a RelatedURL.",
              type: 'string',
              minLength: 1,
              maxLength: 1024
            },
            Authority: {
              description: 'The DOI organization that is responsible for creating the DOI is described in the Authority element. For ESDIS records the value of https://doi.org/ should be used.',
              $ref: `#${path}AuthorityType`
            }
          },
          required: ['DOI']
        },
        {
          type: 'object',
          additionalProperties: false,
          description: 'This element stores the fact that the DOI (Digital Object Identifier) is not applicable or is unknown.',
          properties: {
            MissingReason: {
              description: 'This element stores the fact that a DOI (Digital Object Identifier) is not applicable or is unknown for this record.',
              type: 'string',
              enum: ['Not Applicable', 'Unknown']
            },
            Explanation: {
              description: 'This element describes the reason the DOI is not applicable or unknown.',
              type: 'string',
              minLength: 1,
              maxLength: 1024
            }
          },
          required: ['MissingReason']
        }
      ]
    },
    DoiDoiType: {
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
        Authority: {
          description: 'The DOI organization that is responsible for creating the DOI is described in the Authority element. For ESDIS records the value of https://doi.org/ should be used.',
          $ref: `#${path}AuthorityType`
        }
      },
      required: ['DOI']
    },
    AccessConstraintsType: {
      type: 'object',
      additionalProperties: false,
      description: 'Information about any constraints for accessing the data set. This includes any special restrictions, legal prerequisites, limitations and/or warnings on obtaining the data set.',
      properties: {
        Description: {
          description: 'Free-text description of the constraint.  In DIF, this field is called Access_Constraint.   In ECHO, this field is called RestrictionComment.  Examples of text in this field are Public, In-house, Limited.  Additional detailed instructions on how to access the collection data may be entered in this field.',
          type: 'string',
          minLength: 1,
          maxLength: 4000
        },
        Value: {
          description: 'Numeric value that is used with Access Control Language (ACLs) to restrict access to this collection.  For example, a provider might specify a collection level ACL that hides all collections with a value element set to 15.   In ECHO, this field is called RestrictionFlag.  This field does not exist in DIF.',
          type: 'number'
        }
      },
      required: ['Description']
    },
    MetadataAssociationType: {
      type: 'object',
      additionalProperties: false,
      description: 'Used to identify other services, collections, visualizations, granules, and other metadata types and resources that are associated with or dependent on this collection, including parent-child relationships.',
      properties: {
        Type: {
          description: 'The type of association between this collection metadata record and the target metadata record.   Choose type from the drop-down list.',
          $ref: `#${path}MetadataAssociateTypeEnum`
        },
        Description: {
          description: 'Free-text description of the association between this collection record and the target metadata record.',
          type: 'string',
          minLength: 1,
          maxLength: 4000
        },
        EntryId: {
          description: 'ShortName of the target metadata record that is associated with this collection record.',
          $ref: `#${path}EntryIdType`
        },
        Version: {
          description: 'The version of the target metadata record that is associated with this collection record.',
          $ref: `#${path}VersionType`
        }
      },
      required: ['EntryId']
    },
    PublicationReferenceType: {
      type: 'object',
      additionalProperties: false,
      description: 'Describes key bibliographic citations pertaining to the data.',
      properties: {
        OnlineResource: {
          description: 'The URL of the website related to the bibliographic citation.',
          $ref: `#${path}OnlineResourceType`
        },
        Title: {
          description: 'The title of the publication in the bibliographic citation.',
          $ref: `#${path}TitleType`
        },
        Publisher: {
          description: 'The publisher of the publication.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        DOI: {
          description: 'The Digital Object Identifier (DOI) of the publication.',
          $ref: `#${path}DoiDoiType`
        },
        Author: {
          description: 'The author of the publication.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        PublicationDate: {
          description: 'The date of the publication.',
          format: 'date-time',
          type: 'string'
        },
        Series: {
          description: 'The name of the series of the publication.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        Edition: {
          description: 'The edition of the publication.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        Volume: {
          description: 'The publication volume number.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        Issue: {
          description: 'The issue of the publication.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        ReportNumber: {
          description: 'The report number of the publication.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        PublicationPlace: {
          description: 'The publication place of the publication.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        Pages: {
          description: 'The publication pages that are relevant.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        ISBN: {
          description: 'The ISBN of the publication.',
          type: 'string',
          minLength: 1,
          maxLength: 13
        },
        OtherReferenceDetails: {
          description: 'Additional free-text reference information about the publication.',
          type: 'string',
          minLength: 1,
          maxLength: 4000
        }
      }
    },
    ScienceKeywordType: {
      type: 'object',
      additionalProperties: false,
      description: 'Enables specification of Earth science keywords related to the collection.  The controlled vocabulary for Science Keywords is maintained in the Keyword Management System (KMS).',
      properties: {
        Category: { $ref: `#${path}KeywordStringType` },
        Topic: { $ref: `#${path}KeywordStringType` },
        Term: { $ref: `#${path}KeywordStringType` },
        VariableLevel1: { $ref: `#${path}KeywordStringType` },
        VariableLevel2: { $ref: `#${path}KeywordStringType` },
        VariableLevel3: { $ref: `#${path}KeywordStringType` },
        DetailedVariable: { $ref: `#${path}KeywordStringType` }
      },
      required: ['Category', 'Topic', 'Term']
    },
    AdditionalAttributeType: {
      type: 'object',
      additionalProperties: false,
      description: 'Additional unique attributes of the collection, beyond those defined in the UMM model, which the data provider deems useful for end-user understanding of the data in the collection.  Additional attributes are also called Product Specific Attributes (PSAs) or non-core attributes.  Examples are HORIZONTALTILENUMBER, VERTICALTILENUMBER.',
      properties: {
        Name: {
          description: 'The name (1 word description) of the additional attribute.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        Description: {
          description: 'Free-text description of the additional attribute.',
          type: 'string',
          minLength: 1,
          maxLength: 2048
        },
        Value: {
          description: 'Value of the additional attribute if it is the same for all granules across the collection.  If the value of the additional attribute may differ by granule, leave this collection-level value blank.',
          type: 'string',
          minLength: 1,
          maxLength: 500
        },
        DataType: {
          description: 'Data type of the values of the additional attribute.',
          $ref: `#${path}DataTypeEnum`
        },
        MeasurementResolution: {
          description: 'The smallest unit increment to which the additional attribute value is measured.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        ParameterRangeBegin: {
          description: 'The minimum value of the additional attribute over the whole collection.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        ParameterRangeEnd: {
          description: 'The maximum value of the additional attribute over the whole collection.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        ParameterUnitsOfMeasure: {
          description: 'The standard unit of measurement for the additional attribute.  For example, meters, hertz.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        ParameterValueAccuracy: {
          description: 'An estimate of the accuracy of the values of the additional attribute. For example, for AVHRR: Measurement error or precision-measurement error or precision of a data product parameter. This can be specified in percent or the unit with which the parameter is measured.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        ValueAccuracyExplanation: {
          description: 'Describes the method used for determining the parameter value accuracy that is given for this additional attribute.',
          type: 'string',
          minLength: 1,
          maxLength: 2048
        },
        Group: {
          description: 'Identifies a namespace for the additional attribute name.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        UpdateDate: {
          description: 'The date this additional attribute information was updated.',
          format: 'date-time',
          type: 'string'
        }
      },
      required: ['Name', 'DataType', 'Description']
    },
    PlatformType: {
      type: 'object',
      additionalProperties: false,
      description: 'Describes the relevant platforms used to acquire the data in the collection. The controlled vocabularies for platform types and names are maintained in the Keyword Management System (KMS).',
      properties: {
        Type: {
          description: 'The most relevant platform type.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        ShortName: { $ref: `#${path}PlatformShortNameType` },
        LongName: { $ref: `#${path}PlatformLongNameType` },
        Characteristics: {
          description: 'Platform-specific characteristics, e.g., Equator Crossing Time, Inclination Angle, Orbital Period. The characteristic names must be unique on this platform; however the names do not have to be unique across platforms.',
          type: 'array',
          items: { $ref: `#${path}CharacteristicType` },
          minItems: 0
        },
        Instruments: {
          type: 'array',
          items: { $ref: `#${path}InstrumentType` },
          minItems: 1
        }
      },
      required: ['ShortName']
    },
    CharacteristicType: {
      type: 'object',
      additionalProperties: false,
      description: 'This entity is used to define characteristics.',
      properties: {
        Name: {
          description: 'The name of the characteristic attribute.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        Description: {
          description: 'Description of the Characteristic attribute.',
          type: 'string',
          minLength: 1,
          maxLength: 2048
        },
        Value: {
          description: 'The value of the Characteristic attribute.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        Unit: {
          description: 'Units associated with the Characteristic attribute value.',
          type: 'string',
          minLength: 1,
          maxLength: 20
        },
        DataType: {
          description: 'The datatype of the Characteristic/attribute.',
          $ref: `#${path}DataTypeEnum`
        }
      },
      required: ['Name', 'Description', 'DataType', 'Unit', 'Value']
    },
    InstrumentType: {
      type: 'object',
      additionalProperties: false,
      description: 'Information about the device used to measure or record data in this collection, including direct human observation. In cases where instruments have a single child instrument or the instrument and child instrument are used synonymously (e.g. AVHRR), both Instrument and ComposedOf should be recorded. The child instrument information is represented in a separate section. The controlled vocabulary for instrument names is maintained in the Keyword Management System (KMS).',
      properties: {
        ShortName: { $ref: `#${path}PlatformShortNameType` },
        LongName: { $ref: `#${path}PlatformLongNameType` },
        Characteristics: {
          description: 'Instrument-specific characteristics, e.g., Wavelength, SwathWidth, Field of View. The characteristic names must be unique on this instrument; however the names do not have to be unique across instruments.',
          type: 'array',
          items: { $ref: `#${path}CharacteristicType` },
          minItems: 0
        },
        Technique: {
          description: "The expanded name of the primary sensory instrument. (e.g. Advanced Spaceborne Thermal Emission and Reflective Radiometer, Clouds and the Earth's Radiant Energy System, Human Observation).",
          type: 'string',
          minLength: 1,
          maxLength: 2048
        },
        NumberOfInstruments: {
          description: 'Number of instruments used on the instrument when acquiring the granule data.',
          type: 'integer'
        },
        ComposedOf: {
          type: 'array',
          items: { $ref: `#${path}InstrumentChildType` },
          minItems: 0
        },
        OperationalModes: {
          description: 'The operation mode applied on the instrument when acquiring the granule data.',
          type: 'array',
          items: { type: 'string', minLength: 1, maxLength: 20 },
          minItems: 0
        }
      },
      required: ['ShortName']
    },
    InstrumentChildType: {
      type: 'object',
      additionalProperties: false,
      description: 'Child object on an instrument. Has all the same fields as instrument, minus the list of child instruments.',
      properties: {
        ShortName: { $ref: `#${path}PlatformShortNameType` },
        LongName: { $ref: `#${path}PlatformLongNameType` },
        Characteristics: {
          description: 'Instrument-specific characteristics, e.g., Wavelength, SwathWidth, Field of View. The characteristic names must be unique on this instrument; however the names do not have to be unique across instruments.',
          type: 'array',
          items: { $ref: `#${path}CharacteristicType` },
          minItems: 0
        },
        Technique: {
          description: "The expanded name of the primary sensory instrument. (e.g. Advanced Spaceborne Thermal Emission and Reflective Radiometer, Clouds and the Earth's Radiant Energy System, Human Observation).",
          type: 'string',
          minLength: 1,
          maxLength: 2048
        }
      },
      required: ['ShortName']
    },
    ProjectType: {
      type: 'object',
      additionalProperties: false,
      description: 'Information describing the scientific endeavor(s) with which the collection is associated. Scientific endeavors include campaigns, projects, interdisciplinary science investigations, missions, field experiments, etc. The controlled vocabularies for project names are maintained in the Keyword Management System (KMS)',
      properties: {
        ShortName: {
          description: 'The unique identifier by which a project or campaign/experiment is known. The campaign/project is the scientific endeavor associated with the acquisition of the collection. Collections may be associated with multiple campaigns.',
          type: 'string',
          minLength: 1,
          maxLength: 40
        },
        LongName: {
          description: 'The expanded name of the campaign/experiment (e.g. Global climate observing system).',
          type: 'string',
          minLength: 1,
          maxLength: 300
        },
        Campaigns: {
          description: 'The name of the campaign/experiment (e.g. Global climate observing system).',
          type: 'array',
          items: { type: 'string', minLength: 1, maxLength: 80 },
          minItems: 0
        },
        StartDate: {
          description: 'The starting date of the campaign.',
          format: 'date-time',
          type: 'string'
        },
        EndDate: {
          description: 'The ending data of the campaign.',
          format: 'date-time',
          type: 'string'
        }
      },
      required: ['ShortName']
    },
    TemporalExtentType: {
      type: 'object',
      additionalProperties: false,
      description: 'Information which describes the temporal range or extent of a specific collection.',
      properties: {
        PrecisionOfSeconds: {
          description: 'The precision (position in number of places to right of decimal point) of seconds used in measurement.',
          type: 'integer'
        },
        EndsAtPresentFlag: {
          description: "Setting the Ends At Present Flag to 'True' indicates that a data collection which covers, temporally, a discontinuous range, currently ends at the present date.  Setting the Ends at Present flag to 'True' eliminates the need to continuously update the Range Ending Time for collections where granules are continuously being added to the collection inventory.",
          type: 'boolean'
        },
        RangeDateTimes: {
          description: 'Stores the start and end date/time of a collection.',
          type: 'array',
          items: { $ref: `#${path}RangeDateTimeType` },
          minItems: 1
        },
        SingleDateTimes: {
          type: 'array',
          items: { format: 'date-time', type: 'string' },
          minItems: 1
        },
        PeriodicDateTimes: {
          description: 'Temporal information about a collection having granules collected at a regularly occurring period.   Information includes the start and end dates of the period, duration unit and value, and cycle duration unit and value.',
          type: 'array',
          items: { $ref: `#${path}PeriodicDateTimeType` },
          minItems: 1
        }
      },
      oneOf: [
        { required: ['RangeDateTimes'] },
        { required: ['SingleDateTimes'] },
        { required: ['PeriodicDateTimes'] }
      ]
    },
    RangeDateTimeType: {
      type: 'object',
      additionalProperties: false,
      description: 'Stores the start and end date/time of a collection.',
      properties: {
        BeginningDateTime: {
          description: 'The time when the temporal coverage period being described began.',
          format: 'date-time',
          type: 'string'
        },
        EndingDateTime: {
          description: 'The time when the temporal coverage period being described ended.',
          format: 'date-time',
          type: 'string'
        }
      },
      required: ['BeginningDateTime']
    },
    PeriodicDateTimeType: {
      type: 'object',
      additionalProperties: false,
      description: 'Information about Periodic Date Time collections, including the name of the temporal period in addition to the start and end dates, duration unit and value, and cycle duration unit and value.',
      properties: {
        Name: {
          description: "The name given to the recurring time period. e.g. 'spring - north hemi.'",
          type: 'string',
          minLength: 1,
          maxLength: 30
        },
        StartDate: {
          description: 'The date (day and time) of the first occurrence of this regularly occurring period which is relevant to the collection coverage.',
          format: 'date-time',
          type: 'string'
        },
        EndDate: {
          description: 'The date (day and time) of the end occurrence of this regularly occurring period which is relevant to the collection coverage.',
          format: 'date-time',
          type: 'string'
        },
        DurationUnit: {
          description: 'The unit specification for the period duration.',
          $ref: `#${path}DurationUnitEnum`
        },
        DurationValue: {
          description: "The number of PeriodDurationUnits in the RegularPeriodic period. e.g. the RegularPeriodic event 'Spring-North Hemi' might have a PeriodDurationUnit='MONTH' PeriodDurationValue='3' PeriodCycleDurationUnit='YEAR' PeriodCycleDurationValue='1' indicating that Spring-North Hemi lasts for 3 months and has a cycle duration of 1 year. The unit for the attribute is the value of the attribute PeriodDurationValue.",
          type: 'integer'
        },
        PeriodCycleDurationUnit: {
          description: 'The unit specification of the period cycle duration.',
          $ref: `#${path}DurationUnitEnum`
        },
        PeriodCycleDurationValue: { type: 'integer' }
      },
      required: [
        'Name',
        'StartDate',
        'EndDate',
        'DurationUnit',
        'DurationValue',
        'PeriodCycleDurationUnit',
        'PeriodCycleDurationValue'
      ]
    },
    UuidType: {
      description: 'A Level 3 UUID, see wiki link http://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_.28random.29',
      type: 'string',
      pattern: '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89abAB][0-9a-f]{3}-[0-9a-f]{12}'
    },
    LineageDateEnum: {
      description: 'The name of supported lineage date types',
      type: 'string',
      enum: ['CREATE', 'UPDATE', 'DELETE', 'REVIEW']
    },
    VersionType: {
      description: 'The version of the metadata record.',
      type: 'string',
      minLength: 1,
      maxLength: 80
    },
    VersionDescriptionType: {
      description: 'Free-text description of the version of the resource such as a Collection.',
      type: 'string',
      minLength: 1,
      maxLength: 2048
    },
    AuthorityType: {
      description: 'The Authority (who created it or owns it) of a unique identifier.',
      type: 'string',
      minLength: 1,
      maxLength: 80
    },
    EntryTitleType: {
      description: 'The title of the data described by the metadata.',
      $ref: `#${path}TitleType`
    },
    TitleType: {
      description: 'A title type that defines the min and max lengths of all titles.',
      type: 'string',
      minLength: 1,
      maxLength: 1030
    },
    AbstractType: {
      description: 'A brief description of the collection. This allows potential users to determine if the collection is useful for their needs.',
      type: 'string',
      minLength: 1,
      maxLength: 40000
    },
    PurposeType: {
      description: 'Describes the purpose and/or intended use of data in this collection.',
      type: 'string',
      minLength: 1,
      maxLength: 10000
    },
    DataCenterRoleEnum: {
      description: 'Defines the possible values of a data center role.',
      type: 'string',
      enum: ['ARCHIVER', 'DISTRIBUTOR', 'PROCESSOR', 'ORIGINATOR']
    },
    DataContactRoleEnum: {
      description: 'Defines the possible values of a data contact role.',
      type: 'string',
      enum: [
        'Data Center Contact',
        'Technical Contact',
        'Science Contact',
        'Investigator',
        'Metadata Author',
        'User Services',
        'Science Software Development'
      ]
    },
    ContactMechanismTypeEnum: {
      description: 'Defines the possible contact mechanism types.',
      type: 'string',
      enum: [
        'Direct Line', 'Email',
        'Facebook', 'Fax',
        'Mobile', 'Modem',
        'Primary', 'TDD/TTY Phone',
        'Telephone', 'Twitter',
        'U.S. toll free', 'Other'
      ]
    },
    ShortNameType: {
      description: 'The unique name.',
      type: 'string',
      minLength: 1,
      maxLength: 85
    },
    DataCenterShortNameType: {
      description: 'The unique name of the data center.',
      type: 'string',
      minLength: 1,
      maxLength: 85,
      pattern: `[\\w\\-&'()\\[\\]/."#$%\\^@!*+=,][\\w\\-&'()\\[\\]/."#$%\\^@!*+=, ]{1,84}`
    },
    PlatformShortNameType: {
      description: 'The unique name of the platform.',
      type: 'string',
      minLength: 1,
      maxLength: 80,
      pattern: `[\\w\\-&'()\\[\\]/."#$%\\^@!*+=,][\\w\\-&'()\\[\\]/."#$%\\^@!*+=, ]{1,79}`
    },
    LongNameType: {
      description: 'The expanded or long name related to the short name.',
      type: 'string',
      minLength: 1,
      maxLength: 1024
    },
    PlatformLongNameType: {
      description: 'The expanded or long name related to the short name of the platform.',
      type: 'string',
      minLength: 1,
      maxLength: 1024,
      pattern: `[\\w\\-&'()\\[\\]/."#$%\\^@!*+=,][\\w\\-&'()\\[\\]/."#$%\\^@!*+=, ]{0,1023}`
    },
    QualityType: {
      description: 'Free-text information about the quality of the data in the collection or any quality assurance procedures followed in producing the data described in the metadata. Suggestions for information to include in the Quality field: Description should be succinct. Include indicators of data quality or quality flags. Include recognized or potential problems with quality. Established quality control mechanisms should be included. Established quantitative quality measurements should be included.',
      type: 'string',
      minLength: 1,
      maxLength: 12000
    },
    MetadataAssociateTypeEnum: {
      description: 'The set of supported values for MetadataAssociationType.Type.',
      type: 'string',
      enum: [
        'SCIENCE ASSOCIATED',
        'DEPENDENT',
        'INPUT',
        'PARENT',
        'CHILD',
        'RELATED',
        'LARGER CITATION WORKS'
      ]
    },
    KeywordStringType: {
      type: 'string',
      minLength: 1,
      maxLength: 80,
      pattern: `[\\w\\-&'()\\[\\]/."#$%\\^@!*+=,][\\w\\-&'()\\[\\]/."#$%\\^@!*+=, ]{1,79}`
    },
    AncillaryKeywordStringType: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
      pattern: `[\\w\\-&'()\\[\\]/."#$%\\^@!*+=,][\\w\\-&'()\\[\\]/."#$%\\^@!*+=, ]{1,254}`
    },
    DataTypeEnum: {
      description: 'This entity contains the additional attribute data types.',
      type: 'string',
      enum: [
        'STRING',
        'FLOAT',
        'INT',
        'BOOLEAN',
        'DATE',
        'TIME',
        'DATETIME',
        'DATE_STRING',
        'TIME_STRING',
        'DATETIME_STRING'
      ]
    },
    DurationUnitEnum: { type: 'string', enum: ['DAY', 'MONTH', 'YEAR'] },
    URLMimeTypeEnum: {
      type: 'string',
      enum: [
        'application/json',
        'application/xml',
        'application/x-netcdf',
        'application/gml+xml',
        'application/opensearchdescription+xml',
        'application/vnd.google-earth.kml+xml',
        'image/gif',
        'image/tiff',
        'image/bmp',
        'text/csv',
        'text/xml',
        'application/pdf',
        'application/x-hdf',
        'application/xhdf5',
        'application/octet-stream',
        'application/vnd.google-earth.kmz',
        'image/jpeg',
        'image/png',
        'image/vnd.collada+xml',
        'text/html',
        'text/plain',
        'Not provided'
      ]
    },
    GetServiceTypeFormatEnum: {
      type: 'string',
      enum: [
        'ascii', 'binary',
        'GRIB', 'BUFR',
        'HDF4', 'HDF5',
        'HDF-EOS4', 'HDF-EOS5',
        'jpeg', 'png',
        'tiff', 'geotiff',
        'kml', 'Not provided'
      ]
    }
  }
});

module.exports.refs = [];
