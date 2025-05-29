variable "stage" {
  type = string
}

variable "auth_lambda_arn" {
  type = string
}

variable "data_lambda_arn" {
  type = string
}

variable "form_lambda_arn" {
  type = string
}

variable "questions_lambda_arn"{
  type = string
}

variable "invoke_lambda_arn" {
  type = string
}

variable "notification_lambda_arn" {
  type = string
}

variable "metrics_lambda_arn" {
  type = string
}

variable "module_lambda_arn" {
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

variable "user_lambda_arn" {
  type = string
}

variable "version_lambda_arn" {
  type = string
}

variable "workflow_lambda_arn" {
  type = string
}

variable "file_upload_lambda_arn" {
  type = string
}

variable "edpub_dashboard_s3_bucket" {
  type = string
}

variable "edpub_metrics_s3_bucket" {
  type = string
}

variable "edpub_apigateway_s3_role_arn" {
  type = string
}

variable "cognito_user_pool_arn" {
  type = string
}

variable "vpc_endpoint_id" {
  type = string
}

variable "region" {
  type = string
}

variable "service_authorizer_lambda_arn" {
  type = string
}

variable "mfa_auth_lambda_arn" {
  type = string
}
