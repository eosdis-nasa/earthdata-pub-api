resource "aws_dynamodb_table" "edp-dynamodb-table-note" {
  name = "note${var.stage_suffix}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"

  global_secondary_index {
    name               = "recipient_id"
    hash_key           = "recipient_id"
    range_key          = "id"
    projection_type    = "ALL"
    read_capacity      = 0
    write_capacity     = 0
  }

  global_secondary_index {
    name               = "source_id"
    hash_key           = "source_id"
    range_key          = "id"
    projection_type    = "ALL"
    read_capacity      = 0
    write_capacity     = 0
  }

  global_secondary_index {
    name               = "timestamp"
    hash_key           = "timestamp"
    range_key          = "recipient_id"
    projection_type    = "ALL"
    read_capacity      = 0
    write_capacity     = 0
  }

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "recipient_id"
    type = "S"
  }

  attribute {
    name = "source_id"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "S"
  }

  point_in_time_recovery {
    enabled = false
  }

  tags = {
    Name        = "edp-table-note"
    Environment = var.stage
  }
}
