# SES access credentials
resource "aws_secretsmanager_secret" "ses_access_creds" {
  name = "ses_access_creds"
  description = "SES access credentials"
}

resource "aws_secretsmanager_secret_version" "ses_access_creds" {
  secret_id = aws_secretsmanager_secret.ses_access_creds.id
    secret_string = jsonencode({
        "ses_secret_sender_arn" = var.ses_secret_sender_arn
        "ses_configuration_set_name" = var.ses_configuration_set_name
    })
}

#ORNL enpoint access
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

#GESDISC endpoint access
resource "aws_secretsmanager_secret" "gesdisc_endpoint"{
  name = "gesdisc_endpoint"
  description = "GESDISC endpoint and credentials"
}

resource "aws_secretsmanager_secret_version" "gesdisc_endpoint"{
  secret_id = aws_secretsmanager_secret.gesdisc_endpoint.id
    secret_string = jsonencode({
      "gesdisc_endpoint_url" = var.gesdisc_endpoint_url
      "gesdisc_endpoint_access_token" = var.gesdisc_endpoint_access_token
    })
}

# ORNL Service Authorization
resource "aws_secretsmanager_secret" "ornl_service_authorization" {
  name = "ornl_service_authorization_secret"
  description = "Service authorization secret used for sending ORNL service submission codes"
}

resource "aws_secretsmanager_secret_version" "ornl_service_authorization_version" {
  secret_id = aws_secretsmanager_secret.ornl_service_authorization.id
  secret_string = var.ornl_service_authorization
}
