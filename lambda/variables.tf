variable "dynamodb_lambda_role_arn" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
  default = ["subnet-04be208d6a441ee8f", "subnet-0b9d5b5ff8056a58d"]
}

variable "security_group_ids" {
  type = list(string)
  default = ["sg-0029de45595e603f6"]
}
