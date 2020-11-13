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

variable "api_id" {
  type = string
}

variable "edpub_action_sqs_arn" {
  type = string
}

variable "edpub_action_sqs_url" {
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

variable "edpub_action_s3_id" {
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
