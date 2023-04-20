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

resource "aws_s3_bucket_acl" "upload-acl" {
  bucket = aws_s3_bucket.earthdatapub-upload.id
  acl    = "private"
}