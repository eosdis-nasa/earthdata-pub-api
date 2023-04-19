resource "aws_s3_bucket" "earthdatapub-upload" {
  bucket = "earthdatapub-upload-${var.environment}"
  acl    = "private"

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
  lifecycle {
    prevent_destroy = true
  }
}