variable "stage" {
  type = string
}

variable "region" {
  type = string
}

variable "account_id" {
  type = string
}

variable "edpub_action_sqs_arn" {
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

variable "edpub_action_s3_arn" {
  type = string
}

variable "lambda_execution_policy_arn" {
  type = string
}

variable "permissions_boundary_arn" {
  type = string
}
