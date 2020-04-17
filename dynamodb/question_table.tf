resource "aws_dynamodb_table" "edp-dynamodb-table-question" {
  name = "question${var.stage_suffix}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"

  global_secondary_index {
    hash_key           = "unique_name"
    name               = "gs_index"
    non_key_attributes = ["version", "unique_name", "text", "help", "id", "inputs", "title"]
    projection_type    = "INCLUDE"
    range_key          = "version"
    read_capacity      = 0
    write_capacity     = 0
  }

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "unique_name"
    type = "S"
  }

  attribute {
    name = "version"
    type = "N"
  }

  point_in_time_recovery {
    enabled = false
  }

  tags = {
    Name        = "edp-table-question"
    Environment = var.stage
  }
}
