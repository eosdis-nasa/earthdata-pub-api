provider "aws" {
  profile = var.profile
  region  = var.region
}

module "iam_roles" {
  source = "./iam"

  region = var.region
  account_id = local.account_id
  stage = var.stage
  stage_suffix = local.stage_suffix
  lambda_execution_policy_arn = local.lambda_execution_policy_arn
  permissions_boundary_arn = local.permissions_boundary_arn
}

module "dynamodb_tables" {
  source = "./dynamodb"

  stage = var.stage
  stage_suffix = local.stage_suffix
}

module "lambda_functions" {
  source = "./lambda"

  region = var.region
  account_id = local.account_id
  stage = var.stage
  stage_suffix = local.stage_suffix
  subnet_ids = var.subnet_ids
  security_group_ids = var.security_group_ids
  dynamodb_lambda_role_arn = "${module.iam_roles.dynamodb_lambda_role_arn}"
  api_id = "${module.apigateway_endpoints.api_id}"
}

module "apigateway_endpoints" {
  source = "./apigateway"

  stage = var.stage
  stage_suffix = local.stage_suffix
  api_gateway_policy = var.api_gateway_policy
  get_item_lambda_arn = "${module.lambda_functions.get_item_lambda_arn}"
  put_item_lambda_arn = "${module.lambda_functions.put_item_lambda_arn}"
}
