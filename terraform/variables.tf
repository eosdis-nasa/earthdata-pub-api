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
variable "api_root_url" {
  type = string
}
variable "auth_logout_path" {
  type = string
}
variable "auth_callback_path" {
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
variable "rds_cluster_identifier" {
  type = string
}
variable "db_password" {
  type = string
}
variable "api_version" {
  type = string
}
