terraform {
  backend "s3" {
    bucket = "earthdatapub-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "us-west-2"
  }
}

provider "aws" {
  region  = "us-west-2"
}

data "aws_caller_identity" "current" {}

locals {
  account_id = data.aws_caller_identity.current.account_id
  region = "us-west-2"
  stage = "prod"
  stage_suffix = ""
  s3_stage_suffix = ""
  ngap = true
  vpc_enabled = true
  security_group_ids = ["sg-0029de45595e603f6"]
  subnet_ids = ["subnet-04be208d6a441ee8f", "subnet-0b9d5b5ff8056a58d"]
  lambda_execution_policy_arn = "arn:aws:iam::${local.account_id}:policy/ngap/system/NGAPShLambdaInVpcBasePolicy"
  permissions_boundary_arn = "arn:aws:iam::${local.account_id}:policy/NGAPShRoleBoundary"
  use_layers = true
}
