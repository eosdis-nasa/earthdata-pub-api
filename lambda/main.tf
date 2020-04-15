resource "aws_lambda_layer_version" "database_driver_layer" {
  filename   = "./lambda/artefacts/database-driver-layer.zip"
  layer_name = "databaseDriverLayer"
  compatible_runtimes = ["nodejs12.x"]
}

resource "aws_lambda_function" "get_item" {
  filename      = "./lambda/artefacts/get-item-lambda.zip"
  function_name = "get_item_${var.stage}"
  role          = var.dynamodb_lambda_role_arn
  layers        = [aws_lambda_layer_version.database_driver_layer.id]
  handler       = "get-item.handler"
  runtime       = "nodejs12.x"
  timeout       = 10
  vpc_config {
     subnet_ids = var.subnet_ids
     security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "apigw_invoke_get_item" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_item.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/GET/*"
}

resource "aws_lambda_function" "put_item" {
  filename      = "./lambda/artefacts/put-item-lambda.zip"
  function_name = "put_item_${var.stage}"
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

resource "aws_lambda_permission" "apigw_invoke_put_item" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.put_item.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/POST/*"
}
