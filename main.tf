provider "aws" {
  profile = "default"
  region  = "us-west-2"
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

module "iam_roles" {
  source = "./iam"

  region = "${data.aws_region.current.name}"
  account_id = "${data.aws_caller_identity.current.account_id}"
}

module "dynamodb_tables" {
  source = "./dynamodb"
}

module "lambda_functions" {
  source = "./lambda"

  region = "${data.aws_region.current.name}"
  account_id = "${data.aws_caller_identity.current.account_id}"
  dynamodb_lambda_role_arn = "${module.iam_roles.dynamodb_lambda_role_arn}"
  api_id = "${module.apigateway_endpoints.api_id}"
}

module "apigateway_endpoints" {
  source = "./apigateway"

  get_item_lambda_arn = "${module.lambda_functions.get_item_lambda_arn}"
  put_item_lambda_arn = "${module.lambda_functions.put_item_lambda_arn}"
}
