output "edpub_action_sqs_arn" {
  value = aws_sqs_queue.edpub_action_sqs.arn
}

output "edpub_action_sqs_url" {
  value = aws_sqs_queue.edpub_action_sqs.id
}
