resource "aws_lambda_layer_version" "edp_schema_layer" {
  filename   = "./lambda/layers/edp-schema-layer.zip"
  layer_name = "edpSchemaLayer"

  compatible_runtimes = ["nodejs12.x"]
}

resource "aws_lambda_layer_version" "dynamodb_driver_layer" {
  filename   = "./lambda/layers/dynamodb-driver-layer.zip"
  layer_name = "dynamodbDriverLayer"

  compatible_runtimes = ["nodejs12.x"]
}
