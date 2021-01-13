resource "aws_sqs_queue" "edpub_action_sqs" {
  name = "edpub_action_sqs"
}

resource "aws_sqs_queue_policy" "edpub_action_sqs_policy" {
  queue_url = aws_sqs_queue.edpub_action_sqs.id

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sqs:SendMessage",
      "Effect": "Allow",
      "Principal": "*",
      "Resource": "${aws_sqs_queue.edpub_action_sqs.arn}",
      "Condition": {
        "ArnEquals": {
          "aws:SourceArn": "${var.edpub_event_sns_arn}"
        }
      }
    }
  ]
}
POLICY
}

data "local_file" "edpub_action_sqs_filter" {
  filename = "./sqs/edpub_action_sqs_filter.json"
}

resource "aws_sns_topic_subscription" "edpub_action_sqs" {
  topic_arn = var.edpub_event_sns_arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.edpub_action_sqs.arn
  filter_policy = data.local_file.edpub_action_sqs_filter.content
}
