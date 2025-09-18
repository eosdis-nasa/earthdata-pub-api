output "action_consumer_lambda_arn" {
  value = aws_lambda_function.action_consumer.invoke_arn
}

output "auth_lambda_arn" {
  value = aws_lambda_function.auth.invoke_arn
}

output "data_lambda_arn" {
  value = aws_lambda_function.data.invoke_arn
}

output "form_lambda_arn" {
  value = aws_lambda_function.form.invoke_arn
}

output "invoke_lambda_arn" {
  value = aws_lambda_function.invoke.invoke_arn
}

output "notification_lambda_arn" {
  value = aws_lambda_function.notification.invoke_arn
}

output "metrics_lambda_arn" {
  value = aws_lambda_function.metrics.invoke_arn
}

output "model_lambda_arn" {
  value = aws_lambda_function.model.invoke_arn
}

output "module_lambda_arn" {
  value = aws_lambda_function.module.invoke_arn
}

output "subscribe_lambda_arn" {
  value = aws_lambda_function.subscribe.invoke_arn
}

output "service_authorizer_lambda_arn" {
  value = aws_lambda_function.service_authorizer.invoke_arn
}

output "submission_lambda_arn" {
  value = aws_lambda_function.submission.invoke_arn
}

output "user_lambda_arn" {
  value = aws_lambda_function.user.invoke_arn
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

output "questions_lambda_arn" {
  value = aws_lambda_function.questions.invoke_arn
}

output "workflow_lambda_arn" {
  value = aws_lambda_function.workflow.invoke_arn
}

output "file_upload_lambda_arn" {
  value = aws_lambda_function.file_upload.invoke_arn
}

output "mfa_auth_lambda_arn" {
  value = aws_lambda_function.mfa_auth.invoke_arn
}

output "oidc_authorizer_lambda_arn" {
  value = aws_lambda_function.oidc_authorizer.invoke_arn
}
