resource "aws_dynamodb_table" "edp-dynamodb-table-form" {
  name = "form${var.stage_suffix}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"

  global_secondary_index {
    name               = "gs_index"
    hash_key           = "unique_name"
    range_key          = "version"
    projection_type    = "INCLUDE"
    non_key_attributes = ["version", "text", "sections", "id", "unique_name"]
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
    Name        = "edp-table-form"
    Environment = "dev"
  }
}
