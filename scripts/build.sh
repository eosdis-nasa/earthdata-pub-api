#!/bin/bash

DIR=$(pwd)

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

#Copy and modify schema and openapi definition
replace 'module:./src/nodejs/schema-util/src/models.js' 'string:#/components/schemas/' 'all:#/' './terraform/apigateway/schema.json'
replace 'raw:./src/openapi/openapi.json' 'raw:./terraform/apigateway/schema.json' 'one:${schema_file}' './terraform/apigateway/openapi.json'
prettify_json './terraform/apigateway/openapi.json' './terraform/apigateway/openapi.json'


#Install individual modules
install_layer database-driver
install_layer message-driver
install_layer schema-util
#Add more layer modules here <--

install_lambda action-handler
install_lambda dashboard
install_lambda data
install_lambda invoke
install_lambda metrics-handler
install_lambda notification-handler
install_lambda notify
install_lambda register
install_lambda submission
install_lambda subscription
install_lambda workflow-handler
#Add more lambda functions here <--


#Package lambda layers
package_layer database-driver
package_layer message-driver
package_layer schema-util
#Add more layer modules here <--

#Package lambda functions
package_lambda action-handler
package_lambda data
package_lambda information
package_lambda invoke
package_lambda metrics-handler
package_lambda notification-handler
package_lambda notify
package_lambda register
package_lambda submission
package_lambda subscription
package_lambda workflow-handler
#Add more lambda functions here <--

#Generate jsdoc and swagger apidoc
npm run generate-docs


if [[ $TARGET == "localstack" ]]
then
  oas_to_hcl "./terraform/apigateway/openapi.json" "./terraform/apigateway/localstack/main.tf.json"
else
  cp ${DIR}/terraform/lambda/layers/* ${DIR}/terraform/lambda/
fi

cp ${DIR}/terraform/apigateway/${TARGET}/* ${DIR}/terraform/apigateway/
cp ${DIR}/terraform/profiles/${PROFILE}/main.tf ${DIR}/terraform/main.tf

#Change back to root directory and remove temp folder
cd ${DIR}
rm -rf ${DIR}/temp
