resource "aws_dynamodb_table" "edp-dynamodb-table-submission" {
  name = "submission${var.stage_suffix}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"

  global_secondary_index {
    name               = "gs_initiator_id"
    hash_key           = "initiator_id"
    range_key          = "daac_id"
    projection_type    = "ALL"
    read_capacity      = 0
    write_capacity     = 0
  }

  global_secondary_index {
    name               = "gs_workflow_id"
    hash_key           = "workflow_id"
    range_key          = "initiator_id"
    projection_type    = "ALL"
    read_capacity      = 0
    write_capacity     = 0
  }

  global_secondary_index {
    name               = "gs_daac_id"
    hash_key           = "daac_id"
    range_key          = "workflow_id"
    projection_type    = "ALL"
    read_capacity      = 0
    write_capacity     = 0
  }

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "initiator_id"
    type = "S"
  }

  attribute {
    name = "workflow_id"
    type = "S"
  }

  attribute {
    name = "daac_id"
    type = "S"
  }

  point_in_time_recovery {
    enabled = false
  }

  tags = {
    Name        = "edp-table-submission"
    Environment = var.stage
  }
}
