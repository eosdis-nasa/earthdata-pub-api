// Most EDPub buckets are currently manually created to avoid any accidental deletion. 
//The upload bucket is an exception in order to ensure cors configurations are maintained and deployed correctly.
//Upload bucket
resource "aws_s3_bucket" "earthdatapub-upload" {
  bucket = "earthdatapub-upload-${var.environment}"
  lifecycle {
    prevent_destroy = true
  }

  # Group upload age-off after 14 days
  lifecycle_rule {
    id      = "group-upload-age-off"
    prefix  = "group/"
    enabled = true

    expiration {
      days = 14
    }
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "upload-encryption" {
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
    allowed_methods = ["POST", "GET"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}