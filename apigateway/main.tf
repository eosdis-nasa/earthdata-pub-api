resource "aws_api_gateway_rest_api" "earthdatapub_api_gateway" {
  name        = "EarthdataPubAPI"
  description = "API to access codingtips application"
  body        = data.template_file.earthdata_pub_openapi.rendered
}

data "local_file" "schema_file" {
    filename = "./apigateway/schema.json"
}

data "template_file" "earthdata_pub_openapi" {
  template = file("./apigateway/openapi.json")
  vars = {
    schema_file = data.local_file.schema_file.content
    get_item_lambda_arn = var.get_item_lambda_arn
    put_item_lambda_arn = var.put_item_lambda_arn
  }
}

resource "aws_api_gateway_deployment" "earthdatapub_api_gateway_deployment" {
  rest_api_id = aws_api_gateway_rest_api.earthdatapub_api_gateway.id
  stage_name = "default"
}
