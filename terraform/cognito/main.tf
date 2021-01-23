resource "aws_cognito_user_pool" "edpub_cognito" {
  name = "edpub_user_pool"
  password_policy {
    minimum_length = 8
    require_lowercase = true
    require_uppercase = true
    require_numbers = true
    require_symbols = true
    temporary_password_validity_days = 7
  }
  schema {
    name = "sub"
    attribute_data_type = "String"
    developer_only_attribute = false
    mutable = false
    required = true
    string_attribute_constraints {
      min_length = 36
      max_length = 36
    }
  }
  schema {
    name = "name"
    attribute_data_type = "String"
    developer_only_attribute = false
    mutable = false
    required = true
    string_attribute_constraints {
      min_length = 1
      max_length = 128
    }
  }
  schema {
    name = "email"
    attribute_data_type = "String"
    developer_only_attribute = false
    mutable = false
    required = true
    string_attribute_constraints {
      min_length = 1
      max_length = 128
    }
  }
  auto_verified_attributes = ["email"]
}

resource "aws_cognito_user_pool_domain" "edpub_cognito" {
  domain = "edpub-${var.stage}"
  user_pool_id = aws_cognito_user_pool.edpub_cognito.id
}

resource "aws_cognito_user_pool_client" "edpub_cognito" {
  name = "edpub-${var.stage}"
  user_pool_id = aws_cognito_user_pool.edpub_cognito.id
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
  allowed_oauth_scopes = ["email", "openid"]
  allowed_oauth_flows_user_pool_client = true
  prevent_user_existence_errors = "ENABLED"
}
