/**
 * Lambda to update request templates in the api after redeploying the overview, dashboard, and/or forms apps
 * @module RemapStatics
 */

const { S3, APIGateway } = require("aws-sdk")

const region = process.env.REGION;
const apiId = process.env.API_ID;

const staticSites = {
  overview: { bucket: process.env.OVERVIEW_BUCKET, path: '/{key+}' },
  dashboard: { bucket: process.env.DASHBOARD_BUCKET, path: '/dashboard/{key+}' },
  forms: { bucket: process.env.FORMS_BUCKET, path: '/forms/{key+}' }
}

const s3 = new S3({ region });
const apigateway = new APIGateway({ region });

async function handler(event) {
  const resourceIds = await getResourceIds();
  await Promise.all(Object.entries(staticSites).map(async ([key, site]) => {
    const mappings = await getS3Mappings(site.bucket);
    const template = createTemplate(mappings);
    const resourceId = resourceIds[site.path];
    await updateRequestTemplate(resourceId, template);
  }));

  return { statusCode: 200 }
}

function getS3Mappings(bucket) {
  return new Promise((resolve, reject) => {
    s3.listObjectsV2({ Bucket: bucket }, (err, data) => {
      if (err) { reject(err) }
      else {
        resolve(data.Contents.reduce((mappings, object) => {
          const { Key: key } = object;
          mappings[key] = key;
          return mappings;
        }, { default: 'index.html'}));
      }
    });
  });
}

function getResourceIds() {
  return new Promise((resolve, reject) => {
    apigateway.getResources({ restApiId: apiId, limit: '500' }, (err, data) => {
      if (err) { reject(err) }
      else {
        resolve(data.items.reduce((resourceIds, resource) => {
          resourceIds[resource.path] = resource.id;
          return resourceIds;
        }, {}));
      }
    });
  });
}

function updateRequestTemplate(resourceId, template) {
  return new Promise((resolve, reject) => {
    apigateway.updateIntegration({
      httpMethod: 'GET',
      resourceId: resourceId,
      restApiId: apiId,
      patchOperations: [
        {
          op: 'replace',
          path: '/requestTemplates/application~1json',
          value: template
        }
      ]
    }, (err, data) => {
      if (err) { reject(err) }
      else {
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

module.exports.handler = handler;
