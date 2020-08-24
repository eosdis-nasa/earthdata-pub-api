#!/bin/bash
rm -rf ./docs/jsdoc
mkdir ./docs/jsdoc
jsdoc -c ./jsdoc.config.json --private
zip -r ./artifacts/jsdoc.zip ./docs/jsdoc
