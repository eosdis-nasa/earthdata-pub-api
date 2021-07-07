output "edpub_inbound_sqs_arn" {
  value = aws_sqs_queue.edpub_inbound_sqs.arn
}

output "edpub_inbound_sqs_url" {
  value = aws_sqs_queue.edpub_inbound_sqs.id
}

output "edpub_action_sqs_arn" {
  value = aws_sqs_queue.edpub_action_sqs.arn
}

output "edpub_action_sqs_url" {
  value = aws_sqs_queue.edpub_action_sqs.id
}

output "edpub_metrics_sqs_arn" {
  value = aws_sqs_queue.edpub_metrics_sqs.arn
}

output "edpub_metrics_sqs_url" {
  value = aws_sqs_queue.edpub_metrics_sqs.id
}

output "edpub_notification_sqs_arn" {
  value = aws_sqs_queue.edpub_notification_sqs.arn
}

output "edpub_notification_sqs_url" {
  value = aws_sqs_queue.edpub_notification_sqs.id
}

output "edpub_workflow_sqs_arn" {
  value = aws_sqs_queue.edpub_workflow_sqs.arn
}

output "edpub_workflow_sqs_url" {
  value = aws_sqs_queue.edpub_workflow_sqs.id
}
