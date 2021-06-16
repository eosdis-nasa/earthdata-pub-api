resource "aws_sns_topic" "edpub_event_sns" {
  name = "edpub_event_sns"
  delivery_policy = data.local_file.delivery_policy.content
}

resource "aws_sns_topic" "edpub_email_sns" {
  name = "edpub_email_sns"
  delivery_policy = data.local_file.delivery_policy.content
}

resource "aws_sns_topic" "edpub_metrics_sns" {
  name = "edpub_metrics_sns"
  delivery_policy = data.local_file.delivery_policy.content
}

resource "aws_sns_topic_subscription" "edpub_action_sqs" {
  topic_arn = aws_sns_topic.edpub_metrics_sns.arn
  protocol  = "sqs"
  endpoint  = var.cloud_metrics_sqs
}

data "local_file" "delivery_policy" {
  filename = "./sns/sns_delivery_policy.json"
}
