output "cognito_login_url" {
  value = "https://${aws_cognito_user_pool.edpub_cognito.name}.auth.${var.region}.amazoncognito.com/login"
}

output "cognito_client_secret" {
  value = aws_cognito_user_pool_client.edpub_cognito.client_secret
}
