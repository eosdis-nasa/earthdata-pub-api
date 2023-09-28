# Inbound Queue

resource "aws_sqs_queue" "edpub_inbound_sqs" {
  name                        = "edpub_inbound_sqs.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  visibility_timeout_seconds  = var.visibility_timeout_seconds
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.edpub_inbound_sqs_dead_letter_queue.arn
    maxReceiveCount     = var.maxReceiveCount
  })
}

resource "aws_sqs_queue" "edpub_inbound_sqs_dead_letter_queue" {
  name                       = "edpub_inbound_sqs_DeadLetterQueue.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  receive_wait_time_seconds  = var.receive_wait_time_seconds
  visibility_timeout_seconds  = var.visibility_timeout_seconds
  message_retention_seconds  = var.dlq_message_retention
}

# Action Queue

resource "aws_sqs_queue" "edpub_action_sqs" {
  name                        = "edpub_action_sqs.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  visibility_timeout_seconds  = var.visibility_timeout_seconds
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.edpub_action_sqs_dead_letter_queue.arn
    maxReceiveCount     = var.maxReceiveCount
  })
}

data "template_file" "edpub_action_sqs_policy" {
  template = file("./sqs/policy_template.json")
  vars = {
    sqs_arn = aws_sqs_queue.edpub_action_sqs.arn
    sns_arn = var.edpub_event_sns_arn
  }
}

data "local_file" "edpub_action_sqs_filter" {
  filename = "./sqs/filter_action_sqs.json"
}

resource "aws_sqs_queue_policy" "edpub_action_sqs_policy" {
  queue_url = aws_sqs_queue.edpub_action_sqs.id
  policy = data.template_file.edpub_action_sqs_policy.rendered
}

resource "aws_sns_topic_subscription" "edpub_action_sqs" {
  topic_arn = var.edpub_event_sns_arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.edpub_action_sqs.arn
  filter_policy = data.local_file.edpub_action_sqs_filter.content
  raw_message_delivery = true
}

resource "aws_sqs_queue" "edpub_action_sqs_dead_letter_queue" {
  name                       = "edpub_action_sqs_DeadLetterQueue.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  receive_wait_time_seconds  = var.receive_wait_time_seconds
  visibility_timeout_seconds  = var.visibility_timeout_seconds
  message_retention_seconds  = var.dlq_message_retention
}

# Metrics Queue

resource "aws_sqs_queue" "edpub_metrics_sqs" {
  name                        = "edpub_metrics_sqs.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  visibility_timeout_seconds  = var.visibility_timeout_seconds
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.edpub_metrics_sqs_dead_letter_queue.arn
    maxReceiveCount     = var.maxReceiveCount
  })
}

data "template_file" "edpub_metrics_sqs_policy" {
  template = file("./sqs/policy_template.json")
  vars = {
    sqs_arn = aws_sqs_queue.edpub_metrics_sqs.arn
    sns_arn = var.edpub_event_sns_arn
  }
}

data "local_file" "edpub_metrics_sqs_filter" {
  filename = "./sqs/filter_metrics_sqs.json"
}

resource "aws_sqs_queue_policy" "edpub_metrics_sqs_policy" {
  queue_url = aws_sqs_queue.edpub_metrics_sqs.id
  policy = data.template_file.edpub_metrics_sqs_policy.rendered
}

resource "aws_sns_topic_subscription" "edpub_metrics_sqs" {
  topic_arn = var.edpub_event_sns_arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.edpub_metrics_sqs.arn
  filter_policy = data.local_file.edpub_metrics_sqs_filter.content
  raw_message_delivery = true
}

resource "aws_sqs_queue" "edpub_metrics_sqs_dead_letter_queue" {
  name                       = "edpub_metrics_sqs_DeadLetterQueue.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  receive_wait_time_seconds  = var.receive_wait_time_seconds
  visibility_timeout_seconds  = var.visibility_timeout_seconds
  message_retention_seconds  = var.dlq_message_retention
}

# Notification Queue

resource "aws_sqs_queue" "edpub_notification_sqs" {
  name                        = "edpub_notification_sqs.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  visibility_timeout_seconds  = var.visibility_timeout_seconds
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.edpub_notification_sqs_dead_letter_queue.arn
    maxReceiveCount     = var.maxReceiveCount
  })
}

data "template_file" "edpub_notification_sqs_policy" {
  template = file("./sqs/policy_template.json")
  vars = {
    sqs_arn = aws_sqs_queue.edpub_notification_sqs.arn
    sns_arn = var.edpub_event_sns_arn
  }
}

data "local_file" "edpub_notification_sqs_filter" {
  filename = "./sqs/filter_notification_sqs.json"
}

resource "aws_sqs_queue_policy" "edpub_notification_sqs_policy" {
  queue_url = aws_sqs_queue.edpub_notification_sqs.id
  policy = data.template_file.edpub_notification_sqs_policy.rendered
}

resource "aws_sns_topic_subscription" "edpub_notification_sqs" {
  topic_arn = var.edpub_event_sns_arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.edpub_notification_sqs.arn
  filter_policy = data.local_file.edpub_notification_sqs_filter.content
  raw_message_delivery = true
}

resource "aws_sqs_queue" "edpub_notification_sqs_dead_letter_queue" {
  name                       = "edpub_notification_sqs_DeadLetterQueue.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  receive_wait_time_seconds  = var.receive_wait_time_seconds
  visibility_timeout_seconds  = var.visibility_timeout_seconds
  message_retention_seconds  = var.dlq_message_retention
}

# Workflow Queue

resource "aws_sqs_queue" "edpub_workflow_sqs" {
  name                        = "edpub_workflow_sqs.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  visibility_timeout_seconds  = var.visibility_timeout_seconds
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.edpub_workflow_sqs_dead_letter_queue.arn
    maxReceiveCount     = var.maxReceiveCount
  })
}

data "template_file" "edpub_workflow_sqs_policy" {
  template = file("./sqs/policy_template.json")
  vars = {
    sqs_arn = aws_sqs_queue.edpub_workflow_sqs.arn
    sns_arn = var.edpub_event_sns_arn
  }
}

data "local_file" "edpub_workflow_sqs_filter" {
  filename = "./sqs/filter_workflow_sqs.json"
}

resource "aws_sqs_queue_policy" "edpub_workflow_sqs_policy" {
  queue_url = aws_sqs_queue.edpub_workflow_sqs.id
  policy = data.template_file.edpub_workflow_sqs_policy.rendered
}

resource "aws_sns_topic_subscription" "edpub_workflow_sqs" {
  topic_arn = var.edpub_event_sns_arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.edpub_workflow_sqs.arn
  filter_policy = data.local_file.edpub_workflow_sqs_filter.content
  raw_message_delivery = true
}

resource "aws_sqs_queue" "edpub_workflow_sqs_dead_letter_queue" {
  name                       = "edpub_workflow_sqs_DeadLetterQueue.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  receive_wait_time_seconds  = var.receive_wait_time_seconds
  visibility_timeout_seconds  = var.visibility_timeout_seconds
  message_retention_seconds  = var.dlq_message_retention
}
