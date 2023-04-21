resource "aws_s3_bucket" "earthdatapub-upload" {
  bucket = "earthdatapub-upload-${var.environment}"
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "upload-encription" {
  bucket = aws_s3_bucket.earthdatapub-upload.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_cors_configuration" "upload-cors" {
  bucket = aws_s3_bucket.earthdatapub-upload.id
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}