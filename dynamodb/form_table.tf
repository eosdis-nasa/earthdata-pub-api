resource "aws_dynamodb_table" "edp-dynamodb-table-form" {
  name = "form${var.stage_suffix}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"
  range_key = "version"

  global_secondary_index {
    name               = "form_name"
    hash_key           = "form_name"
    range_key          = "version"
    projection_type    = "ALL"
    read_capacity      = 0
    write_capacity     = 0
  }

  global_secondary_index {
    name               = "id_scan"
    hash_key           = "id"
    range_key          = "form_name"
    projection_type    = "INCLUDE"
    non_key_attributes = ["id", "form_name", "version"]
  }

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "form_name"
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
    Environment = var.stage
  }
}
