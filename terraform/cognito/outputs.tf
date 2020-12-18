output "cognito_client_id" {
  value = aws_cognito_user_pool_client.edpub_cognito.id
}

output "cognito_client_secret" {
  value = aws_cognito_user_pool_client.edpub_cognito.client_secret
}

output "cognito_user_pool_arn" {
  value = aws_cognito_user_pool.edpub_cognito.arn
}

output "cognito_url" {
  value = "https://${aws_cognito_user_pool_domain.edpub_cognito.domain}.auth.${var.region}.amazoncognito.com"
}

output "cognito_login_path" {
  value = "login"
}

output "cognito_token_path" {
  value = "oauth2/token"
}

output "cognito_authorize_path" {
  value = "oauth2/authorize"
}

output "cognito_user_path" {
  value = "userinfo"
}
