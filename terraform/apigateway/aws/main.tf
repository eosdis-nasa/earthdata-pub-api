locals {
  api_name = "EarthdataPubAPI${var.stage_suffix}"
}

resource "aws_api_gateway_rest_api" "EarthdataPub" {
  name        = "EarthdataPub"
  description = "This is the API that serves as the central interaction point between the client and back-end services of Earthdata Pub."
  body        = data.template_file.earthdatapub_openapi.rendered
  lifecycle {
    ignore_changes = [policy]
  }
}

data "template_file" "earthdatapub_openapi" {
  template = file("./apigateway/openapi.json")
  vars = {
    information_lambda_arn    = var.information_lambda_arn
    invoke_lambda_arn         = var.invoke_lambda_arn
    notify_lambda_arn         = var.notify_lambda_arn
    subscription_lambda_arn   = var.subscription_lambda_arn
    submission_lambda_arn     = var.submission_lambda_arn
    register_lambda_arn       = var.register_lambda_arn
    dashboard_lambda_arn      = var.dashboard_lambda_arn
  }
}

resource "aws_api_gateway_deployment" "earthdatapub_api_gateway_deployment" {
  rest_api_id = aws_api_gateway_rest_api.EarthdataPub.id
  stage_name  = var.stage
}
