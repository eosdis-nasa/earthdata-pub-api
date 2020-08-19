resource "aws_dynamodb_table" "edp-dynamodb-table-user" {
  name = "user${var.stage_suffix}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"

  global_secondary_index {
    name               = "email"
    hash_key           = "email"
    range_key          = "user_name"
    projection_type    = "ALL"
    read_capacity      = 0
    write_capacity     = 0
  }

  global_secondary_index {
    name               = "user_name"
    hash_key           = "user_name"
    range_key          = "email"
    projection_type    = "ALL"
    read_capacity      = 0
    write_capacity     = 0
  }

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "user_name"
    type = "S"
  }

  attribute {
    name = "email"
    type = "S"
  }

  point_in_time_recovery {
    enabled = false
  }

  tags = {
    Name        = "edp-table-user"
    Environment = var.stage
  }
}
