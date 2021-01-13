#!/bin/bash
DIR=$(pwd)

# Set up functions
source ./scripts/utils.sh

#Copy and modify schema and openapi definition
compile_oas_schema './src/nodejs/api/openapi.json'

#Copy database setup and seed scripts
cp ./src/postgres/*.sql ./src/nodejs/lambda-layers/database-util/src/

cd ${DIR}/src/nodejs
npm install

cd ${DIR}
