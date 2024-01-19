resource "aws_sns_topic" "edpub_event_sns" {
  name                        = "edpub_event_sns.fifo"
  fifo_topic                  = true
  content_based_deduplication = true
}

resource "aws_sns_topic" "edpub_outbound_sns" {
  name = "edpub_outbound_sns"
}

resource "aws_sns_topic" "edpub_email_sns" {
  name = "edpub_email_sns"
}

resource "aws_sns_topic" "edpub_metrics_sns" {
  name = "edpub_metrics_sns"
}

data "local_file" "delivery_policy" {
  filename = "./sns/sns_delivery_policy.json"
}
