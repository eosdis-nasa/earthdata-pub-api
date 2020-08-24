output "action_handler_lambda_arn" {
  value = aws_lambda_function.action_handler.invoke_arn
}

output "information_lambda_arn" {
  value = aws_lambda_function.information.invoke_arn
}

output "invoke_lambda_arn" {
  value = aws_lambda_function.invoke.invoke_arn
}

output "notify_lambda_arn" {
  value = aws_lambda_function.notify.invoke_arn
}

output "subscription_lambda_arn" {
  value = aws_lambda_function.subscription.invoke_arn
}

output "submission_lambda_arn" {
  value = aws_lambda_function.submission.invoke_arn
}

output "register_lambda_arn" {
  value = aws_lambda_function.register.invoke_arn
}

output "dashboard_lambda_arn" {
  value = aws_lambda_function.dashboard.invoke_arn
}

output "notification_handler_lambda_arn" {
  value = aws_lambda_function.notification_handler.invoke_arn
}
