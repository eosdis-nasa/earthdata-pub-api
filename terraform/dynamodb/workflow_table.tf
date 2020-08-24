resource "aws_dynamodb_table" "edp-dynamodb-table-workflow" {
  name = "workflow${var.stage_suffix}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"

  global_secondary_index {
    name               = "workflow_name"
    hash_key           = "workflow_name"
    range_key          = "version"
    projection_type    = "ALL"
    read_capacity      = 0
    write_capacity     = 0
  }

  global_secondary_index {
    name               = "daac_id"
    hash_key           = "daac_id"
    range_key          = "workflow_name"
    projection_type    = "ALL"
    read_capacity      = 0
    write_capacity     = 0
  }

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "workflow_name"
    type = "S"
  }

  attribute {
    name = "version"
    type = "N"
  }

  attribute {
    name = "daac_id"
    type = "S"
  }

  point_in_time_recovery {
    enabled = false
  }

  tags = {
    Name        = "edp-table-workflow"
    Environment = var.stage
  }
}
