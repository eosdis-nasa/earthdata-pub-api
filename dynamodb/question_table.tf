resource "aws_dynamodb_table" "edp-dynamodb-table-question" {
  name = "question"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "unique_name"
    type = "S"
  }

  attribute {
    name = "version"
    type = "N"
  }

  global_secondary_index {
    name               = "question_index"
    hash_key           = "unique_name"
    range_key          = "version"
    projection_type    = "INCLUDE"
    non_key_attributes = ["id", "unique_name", "version", "title", "text", "help", "inputs"]
  }

  tags = {
    Name        = "edp-table-question"
    Environment = "dev"
  }
}
