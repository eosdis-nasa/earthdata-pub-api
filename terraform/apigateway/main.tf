resource "aws_api_gateway_rest_api" "EarthdataPub" {
  name        = "EarthdataPub"
  description = "This is the API that serves as the central interaction point between the client and back-end services of Earthdata Pub."
  body        = data.template_file.edpub_oas.rendered
  policy      = data.local_file.edpub_api_policy.content
  endpoint_configuration {
    types = ["PRIVATE"]
    vpc_endpoint_ids = [var.vpc_endpoint_id]
  }
  lifecycle {
    ignore_changes = [policy]
  }
}

data "template_file" "edpub_oas" {
  template = file("./apigateway/openapi.json")
  vars = {
    auth_lambda_arn               = var.auth_lambda_arn
    data_lambda_arn               = var.data_lambda_arn
    form_lambda_arn               = var.form_lambda_arn
    invoke_lambda_arn             = var.invoke_lambda_arn
    notification_lambda_arn       = var.notification_lambda_arn
    metrics_lambda_arn            = var.metrics_lambda_arn
    model_lambda_arn              = var.model_lambda_arn
    submission_lambda_arn         = var.submission_lambda_arn
    user_lambda_arn               = var.user_lambda_arn
    version_lambda_arn            = var.version_lambda_arn
    questions_lambda_arn          = var.questions_lambda_arn
    workflow_lambda_arn           = var.workflow_lambda_arn
    file_upload_lambda_arn        = var.file_upload_lambda_arn
    edpub_dashboard_s3_bucket     = var.edpub_dashboard_s3_bucket
    edpub_metrics_s3_bucket       = var.edpub_metrics_s3_bucket
    edpub_apigateway_s3_role_arn  = var.edpub_apigateway_s3_role_arn
    cognito_user_pool_arn         = var.cognito_user_pool_arn
    region                        = var.region
    service_authorizer_lambda_arn = var.service_authorizer_lambda_arn
    mfa_auth_lambda_arn           = var.mfa_auth_lambda_arn
    oidc_authorizer_lambda_arn    = var.oidc_authorizer_lambda_arn
  }
}

data "local_file" "edpub_api_policy" {
  filename = "./apigateway/edpub_api_policy.json"
}

resource "aws_api_gateway_deployment" "earthdatapub_api_gateway_deployment" {
  rest_api_id = aws_api_gateway_rest_api.EarthdataPub.id
}

resource "aws_api_gateway_stage" "earthdatapub_api_gateway_stage" {
  deployment_id = aws_api_gateway_deployment.earthdatapub_api_gateway_deployment.id
  rest_api_id = aws_api_gateway_rest_api.EarthdataPub.id
  stage_name    = var.stage
}