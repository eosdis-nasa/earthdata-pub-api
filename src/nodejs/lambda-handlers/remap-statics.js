/**
 * Lambda to update request templates in the api after redeploying the overview,
 * dashboard, and/or forms apps
 * @module RemapStatics
 */

const { APIGateway } = require('@aws-sdk/client-api-gateway');
const { S3 } = require('@aws-sdk/client-s3');

const region = process.env.REGION;
const stage = process.env.STAGE;
const apiId = process.env.API_ID;

const staticSites = {
  overview: { bucket: process.env.OVERVIEW_BUCKET, path: '/{key+}' },
  dashboard: { bucket: process.env.DASHBOARD_BUCKET, path: '/dashboard/{key+}' }
};

const s3 = new S3({ region });
const apigateway = new APIGateway({ region });

function getResourceIds() {
  console.log(`apigateway reponse`, apigateway.getResources({ restApiId: apiId, limit: '500' });
  return new Promise((resolve, reject) => {
    apigateway.getResources({ restApiId: apiId, limit: '500' }, (err, data) => {
      if (err) { reject(err); } else {
        resolve(data.items.reduce((resourceIds, resource) => {
          resourceIds[resource.path] = resource.id;
          return resourceIds;
        }, {}));
      }
    });
  });
}

function getS3Mappings(bucket) {
  return new Promise((resolve, reject) => {
    s3.listObjectsV2({ Bucket: bucket }, (err, data) => {
      if (err) { reject(err); } else {
        resolve(data.Contents.reduce((mappings, object) => {
          const { Key: key } = object;
          mappings[key] = key;
          return mappings;
        }, { default: 'index.html' }));
      }
    });
  });
}

function updateRequestTemplate(resourceId, template) {
  return new Promise((resolve, reject) => {
    apigateway.updateIntegration({
      httpMethod: 'GET',
      resourceId,
      restApiId: apiId,
      patchOperations: [
        {
          op: 'replace',
          path: '/requestTemplates/application~1json',
          value: template
        }
      ]
    }, (err, data) => {
      if (err) { reject(err); } else {
        resolve(data);
      }
    });
  });
}

function createTemplate(mappings) {
  const template = `
  #set($mappings = ${JSON.stringify(mappings)})
  #set($key = $method.request.path.key)
  #if ($mappings.containsKey($key))
    #set($context.requestOverride.path.key = $mappings.get($key))
  #else
    #set($context.requestOverride.path.key = $mappings.get('default'))
  #end`;
  return template;
}

async function deployChanges() {
  const params = { restApiId: apiId, stageName: stage };
  await apigateway.createDeployment(params);
}

async function handler() {
  const resourceIds = await getResourceIds();
  console.log(`resourceIds:`, resourceIds);
  await Promise.all(Object.entries(staticSites).map(async ([key, site]) => {
    console.info(`Mapping '${key}'`);
    const mappings = await getS3Mappings(site.bucket);
    const template = createTemplate(mappings);
    const resourceId = resourceIds[site.path];
    await updateRequestTemplate(resourceId, template);
  }));

  await deployChanges();

  return { statusCode: 200 };
}

module.exports.handler = handler;
