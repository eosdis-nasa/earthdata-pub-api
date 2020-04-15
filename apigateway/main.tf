locals {
  api_name = "EarthdataPubAPI_${var.stage}"
}
resource "aws_api_gateway_rest_api" "earthdatapub_api_gateway" {
  name        = local.api_name
  description = "This is the API that serves as the central interaction point between the client and back-end services of Earthdata Pub."
  body        = data.template_file.earthdata_pub_openapi.rendered
  policy      = data.local_file.ngap_policy.content
}

data "local_file" "schema_file" {
  filename = "./apigateway/schema.json"
}

data "local_file" "ngap_policy" {
  filename = "./iam/${var.api_gateway_policy}"
}

data "template_file" "earthdata_pub_openapi" {
  template = file("./apigateway/openapi.json")
  vars = {
    api_name = local.api_name
    schema_file = data.local_file.schema_file.content
    get_item_lambda_arn = var.get_item_lambda_arn
    put_item_lambda_arn = var.put_item_lambda_arn
  }
}

resource "aws_api_gateway_deployment" "earthdatapub_api_gateway_deployment" {
  rest_api_id = aws_api_gateway_rest_api.earthdatapub_api_gateway.id
  stage_name = var.stage
}
