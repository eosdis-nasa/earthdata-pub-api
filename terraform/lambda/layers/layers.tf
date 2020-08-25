# Database Driver Layer

resource "aws_lambda_layer_version" "database_driver" {
  filename            = "../artifacts/database-driver-layer.zip"
  layer_name          = "databaseDriverLayer${var.stage_suffix}"
  compatible_runtimes = ["nodejs12.x"]
}

# Message Driver Layer

resource "aws_lambda_layer_version" "message_driver" {
  filename            = "../artifacts/message-driver-layer.zip"
  layer_name          = "messageDriverLayer${var.stage_suffix}"
  compatible_runtimes = ["nodejs12.x"]
}

# Schema Layer

resource "aws_lambda_layer_version" "schema_util" {
  filename            = "../artifacts/schema-util-layer.zip"
  layer_name          = "schemaUtilLayer${var.stage_suffix}"
  compatible_runtimes = ["nodejs12.x"]
}
