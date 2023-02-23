setup_temp() {
  rm -rf ${DIR}/temp
  mkdir ${DIR}/temp
}

remove_temp() {
  cd ${DIR}
  rm -rf ${DIR}/temp
}

clear_artifacts() {
  rm -rf ${DIR}/src/nodejs/lamba-layers/*/node_modules
  rm ${DIR}/artifacts/*.zip
  rm ${DIR}/terraform/apigateway/openapi.json
  rm ${DIR}/src/nodejs/lamba-layers/*/package-lock.json
  rm ${DIR}/src/nodejs/lamba-layers/*/*.tgz
}

install_layer() {
  cd ${DIR}/src/nodejs/lambda-layers/${1}
  npm install --production --force  --lockfile-version=2
  npm pack
  cd ${DIR}/temp
  mkdir nodejs
  cd nodejs
  mkdir node_modules
  npm install --no-save ${DIR}/src/nodejs/lambda-layers/${1}/${1}-1.0.0.tgz
  cd ..
  zip -r ${DIR}/artifacts/${1}-layer.zip nodejs
  rm -rf nodejs
  cd ${DIR}
}

install_lambda() {
  cd ${DIR}/temp
  cp ${DIR}/src/nodejs/lambda-handlers/${1}.js .
  if [ -d ${DIR}/src/nodejs/lambda-handlers/${1} ]
  then
    cp -R ${DIR}/src/nodejs/lambda-handlers/${1} .
  fi
  zip -r ${DIR}/artifacts/${1}-lambda.zip .
  cd ${DIR}
  rm -rf ${DIR}/temp/*
}

oas_to_hcl() {
  node -e "
    const OasToHcl = require('${DIR}/scripts/oas-to-hcl.js');
    const oas = require('${1}');
    const api = new OasToHcl(oas);
    fs.writeFileSync('${2}', api.getHcl());
  "
}

replace() {
  node -e "
    const getSrc = (arg) => {
      const [type, src] = arg.split(':');
      if (type === 'module') {
        return JSON.stringify(require(src));
      } else if (type === 'raw') {
        return fs.readFileSync(src, 'utf-8');
      } else if (type === 'string') {
        return src;
      }
    }
    const getPattern = (arg) => {
      const [type, value] = arg.split(':');
      if (type === 'all') {
        return new RegExp(value, 'g');
      } else if (type === 'one') {
        return value;
      }
    }
    const baseStr = getSrc('${1}');
    const replStr = getSrc('${2}');
    const pattern = getPattern('${3}');
    const outFile = '${4}';

    fs.writeFileSync(outFile, baseStr.replace(pattern, replStr));
  "
}

compile_oas_schema() {
  node -e "
    const schemaUtil = require('./src/nodejs/lambda-layers/schema-util/src/models/index.js');
    const models = schemaUtil.allModels('/components/schemas/');
    const oas = JSON.parse(fs.readFileSync('./src/openapi/openapi.json'));
    oas.components.schemas = models;
    fs.writeFileSync('${1}', JSON.stringify(oas, null, 2));
  "
}

prettify_json() {
  node -e "
    const data = JSON.stringify(require('${1}'), null, 2);
    fs.writeFileSync('${2}', data)
  "
}
