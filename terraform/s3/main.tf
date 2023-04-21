resource "aws_s3_bucket" "earthdatapub-upload" {
  count = contains(["sit"], var.environment) ? 1 : 0
  bucket = "earthdatapub-upload-${var.environment}"
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "upload-encription" {
  count = contains(["sit"], var.environment) ? 1 : 0
  bucket = aws_s3_bucket.earthdatapub-upload.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_cors_configuration" "upload-cors" {
  count = contains(["sit"], var.environment) ? 1 : 0
  bucket = aws_s3_bucket.earthdatapub-upload.id
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}