#!/bin/bash
DIR=$(pwd)

# Set up functions
source ./scripts/utils.sh

# Remove temp if exists and recreate
setup_temp

#Clear old artifacts and temp directory
clear_artifacts

#Copy and modify schema and openapi definition
compile_oas_schema './terraform/apigateway/openapi.json'

#Copy database setup and seed scripts
rm -rf ./src/nodejs/lambda-layers/database-util/src/db-setup
mkdir -p ./src/nodejs/lambda-layers/database-util/src/db-setup
cp ./src/postgres/*.sql ./src/nodejs/lambda-layers/database-util/src/db-setup
rm ./src/nodejs/lambda-layers/database-util/src/db-setup/*localseed.sql

#Install individual modules
install_layer auth-util
install_layer database-util
install_layer message-util
install_layer schema-util
#Add more layer modules here <--

install_lambda action-consumer
install_lambda api-proxy
install_lambda auth
install_lambda data
install_lambda form
install_lambda inbound-consumer
install_lambda invoke
install_lambda metrics
install_lambda metrics-consumer
install_lambda model
install_lambda notification
install_lambda notification-consumer
install_lambda rds-backup
install_lambda step-cleanup
install_lambda remap-statics
install_lambda service-authorizer
install_lambda submission
install_lambda user
install_lambda version
install_lambda workflow-consumer
install_lambda questions
install_lambda workflow
install_lambda file-upload
install_lambda mfa-auth
install_lambda oidc-authorizer
install_lambda disable-user-account
#Add more lambda functions here <--

#Change back to root directory and remove temp folder
remove_temp
