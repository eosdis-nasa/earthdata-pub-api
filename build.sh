#!/bin/bash

#Get directory of build script change to it in case the
#script was not run from its directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd ${DIR}

#Clear temp directory, and create deployment artefacts folder
cd lambda
rm -rf temp
rm -rf artefacts
mkdir temp
mkdir artefacts

#Package nodejs modules
cd temp
npm pack ../modules/database-driver
#Add more layer modules here <--

#Install nodejs modules in layers and package in zip
mkdir nodejs
cd nodejs
npm install ../database-driver-1.0.0.tgz
cd ..
zip -r ../artefacts/database-driver-layer.zip nodejs
rm -rf *
#Add more layer modules here <--

#Package lambda functions
cp -R ../modules/get-item/src/* ./.
zip -r ../artefacts/get-item-lambda.zip .
rm -rf *
cp -R ../modules/put-item/src/* ./.
zip -r ../artefacts/put-item-lambda.zip .
rm -rf *

#Change back root directory and remove temp folder
cd ${DIR}
rm -rf lambda/temp
