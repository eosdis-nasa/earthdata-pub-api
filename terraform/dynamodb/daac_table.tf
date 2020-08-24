resource "aws_dynamodb_table" "edp-dynamodb-table-daac" {
  name = "daac${var.stage_suffix}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"

  global_secondary_index {
    name               = "short_name"
    hash_key           = "short_name"
    projection_type    = "ALL"
    read_capacity      = 0
    write_capacity     = 0
  }

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "short_name"
    type = "S"
  }

  point_in_time_recovery {
    enabled = false
  }

  tags = {
    Name        = "edp-table-daac"
    Environment = var.stage
  }
}
