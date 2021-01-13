output "action_consumer_lambda_arn" {
  value = aws_lambda_function.action_consumer.invoke_arn
}

output "auth_lambda_arn" {
  value = aws_lambda_function.auth.invoke_arn
}

output "data_lambda_arn" {
  value = aws_lambda_function.data.invoke_arn
}

output "invoke_lambda_arn" {
  value = aws_lambda_function.invoke.invoke_arn
}

output "notify_lambda_arn" {
  value = aws_lambda_function.notify.invoke_arn
}

output "metrics_lambda_arn" {
  value = aws_lambda_function.metrics.invoke_arn
}

output "model_lambda_arn" {
  value = aws_lambda_function.model.invoke_arn
}

output "subscribe_lambda_arn" {
  value = aws_lambda_function.subscribe.invoke_arn
}

output "submission_lambda_arn" {
  value = aws_lambda_function.submission.invoke_arn
}

output "register_lambda_arn" {
  value = aws_lambda_function.register.invoke_arn
}

output "notification_consumer_lambda_arn" {
  value = aws_lambda_function.notification_consumer.invoke_arn
}

output "version_lambda_arn" {
  value = aws_lambda_function.version.invoke_arn
}
