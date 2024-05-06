variable "stage" {
  type = string
}

variable "region" {
  type = string
}

variable "account_id" {
  type = string
}

variable "edpub_outbound_sns_arn" {
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

variable "edpub_inbound_sqs_arn" {
  type = string
}

variable "edpub_action_sqs_arn" {
  type = string
}

variable "edpub_metrics_sqs_arn" {
  type = string
}

variable "edpub_notification_sqs_arn" {
  type = string
}

variable "edpub_workflow_sqs_arn" {
  type = string
}

variable "lambda_execution_policy_arn" {
  type = string
}

variable "permissions_boundary_arn" {
  type = string
}

variable "ses_access_creds_arn" {
  type = string
}

variable "ornl_endpoint_arn" {
  type = string
}
