variable "stage" {
  type = string
}

variable "region" {
  type = string
}

variable "account_id" {
  type = string
}

variable "edpub_lambda_role_arn" {
  type = string
}

variable "edpub_rds_backup_lambda_role_arn" {
  type = string
}

variable "api_id" {
  type = string
}

variable "edpub_action_sqs_arn" {
  type = string
}

variable "edpub_action_sqs_url" {
  type = string
}

variable "edpub_inbound_sqs_arn" {
  type = string
}

variable "edpub_inbound_sqs_url" {
  type = string
}

variable "edpub_metrics_sqs_arn" {
  type = string
}

variable "edpub_metrics_sqs_url" {
  type = string
}

variable "edpub_notification_sqs_arn" {
  type = string
}

variable "edpub_notification_sqs_url" {
  type = string
}

variable "edpub_workflow_sqs_arn" {
  type = string
}

variable "edpub_workflow_sqs_url" {
  type = string
}

variable "edpub_event_sns_arn" {
  type = string
}

variable "edpub_email_sns_arn" {
  type = string
}

variable "edpub_metrics_sns_arn" {
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

variable "db_user" {
  type = string
}

variable "db_host" {
  type = string
}

variable "db_database" {
  type = string
}

variable "db_password" {
  type = string
}

variable "db_port" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

variable "security_group_ids" {
  type = list(string)
}

variable "api_version" {
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

variable "auth_token_path" {
  type = string
}

variable "auth_user_path" {
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

variable "ses_from_email" {
  type = string
}

variable "ses_access_creds_arn" {
  type = string
}