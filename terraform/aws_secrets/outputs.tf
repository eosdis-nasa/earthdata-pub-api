output "ses_access_creds_arn" {
  value = aws_secretsmanager_secret.ses_access_creds.arn
}

output "ornl_endpoint_arn"{
  value = aws_secretsmanager_secret.ornl_endpoint.arn
}

output "gesdisc_endpoint_arn"{
  value = aws_secretsmanager_secret.gesdisc_endpoint.arn
}

output "ornl_service_authorization_arn" {
  value = aws_secretsmanager_secret.ornl_service_authorization.arn
}