#!/bin/bash

#Get directory of build script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

#Package nodejs modules
cd ${DIR}/lambda/modules
npm pack ./database-driver


#Install nodejs modules in layers and package in zip

cd ${DIR}/lambda/layers/database-driver-layer/nodejs
npm install ${DIR}/lambda/modules/database-driver-1.0.0.tgz
cd ..
zip -r ../database-driver-layer.zip nodejs
