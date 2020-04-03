
resource "aws_lambda_layer_version" "database_driver_layer" {
  filename   = "./lambda/layers/database-driver-layer.zip"
  layer_name = "databaseDriverLayer"

  compatible_runtimes = ["nodejs12.x"]
}
