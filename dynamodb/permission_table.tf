resource "aws_dynamodb_table" "edp-dynamodb-table-permission" {
  name = "permission${var.stage_suffix}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"

  global_secondary_index {
    name               = "gs_index"
    hash_key           = "username"
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
    name = "grantee"
    type = "S"
  }

  attribute {
    name = "entity_id"
    type = "S"
  }

  attribute {
    name = "table"
    type = "S"
  }

  point_in_time_recovery {
    enabled = false
  }

  tags = {
    Name        = "edp-table-permission"
    Environment = "dev"
  }
}
