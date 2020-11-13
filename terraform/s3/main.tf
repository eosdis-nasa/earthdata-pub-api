resource "aws_s3_bucket" "edpub_action" {
  bucket = "edpub-action-${var.stage}"
  acl    = "private"
}
