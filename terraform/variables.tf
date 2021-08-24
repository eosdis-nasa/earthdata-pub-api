variable "account_id" {
  type = string
}
variable "access_key" {
  type = string
}
variable "secret_key" {
  type = string
}
variable "region" {
  type = string
}
variable "stage" {
  type = string
}
variable "vpc_id" {
  type = string
}
variable "vpc_endpoint_id" {
  type = string
}
variable "security_group_ids" {
  type = list(string)
}
variable "subnet_ids" {
  type = list(string)
}
variable "lambda_execution_policy_arn" {
  type = string
}
variable "permissions_boundary_arn" {
  type = string
}
variable "edpub_dashboard_s3_bucket" {
  type = string
}
variable "edpub_forms_s3_bucket" {
  type = string
}
variable "edpub_overview_s3_bucket" {
  type = string
}
variable "edpub_metrics_s3_bucket" {
  type = string
}
variable "rds_cluster_identifier" {
  type = string
}
variable "db_password" {
  type = string
}
variable "api_version" {
  type = string
}
variable "api_root_url" {
  type = string
}
variable "cognito_user_pool_id" {
  type = string
}
variable "client_root_url" {
  type = string
}
variable "auth_provider_url" {
  type = string
}
variable "auth_logout_path" {
  type = string
}
variable "auth_login_path" {
  type = string
}
variable "auth_user_path" {
  type = string
}
variable "auth_token_path" {
  type = string
}
variable "auth_client_id" {
  type = string
}
variable "auth_client_secret" {
  type = string
}
variable "auth_client_path" {
  type = string
}
