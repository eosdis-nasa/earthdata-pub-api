resource "aws_dynamodb_table" "edp-dynamodb-table-group" {
  name = "group${var.stage_suffix}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"

  global_secondary_index {
    name               = "group_name"
    hash_key           = "group_name"
    projection_type    = "ALL"
    read_capacity      = 0
    write_capacity     = 0
  }

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "group_name"
    type = "S"
  }

  point_in_time_recovery {
    enabled = false
  }

  tags = {
    Name        = "edp-table-group"
    Environment = var.stage
  }
}
