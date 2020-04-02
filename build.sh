#!/bin/bash

#Get directory of build script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

#Package nodejs modules
cd ${DIR}/lambda/modules
npm pack ./dynamodb-driver
npm pack ./edp-schema


#Install nodejs modules in layers and package in zip

cd ${DIR}/lambda/layers/dynamodb-driver-layer/nodejs
npm install ${DIR}/lambda/modules/dynamodb-driver-1.0.0.tgz
cd ..
zip -r ../dynamodb-driver-layer.zip nodejs

cd ${DIR}/lambda/layers/edp-schema-layer/nodejs
npm install ${DIR}/lambda/modules/edp-schema-1.0.0.tgz
cd ..
zip -r ../edp-schema-layer.zip nodejs
