resource "aws_dynamodb_table" "edp-dynamodb-table-html-pages" {
  name = "html_pages${var.stage_suffix}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"

  attribute {
    name = "id"
    type = "S"
  }

  point_in_time_recovery {
    enabled = false
  }

  tags = {
    Name        = "edp-table-html-pages"
    Environment = var.stage
  }
}
