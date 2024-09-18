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
variable "edpub_actions_s3_bucket" {
  type = string
}
variable "edpub_upload_s3_bucket" {
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

variable "meditor_service_username" {
  type = string
}

variable "meditor_service_password" {
  type = string
}

variable "environment" {
  type = string
}

variable "ses_from_email"{
  type = string
}

variable "ses_access_key_id" {
  type = string
}

variable "ses_secret_access_key" {
  type = string
}

variable "ornl_endpoint_url" {
  type = string
}

variable "ornl_endpoint_access_token" {
  type = string
}

variable "gesdisc_endpoint_url"{
  type = string
}

variable "gesdisc_endpoint_access_token"{
  type = string
}

variable "ornl_service_authorization_secret" {
  type = string
}