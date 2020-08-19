clear_artifacts() {
  rm ${DIR}/main.tf
  rm ${DIR}/artifacts/*.zip
  rm ${DIR}/apigateway/main.tf*
  rm ${DIR}/lambda/layers.tf
  rm ${DIR}/lambda/override.tf
  rm -rf ${DIR}/docs/jsdoc
  rm -rf ${DIR}/docs/apidoc
  rm -rf temp
  mkdir temp
}

package_layer() {
  if [[ $TARGET == "aws" ]]
  then
    cd ${DIR}/temp
    mkdir nodejs
    cd nodejs
    npm install --production ${DIR}/lambda/modules/${1}/${1}-1.0.0.tgz
    cd ..
    zip -r ${DIR}/artifacts/${1}-layer.zip nodejs
    rm -rf nodejs
  fi
}

package_lambda() {
  cd ${DIR}/temp
  cp -R ${DIR}/lambda/modules/${1}/src/* ./.
  cp ${DIR}/profiles/${PROFILE}/client-config.js .
  if [[ $TARGET == "localstack" ]]
  then
    cp -R ${DIR}/lambda/modules/${1}/node_modules ./.
  fi
  zip -r ${DIR}/artifacts/${1}-lambda.zip .
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

prettify_json() {
  node -e "
    const data = JSON.stringify(require('${1}'), null, 2);
    fs.writeFileSync('${2}', data)
  "
}
