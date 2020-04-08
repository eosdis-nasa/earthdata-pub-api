resource "aws_api_gateway_rest_api" "earthdatapub_api_gateway" {
  name        = "EarthdataPubAPI"
  description = "API to access codingtips application"
  body        = data.template_file.earthdata_pub_openapi.rendered
}

data "template_file" "earthdata_pub_openapi" {
  template = "${file("./apigateway/openapi.yml")}"
  vars = {
    get_item_lambda_arn = var.get_item_lambda_arn
    put_item_lambda_arn = var.put_item_lambda_arn
  }
}

resource "aws_api_gateway_deployment" "earthdatapub_api_gateway_deployment" {
  rest_api_id = "${aws_api_gateway_rest_api.earthdatapub_api_gateway.id}"
  stage_name = "default"
}

output "url" {
  value = "${aws_api_gateway_deployment.earthdatapub_api_gateway_deployment.invoke_url}/data"
}
