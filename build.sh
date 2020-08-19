#!/bin/bash

#Get directory of build script change to it in case the
#script was not run from its directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd ${DIR}

PROFILE=${1:-"sandbox"}

if [[ $PROFILE == "localstack" ]]
then
  TARGET="localstack"
else
  TARGET="aws"
fi

# Set up functions
source ./scripts/utils.sh

#Clear old artifacts and temp directory
clear_artifacts

replace 'module:./lambda/modules/schema-util/src/models.js' 'string:#/components/schemas/' 'all:#/' './apigateway/schema.json'

cp ${DIR}/apigateway/spec/openapi.json ${DIR}/apigateway/openapi.json

#Install dependencies and generate docs
cd ${DIR}/lambda/modules
./build.sh

npm run generate-docs
zip -r ${DIR}/artifacts/jsdoc.zip jsdoc
mv jsdoc ${DIR}/docs

cd ${DIR}/temp
npm install swagger-ui-dist --save
mkdir apidoc
cp node_modules/swagger-ui-dist/* apidoc/
rm apidoc/index.html
cp ${DIR}/docs/swagger-index.html apidoc/index.html
cp ${DIR}/apigateway/openapi.json ./openapi.json
cp ${DIR}/apigateway/schema.json ./schema.json
#Populate placeholders
replace 'raw:./openapi.json' 'string:{}' 'one:${api_policy}' './openapi.json'
replace 'raw:./openapi.json' 'string:EarthdataPub' 'one:${api_name}' './openapi.json'
replace 'raw:./openapi.json' 'raw:./schema.json' 'one:${schema_file}' './openapi.json'
prettify_json './openapi.json' './openapi.json'
mv openapi.json apidoc/openapi.json
zip -r ${DIR}/artifacts/apidoc.zip apidoc
mv apidoc ${DIR}/docs
rm -rf ${DIR}/temp/*

#Package lambda layers
package_layer database-driver
package_layer message-driver
package_layer schema-util
#Add more layer modules here <--

#Package lambda functions
package_lambda action-handler
package_lambda dashboard
package_lambda information
package_lambda invoke
package_lambda notification-handler
package_lambda notify
package_lambda register
package_lambda submission
package_lambda subscription
package_lambda workflow-handler
#Add more lambda functions here <--

cd ${DIR}

if [[ $TARGET == "localstack" ]]
then
  oas_to_hcl "./docs/apidoc/openapi.json" "./apigateway/localstack/main.tf.json"
else
  cp ${DIR}/lambda/layers/* ${DIR}/lambda/
fi

cp ${DIR}/apigateway/${TARGET}/* ${DIR}/apigateway/
cp ${DIR}/profiles/${PROFILE}/main.tf ${DIR}/main.tf

#Change back to root directory and remove temp folder
cd ${DIR}
rm -rf ${DIR}/temp
