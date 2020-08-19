variable "stage" {
  type = string
}

variable "stage_suffix" {
  type = string
}

variable "region" {
  type = string
}

variable "account_id" {
  type = string
}

variable "information_lambda_role_arn" {
  type = string
}

variable "notify_lambda_role_arn" {
  type = string
}

variable "subscription_lambda_role_arn" {
  type = string
}

variable "submission_lambda_role_arn" {
  type = string
}

variable "invoke_lambda_role_arn" {
  type = string
}

variable "register_lambda_role_arn" {
  type = string
}

variable "dashboard_lambda_role_arn" {
  type = string
}

variable "action_handler_lambda_role_arn" {
  type = string
}

variable "notification_handler_lambda_role_arn" {
  type = string
}

variable "workflow_handler_lambda_role_arn" {
  type = string
}

variable "use_layers" {
  type = string
}

variable "api_id" {
  type = string
}

variable "edpub_queue_arn" {
  type = string
}

variable "edpub_queue_url" {
  type = string
}

variable "edpub_topic_arn" {
  type = string
}

variable "edpub_email_topic_arn" {
  type = string
}

variable "edpub_action_bucket" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

variable "security_group_ids" {
  type = list(string)
}
