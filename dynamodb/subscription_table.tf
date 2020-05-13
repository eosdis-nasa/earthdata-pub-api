resource "aws_dynamodb_table" "edp-dynamodb-table-subscription" {
  name = "subscription${var.stage_suffix}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"

  global_secondary_index {
    name               = "gs_subscriber_id"
    hash_key           = "subscriber_id"
    range_key          = "source_id"
    projection_type    = "ALL"
    read_capacity      = 0
    write_capacity     = 0
  }

  global_secondary_index {
    name               = "gs_source_id"
    hash_key           = "source_id"
    range_key          = "subscriber_id"
    projection_type    = "ALL"
    read_capacity      = 0
    write_capacity     = 0
  }

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "subscriber_id"
    type = "S"
  }

  attribute {
    name = "source_id"
    type = "S"
  }

  point_in_time_recovery {
    enabled = false
  }

  tags = {
    Name        = "edp-table-subscription"
    Environment = var.stage
  }
}
