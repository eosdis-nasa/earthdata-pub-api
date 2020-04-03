#!/bin/bash

#Get directory of builddoc script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

#Generate jsdoc using configuration
npx jsdoc --configure ${DIR}/conf.json --destination ${DIR}/jsdoc --private
