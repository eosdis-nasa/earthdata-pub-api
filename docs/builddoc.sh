#!/bin/bash

#Get directory of builddoc script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd ${DIR}

#Remove old docs if they exist
rm -rf api
rm -rf jsdoc

#Generate jsdoc using configuration
npx jsdoc --configure conf.json --destination jsdoc --private

#Setup Swagger UI site
mkdir api
npm install swagger-ui-dist
cp node_modules/swagger-ui-dist/* api/
rm api/index.html
cp swagger-index.html api/index.html
cp ../apigateway/openapi.json api/
cp ../apigateway/schema.json api/
rm -rf node_modules
rm package-lock.json
