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