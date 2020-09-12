resource "aws_lambda_function" "action_handler" {
  layers = [
    aws_lambda_layer_version.database_driver.arn,
    aws_lambda_layer_version.message_driver.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
}

resource "aws_lambda_function" "dashboard" {
  layers = [
      aws_lambda_layer_version.database_driver.arn
  ]
}

resource "aws_lambda_function" "information" {
  layers = [
    aws_lambda_layer_version.database_driver.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
}

resource "aws_lambda_function" "invoke" {
  layers = [
    aws_lambda_layer_version.database_driver.arn,
    aws_lambda_layer_version.message_driver.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
}

resource "aws_lambda_function" "metrics_handler" {
  layers = [
    aws_lambda_layer_version.message_driver.arn
  ]
}

resource "aws_lambda_function" "notification_handler" {
  layers = [
    aws_lambda_layer_version.database_driver.arn,
    aws_lambda_layer_version.message_driver.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
}

resource "aws_lambda_function" "notify" {
  layers = [
    aws_lambda_layer_version.database_driver.arn,
    aws_lambda_layer_version.message_driver.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
}

resource "aws_lambda_function" "register" {
  layers = [
    aws_lambda_layer_version.database_driver.arn,
    aws_lambda_layer_version.message_driver.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
}

resource "aws_lambda_function" "subscription" {
  layers = [
    aws_lambda_layer_version.database_driver.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
}

resource "aws_lambda_function" "submission" {
  layers = [
    aws_lambda_layer_version.database_driver.arn,
    aws_lambda_layer_version.message_driver.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
}

resource "aws_lambda_function" "workflow_handler" {
  layers = [
    aws_lambda_layer_version.database_driver.arn,
    aws_lambda_layer_version.message_driver.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
}
