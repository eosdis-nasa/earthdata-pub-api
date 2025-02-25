
output "edpub_ses_bounce_rate_alarm_arn" {
  value = aws_cloudwatch_metric_alarm.edpub_ses_bounce_rate_alarm.arn
}

output "edpub_ses_bounce_rate_alarm_id" {
  value = aws_cloudwatch_metric_alarm.edpub_ses_bounce_rate_alarm.id
}

output "edpub_ses_complaint_rate_alarm_arn" {
  value = aws_cloudwatch_metric_alarm.edpub_ses_complaint_rate_alarm.arn
}

output "edpub_ses_complaint_rate_alarm_id" {
  value = aws_cloudwatch_metric_alarm.edpub_ses_complaint_rate_alarm.id
}
