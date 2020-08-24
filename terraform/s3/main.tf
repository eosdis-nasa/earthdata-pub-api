resource "aws_s3_bucket" "edpub_action" {
  bucket = "edpub-action${var.stage_suffix}"
  acl    = "private"

  tags = {
    Name        = "EDPUB Action Bucket"
    Environment = var.stage
  }
}
