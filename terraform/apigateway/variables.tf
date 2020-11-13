variable "stage" {
  type = string
}

variable "data_lambda_arn" {
  type = string
}

variable "invoke_lambda_arn" {
  type = string
}

variable "notify_lambda_arn" {
  type = string
}

variable "metrics_lambda_arn" {
  type = string
}

variable "model_lambda_arn" {
  type = string
}

variable "register_lambda_arn" {
  type = string
}

variable "submission_lambda_arn" {
  type = string
}

variable "subscribe_lambda_arn" {
  type = string
}

variable "cognito_user_pool_arn" {
  type = string
}

variable "cognito_login_url" {
  type = string
}

variable "vpc_endpoint_id" {
  type = string
}
