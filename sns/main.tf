resource "aws_sns_topic" "edpub_topic" {
  name = "edpub_topic${var.stage_suffix}"
  delivery_policy = data.local_file.delivery_policy.content
}

resource "aws_sns_topic" "edpub_email_topic" {
  name = "edpub_email_topic${var.stage_suffix}"
  delivery_policy = data.local_file.delivery_policy.content
}

data "local_file" "delivery_policy" {
  filename = "./sns/sns_delivery_policy.json"
}
