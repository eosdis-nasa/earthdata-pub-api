// Most EDPub buckets are currently manually created to avoid any accidental deletion. 
//The upload bucket is an exception in order to ensure cors configurations are maintained and deployed correctly.
//Upload bucket
resource "aws_s3_bucket" "earthdatapub-upload" {
  // Data upload should only be enabled in SIT until data upload solution finalized
  count = contains(["sit"], var.environment) ? 1 : 0
  bucket = "earthdatapub-upload-${var.environment}"
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "upload-encryption" {
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