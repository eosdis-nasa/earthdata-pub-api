resource "aws_dynamodb_table" "edp-dynamodb-table-question" {
  name = "question${var.stage_suffix}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"
  range_key = "version"

  global_secondary_index {
    name               = "id_scan"
    hash_key           = "id"
    range_key          = "question_name"
    projection_type    = "INCLUDE"
    non_key_attributes = ["id", "question_name", "version"]
  }

  global_secondary_index {
    hash_key           = "question_name"
    name               = "question_name"
    projection_type    = "ALL"
    range_key          = "version"
    read_capacity      = 0
    write_capacity     = 0
  }

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "question_name"
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
    Name        = "edp-table-question"
    Environment = var.stage
  }
}
