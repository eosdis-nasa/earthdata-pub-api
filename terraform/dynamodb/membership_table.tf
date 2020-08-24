resource "aws_dynamodb_table" "edp-dynamodb-table-membership" {
  name = "membership${var.stage_suffix}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"
  range_key = "group_id"

  global_secondary_index {
    name               = "group_id"
    hash_key           = "group_id"
    range_key          = "id"
    projection_type    = "ALL"
    read_capacity      = 0
    write_capacity     = 0
  }

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "group_id"
    type = "S"
  }

  point_in_time_recovery {
    enabled = false
  }

  tags = {
    Name        = "edp-table-membership"
    Environment = var.stage
  }
}
