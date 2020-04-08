provider "aws" {
  profile = "default"
  region  = "us-west-2"
}

module "iam_roles" {
  source = "./iam"
}

module "dynamodb_tables" {
  source = "./dynamodb"
}

module "lambda_functions" {
  source = "./lambda"

  dynamodb_lambda_role_arn = "${module.iam_roles.dynamodb_lambda_role_arn}"
}

module "apigateway_endpoints" {
  source = "./apigateway"

  get_item_lambda_arn = "${module.lambda_functions.get_item_lambda_arn}"
  put_item_lambda_arn = "${module.lambda_functions.put_item_lambda_arn}"
}
