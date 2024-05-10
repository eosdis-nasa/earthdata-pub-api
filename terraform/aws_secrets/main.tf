# SES access credentials
resource "aws_secretsmanager_secret" "ses_access_creds" {
  name = "ses_access_creds"
  description = "SES access credentials"
}

resource "aws_secretsmanager_secret_version" "ses_access_creds" {
  secret_id = aws_secretsmanager_secret.ses_access_creds.id
    secret_string = jsonencode({
        "ses_access_key_id" = var.ses_access_key_id
        "ses_secret_access_key" = var.ses_secret_access_key
    })
}

resource "aws_secretsmanager_secret" "ornl_endpoint" {
  name = "ornl_endpoint"
  description = "ORNL endpoint and credentials"
}

resource "aws_secretsmanager_secret_version" "ornl_endpoint" {
  secret_id = aws_secretsmanager_secret.ornl_endpoint.id
    secret_string = jsonencode({
      "ornl_endpoint_url" = var.ornl_endpoint_url
      "ornl_endpoint_access_token" = var.ornl_endpoint_access_token
    })
}