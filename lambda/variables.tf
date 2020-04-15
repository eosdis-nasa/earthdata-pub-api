variable "stage" {
  type = string
}

variable "dynamodb_lambda_role_arn" {
  type = string
}

variable "api_id" {
  type = string
}

variable "region" {
  type = string
}

variable "account_id" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

variable "security_group_ids" {
  type = list(string)
}
