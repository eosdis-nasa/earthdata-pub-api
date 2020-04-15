data "aws_caller_identity" "current" {}

variable "profile" {
  type = string
  default = "default"
}

variable "region" {
  type = string
  default = "us-west-2"
}

variable "stage" {
  type = string
  default = "dev"
}

variable "api_gateway_policy" {
  type = string
  default = "api_gateway_basic_policy.json"
}

variable "ngap" {
  type = bool
  default = false
}

variable "ngap_lambda_policy" {
  type = string
}

variable "ngap_role_boundary" {
  type = string
}

variable "vpc_enabled" {
  type = bool
  default = false
}

variable "subnet_ids" {
  type = list(string)
  default = []
}

variable "security_group_ids" {
  type = list(string)
  default = []
}

locals {
  account_id = data.aws_caller_identity.current.account_id
  lambda_execution_policy_arn = var.ngap ? "arn:aws:iam::${local.account_id}:policy/${var.ngap_lambda_policy}" : "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  permissions_boundary_arn = var.ngap ? "arn:aws:iam::${local.account_id}:policy/${var.ngap_role_boundary}" : ""
}
