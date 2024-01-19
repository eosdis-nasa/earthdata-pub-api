#!/bin/bash
DIR=$(pwd)

# Set up functions
source ./scripts/utils.sh

#Copy and modify schema and openapi definition
mkdir -p ./src/nodejs/api
compile_oas_schema './src/nodejs/api/openapi.json'

#Copy database setup and seed scripts
rm -rf ./src/nodejs/lambda-layers/database-util/src/db-setup
mkdir -p ./src/nodejs/lambda-layers/database-util/src/db-setup
cp ./src/postgres/*.sql ./src/nodejs/lambda-layers/database-util/src/db-setup

cd ${DIR}/src/nodejs
npm install --lockfile-version=2

cd ${DIR}
