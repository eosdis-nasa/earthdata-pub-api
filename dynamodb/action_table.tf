resource "aws_dynamodb_table" "edp-dynamodb-table-action" {
  name = "action${var.stage_suffix}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"

  global_secondary_index {
    hash_key           = "action_name"
    name               = "action_name"
    range_key          = "version"
    projection_type    = "ALL"
    read_capacity      = 0
    write_capacity     = 0
  }

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "action_name"
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
    Name        = "edp-table-action"
    Environment = var.stage
  }
}
