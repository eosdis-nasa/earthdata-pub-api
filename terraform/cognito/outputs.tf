output "cognito_client_id" {
  value = aws_cognito_user_pool_client.edpub_cognito.id
}

output "cognito_client_secret" {
  value = aws_cognito_user_pool_client.edpub_cognito.client_secret
}

output "cognito_logout_path" {
  value = "logout"
}

output "cognito_login_path" {
  value = "login"
}

output "cognito_token_path" {
  value = "oauth2/token"
}

output "cognito_user_path" {
  value = "userinfo"
}
