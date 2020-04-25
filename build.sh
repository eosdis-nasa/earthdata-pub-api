#!/bin/bash

#Get directory of build script change to it in case the
#script was not run from its directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd ${DIR}


#Copy and edit schema json apigateway, modules, docs
sed "s/\${schema_path}/\//" ./dynamodb/schema/schema.json > ./lambda/modules/database-driver/src/schema.json
sed "s/\${schema_path}/\/components\/schemas\//" ./dynamodb/schema/schema.json > ./apigateway/schema.json


#Clear old artifacts and temp directory
rm -rf ${DIR}/docs/jsdoc
rm -rf ${DIR}/docs/apidoc
rm ${DIR}/artifacts/*.zip
rm -rf temp
mkdir temp


#Package nodejs modules
cd ${DIR}/temp
npm pack ${DIR}/lambda/modules/database-driver
#Add more layer modules here <--


#Install nodejs modules in layers and package in zip
mkdir nodejs
cd nodejs
npm install ../database-driver-1.0.0.tgz
cd ..
zip -r ${DIR}/artifacts/database-driver-layer.zip nodejs
rm -rf ${DIR}/temp/*
#Add more layer modules here <--


#Package lambda functions
cp -R ${DIR}/lambda/modules/get-item/src/* ./.
zip -r ${DIR}/artifacts/get-item-lambda.zip .
rm -rf ${DIR}/temp/*
cp -R ${DIR}/lambda/modules/put-item/src/* ./.
zip -r ${DIR}/artifacts/put-item-lambda.zip .
rm -rf ${DIR}/temp/*


#Generate and package documentation
cd ${DIR}/lambda/modules
npm install
npm run generate-docs
zip -r ${DIR}/artifacts/jsdoc.zip jsdoc
mv jsdoc ${DIR}/docs

cd ${DIR}/temp
npm install swagger-ui-dist --save
mkdir apidoc
cp node_modules/swagger-ui-dist/* apidoc/
rm apidoc/index.html
cp ${DIR}/docs/swagger-index.html apidoc/index.html
cp ${DIR}/apigateway/openapi.json apidoc/openapi.json
#Populate placeholders
sed -i 's/${schema_file}/${schema_file}\n/' ./apidoc/openapi.json
sed -i \
-e '/${schema_file}/ r ../apigateway/schema.json' \
-e 's/${schema_file}//' \
-e 's/${api_name}/EarthdataPub/g' \
-e 's/${api_policy}/{}/g' \
./apidoc/openapi.json


zip -r ${DIR}/artifacts/apidoc.zip apidoc
mv apidoc ${DIR}/docs

#Change back root directory and remove temp folder
cd ${DIR}
rm -rf ${DIR}/temp
