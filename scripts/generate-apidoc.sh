#!/bin/bash
DIR=$(pwd)

# Set up functions
source ./scripts/utils.sh

# Remove temp if exists and recreate
setup_temp

# Remove previous
rm -rf ./docs/apidoc
mkdir ./docs/apidoc

# Copy and modify schema and openapi definition
compile_oas_schema './temp/openapi.json'

# Bundle doc with redoc-cli and move to docs
npx redoc-cli bundle ./temp/openapi.json
mv ./redoc-static.html ${DIR}/docs/apidoc/index.html

# Clear and remove temp
remove_temp
