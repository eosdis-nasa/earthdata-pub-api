output "edpub_queue_arn" {
  value = aws_sqs_queue.edpub_queue.arn
}

output "edpub_queue_url" {
  value = aws_sqs_queue.edpub_queue.id
}
