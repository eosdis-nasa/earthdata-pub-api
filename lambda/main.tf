resource "aws_lambda_layer_version" "database_driver_layer" {
  filename   = "./lambda/artefacts/database-driver-layer.zip"
  layer_name = "databaseDriverLayer"
  compatible_runtimes = ["nodejs12.x"]
}

resource "aws_lambda_function" "get_item" {
  filename      = "./lambda/artefacts/get-item-lambda.zip"
  function_name = "getItem"
  role          = "var.dynamodb_lambda_role_arn"
  layers        = ["${aws_lambda_layer_version.database_driver_layer.id}"]
  handler       = "get-item.handler"
  runtime = "nodejs12.x"
  vpc_config {
    subnet_ids = ["subnet-04be208d6a441ee8f", "0b9d5b5ff8056a58d"]
    security_group_ids = ["sg-0029de45595e603f6"]
  }
}
