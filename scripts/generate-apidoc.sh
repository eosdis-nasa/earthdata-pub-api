#!/bin/bash
rm -rf ./docs/apidoc
mkdir ./docs/apidoc
cp ./node_modules/swagger-ui-dist/* ./docs/apidoc/
rm ./docs/apidoc/index.html
cp ./docs/swagger-index.html ./docs/apidoc/index.html
cp ./terraform/apigateway/openapi.json ./docs/apidoc/openapi.json
zip -r ./artifacts/apidoc.zip ./docs/apidoc
