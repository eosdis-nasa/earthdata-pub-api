#!/bin/bash

#Get directory of build script change to it in case the
#script was not run from its directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd ${DIR}

#Remove old temp directory if it exists and make new
rm -rf temp
mkdir temp

#Make layer folder
mkdir lambda/layers

#Package nodejs modules
cd temp
npm pack ../lambda/modules/database-driver

#Install nodejs modules in layers and package in zip
mkdir nodejs
cd nodejs
npm install ../database-driver-1.0.0.tgz
cd ..
zip -r ../lambda/layers/database-driver-layer.zip nodejs
rm -rf nodejs

#Change back root directory and remove temp folder
cd ${DIR}
rm -rf temp
