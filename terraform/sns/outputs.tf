output "edpub_topic_arn" {
  value = aws_sns_topic.edpub_topic.arn
}

output "edpub_email_topic_arn" {
  value = aws_sns_topic.edpub_email_topic.arn
}

output "edpub_metrics_topic_arn" {
  value = aws_sns_topic.edpub_metrics_topic.arn
}
