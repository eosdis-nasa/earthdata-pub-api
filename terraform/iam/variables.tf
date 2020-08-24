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

variable "edpub_queue_arn" {
  type = string
}

variable "edpub_topic_arn" {
  type = string
}

variable "edpub_email_topic_arn" {
  type = string
}

variable "lambda_execution_policy_arn" {
  type = string
}

variable "permissions_boundary_arn" {
  type = string
}
