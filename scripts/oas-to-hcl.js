class OasToHcl {
  constructor(oas) {
    this.oas = oas;
    this.name = oas.info.title;
    this.base = `aws_api_gateway_rest_api.${this.name}`;
    this.api_id = `\${${this.base}.id}`;
    this.api_arn= `\${${this.base}.arn}`;
    this.root_resource_id = `\${${this.base}.root_resource_id}`;
    this.description = oas.info.description;
    this.hcl = {
      resource: {
        aws_api_gateway_rest_api: {
          [this.name]: {
            name: this.name,
            description: this.description
          }
        },
        aws_api_gateway_deployment: {
          [this.name]: {
            depends_on: [],
            rest_api_id: this.api_id,
            stage_name: '${var.stage}'
          }
        },
        aws_api_gateway_method: {},
        aws_api_gateway_resource: {},
        aws_api_gateway_integration: {}
      }
    }
    this.buildResources();
    this.buildMethods();
  }

  buildResources() {
    const resources = this.hcl.resource.aws_api_gateway_resource;
    Object.keys(this.oas.paths).forEach((path) => {
      path.split('/').slice(1).reduce(([parent_id, id], part) => {
        const newId = [id, part.replace(/[^a-zA-Z ]/g, "")].join('_');
        const ref = this.resourceIdToRef(newId);
        if (!resources[newId]) {
          resources[newId] = {
            rest_api_id: this.api_id,
            parent_id: parent_id,
            path_part: part
          }
        }
        return [ref, newId];
      }, [this.root_resource_id, "resource"]);
    });
  }

  buildMethods() {
    const methods = this.hcl.resource.aws_api_gateway_method;
    const integrations = this.hcl.resource.aws_api_gateway_integration;
    Object.entries(this.oas.paths).forEach(([path, { parameters, ...operations }]) => {
      const sharedParams = this.buildParams(parameters);
      Object.entries(operations).forEach(([type, body]) => {
        const resource = this.resourceIdToRef(this.resourcePathToId(path));
        const [method, integration] = this.parseMethod(resource, type, body, sharedParams);
        Object.assign(methods, method);
        Object.assign(integrations, integration);
      });
    });
  }

  parseMethod(resource, type, body, sharedParams) {
    const integration = body["x-amazon-apigateway-integration"];
    this.hcl['resource']['aws_api_gateway_deployment'][this.name]['depends_on'].push(`aws_api_gateway_integration.${body.operationId}`);
    return [
      {
        [body.operationId]: {
          rest_api_id: this.api_id,
          resource_id: resource,
          http_method: type.toUpperCase(),
          authorization: "NONE",
          api_key_required: false,
          request_parameters: { ...this.buildParams(body.parameters), ...sharedParams }
        }
      },
      {
        [body.operationId]: {
          rest_api_id: this.api_id,
          resource_id: resource,
          http_method: type.toUpperCase(),
          integration_http_method: integration.httpMethod,
          type: integration.type.toUpperCase(),
          uri: this.uriConvert(integration.uri)
        }
      }
    ]
  }

  buildParams(data) {
    const parameters = {};
    if (data) {
      data.forEach((param) => {
        const name = param.name;
        const loc = this.pathType(param.in);
        const param_key = `method.request.${loc}.${name}`;
        parameters[param_key] = !!param.required;
      });
    }
    return parameters;
  }

  pathType(type) {
    if (type === 'query') {
      return 'querystring';
    }
    else return type;
  }

  resourcePathToId(path) {
    return ['resource'].concat(path.replace(/[${}]/g, '').split('/').slice(1)).join('_');
  }

  resourceIdToRef(id) {
    return `\${aws_api_gateway_resource.${id}.id}`;
  }

  uriConvert(uri) {
    return `\${var.${uri.replace(/[${}]/g, "")}}`;
  }

  getHcl() {
    return JSON.stringify(this.hcl, null, 2);
  }
}

module.exports = OasToHcl;
