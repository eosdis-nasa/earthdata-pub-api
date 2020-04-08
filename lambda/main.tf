resource "aws_lambda_layer_version" "database_driver_layer" {
  filename   = "./lambda/artefacts/database-driver-layer.zip"
  layer_name = "databaseDriverLayer"
  compatible_runtimes = ["nodejs12.x"]
}

resource "aws_lambda_function" "get_item" {
  filename      = "./lambda/artefacts/get-item-lambda.zip"
  function_name = "getItem"
  role          = var.dynamodb_lambda_role_arn
  layers        = ["${aws_lambda_layer_version.database_driver_layer.id}"]
  handler       = "get-item.handler"
  runtime       = "nodejs12.x"
  timeout       = 10
  vpc_config {
     subnet_ids = var.subnet_ids
     security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_function" "put_item" {
  filename      = "./lambda/artefacts/put-item-lambda.zip"
  function_name = "putItem"
  role          = var.dynamodb_lambda_role_arn
  layers        = ["${aws_lambda_layer_version.database_driver_layer.id}"]
  handler       = "put-item.handler"
  runtime       = "nodejs12.x"
  timeout       = 10
  vpc_config {
     subnet_ids = var.subnet_ids
     security_group_ids = var.security_group_ids
  }
}
