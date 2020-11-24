#!/bin/bash
DIR=$(pwd)

# Set up functions
source ./scripts/utils.sh

#Copy and modify schema and openapi definition
compile_oas_schema './src/local-server/api/openapi.json'

#Copy database setup and seed scripts
cp ./src/postgres/*.sql ./src/nodejs/database-driver/src/

#Install individual modules
local_install database-driver
local_install message-driver
local_install schema-util
#Add more layer modules here <--

local_install action-handler
local_install data
local_install invoke
local_install metrics
local_install metrics-handler
local_install model
local_install notification-handler
local_install notify
local_install register
local_install submission
local_install subscribe
local_install workflow-handler
#Add more lambda functions here <--

cd ${DIR}/src/local-server
npm install

cd ${DIR}
