output "action_handler_lambda_role_arn" {
  value = aws_iam_role.action_handler_lambda_role.arn
}

output "dashboard_lambda_role_arn" {
  value = aws_iam_role.dashboard_lambda_role.arn
}

output "information_lambda_role_arn" {
  value = aws_iam_role.information_lambda_role.arn
}

output "invoke_lambda_role_arn" {
  value = aws_iam_role.invoke_lambda_role.arn
}

output "metrics_handler_lambda_role_arn" {
  value = aws_iam_role.metrics_handler_lambda_role.arn
}

output "notification_handler_lambda_role_arn" {
  value = aws_iam_role.notification_handler_lambda_role.arn
}

output "notify_lambda_role_arn" {
  value = aws_iam_role.notify_lambda_role.arn
}

output "register_lambda_role_arn" {
  value = aws_iam_role.register_lambda_role.arn
}

output "subscription_lambda_role_arn" {
  value = aws_iam_role.subscription_lambda_role.arn
}

output "submission_lambda_role_arn" {
  value = aws_iam_role.submission_lambda_role.arn
}

output "workflow_handler_lambda_role_arn" {
  value = aws_iam_role.workflow_handler_lambda_role.arn
}
