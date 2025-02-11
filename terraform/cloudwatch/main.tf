resource "aws_cloudwatch_metric_alarm" "edpub_ses_bounce_rate_alarm" {
  alarm_name          = "edpub_ses_bounce_rate_alarm"
  alarm_description   = "Alerts when our SES email bounce rate approaches a level that puts our sender reputation at risk"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1 # Alert if any value exceeds the threshold
  metric_name         = "Reputation.BounceRate"
  namespace           = "AWS/SES"
  period              = 900 # SES bounce rates are reported every 15 minutes
  statistic           = "Maximum"
  threshold           = 0.025 # 2.5%
  treat_missing_data  = "ignore" # Maintain alarm state when no new data is available
 
  # Notify the SNS topic when the alarm triggers or resets (i.e. when the bounce rate crosses the threshold in either direction)
  alarm_actions = [
    var.edpub_ses_reputation_alarm_sns_arn
  ]
  ok_actions    = [
    var.edpub_ses_reputation_alarm_sns_arn
  ]
}
 
resource "aws_cloudwatch_metric_alarm" "edpub_ses_complaint_rate_alarm" {
  alarm_name          = "edpub_ses_complaint_rate_alarm"
  alarm_description   = "Alerts when our SES email complaint rate approaches a level that puts our sender reputation at risk"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1 # Alert if any value exceeds the threshold
  metric_name         = "Reputation.ComplaintRate"
  namespace           = "AWS/SES"
  period              = 900 # SES complaint rates are reported every 15 minutes
  statistic           = "Maximum"
  threshold           = 0.0005 # 0.05%
  treat_missing_data  = "ignore" # Maintain alarm state when no new data is available
 
  # Notify the SNS topic when the alarm triggers or resets (i.e. when the complaint rate crosses the threshold in either direction)
  alarm_actions = [
    var.edpub_ses_reputation_alarm_sns_arn
  ]
  ok_actions    = [
    var.edpub_ses_reputation_alarm_sns_arn
  ]
}