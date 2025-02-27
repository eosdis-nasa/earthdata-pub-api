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

resource "aws_sns_topic" "edpub_ses_reputation_alarm_sns" {
  name = "edpub_ses_reputation_alarm_sns"
}

resource "aws_sns_topic_subscription" "edpub_ses_alarms" {
  topic_arn = aws_sns_topic.edpub_ses_reputation_alarm_sns.arn
  protocol  = "email-json"
  endpoint  = var.ses_alarm_email
}

data "local_file" "delivery_policy" {
  filename = "./sns/sns_delivery_policy.json"
}
