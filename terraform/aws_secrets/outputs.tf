output "ses_access_creds_arn" {
  value = aws_secretsmanager_secret.ses_access_creds.arn
}

output "ornl_endpoint_arn"{
  value = aws_secretsmanager_secret.ornl_endpoint.arn
}