output "edpub_event_sns_arn" {
  value = aws_sns_topic.edpub_event_sns.arn
}

output "edpub_outbound_sns_arn" {
  value = aws_sns_topic.edpub_event_sns.arn
}

output "edpub_email_sns_arn" {
  value = aws_sns_topic.edpub_email_sns.arn
}

output "edpub_metrics_sns_arn" {
  value = aws_sns_topic.edpub_metrics_sns.arn
}
