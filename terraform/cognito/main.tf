resource "aws_cognito_user_pool_client" "edpub_cognito" {
  name = "edpub-${var.stage}"
  user_pool_id = var.cognito_user_pool_id
  generate_secret = true
  read_attributes = ["name", "email"]
  refresh_token_validity = 10
  explicit_auth_flows = [
      "ALLOW_CUSTOM_AUTH",
      "ALLOW_REFRESH_TOKEN_AUTH",
      "ALLOW_USER_PASSWORD_AUTH",
      "ALLOW_USER_SRP_AUTH"
  ]
  supported_identity_providers = ["COGNITO"]
  callback_urls = [ var.client_auth_url ]
  logout_urls = [ var.client_auth_url ]
  allowed_oauth_flows = ["code", "implicit"]
  allowed_oauth_scopes = ["email", "openid", "aws.cognito.signin.user.admin"]
  allowed_oauth_flows_user_pool_client = true
  prevent_user_existence_errors = "ENABLED"
}
