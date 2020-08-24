resource "aws_dynamodb_table" "edp-dynamodb-table-permission" {
  name = "permission${var.stage_suffix}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"
  range_key = "entity_id"

  global_secondary_index {
    name               = "table_name"
    hash_key           = "table_name"
    range_key          = "id"
    projection_type    = "ALL"
    read_capacity      = 0
    write_capacity     = 0
  }

  global_secondary_index {
    name               = "entity_id"
    hash_key           = "entity_id"
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
    name = "table_name"
    type = "S"
  }

  attribute {
    name = "entity_id"
    type = "S"
  }

  point_in_time_recovery {
    enabled = false
  }

  tags = {
    Name        = "edp-table-permission"
    Environment = var.stage
  }
}
