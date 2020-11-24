#!/bin/bash
DIR=$(pwd)

# Set up functions
source ./scripts/utils.sh

#Clear old artifacts and temp directory
clear_artifacts

#Copy and modify schema and openapi definition
compile_oas_schema './terraform/apigateway/openapi.json'

#Copy database setup and seed scripts
cp ./src/postgres/*.sql ./src/nodejs/database-driver/src/

#Install individual modules
install_layer database-driver
install_layer message-driver
install_layer schema-util
#Add more layer modules here <--

install_lambda action-handler
install_lambda data
install_lambda invoke
install_lambda metrics
install_lambda metrics-handler
install_lambda model
install_lambda notification-handler
install_lambda notify
install_lambda register
install_lambda submission
install_lambda subscribe
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
package_lambda invoke
package_lambda metrics
package_lambda metrics-handler
package_lambda model
package_lambda notification-handler
package_lambda notify
package_lambda register
package_lambda submission
package_lambda subscribe
package_lambda workflow-handler
#Add more lambda functions here <--

#Change back to root directory and remove temp folder
cd ${DIR}
rm -rf ${DIR}/temp
