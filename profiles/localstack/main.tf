provider "aws" {
  region = "us-east-1"
  version = "~> 2.70"
  access_key = "xxxxxxxxxx"
  secret_key = "xxxxxxxxxx"
  skip_credentials_validation = true
  skip_requesting_account_id = true
  skip_metadata_api_check = true
  s3_force_path_style = true
  endpoints {
    apigateway     = "http://localhost:4567"
    cloudformation = "http://localhost:4581"
    cloudwatch     = "http://localhost:4582"
    dynamodb       = "http://localhost:4569"
    ec2            = "http://localhost:4597"
    es             = "http://localhost:4578"
    firehose       = "http://localhost:4573"
    iam            = "http://localhost:4593"
    kinesis        = "http://localhost:4568"
    lambda         = "http://localhost:4574"
    route53        = "http://localhost:4580"
    redshift       = "http://localhost:4577"
    s3             = "http://localhost:4572"
    secretsmanager = "http://localhost:4584"
    ses            = "http://localhost:4579"
    sns            = "http://localhost:4575"
    sqs            = "http://localhost:4576"
    ssm            = "http://localhost:4583"
    stepfunctions  = "http://localhost:4585"
    sts            = "http://localhost:4592"
  }
}

locals {
  account_id = "000000000000"
  region = "us-east-1"
  stage = "prod"
  stage_suffix = ""
  s3_stage_suffix = ""
  ngap = false
  vpc_enabled = false
  api_gateway_policy = "api_gateway_basic_policy.json"
  security_group_ids = []
  subnet_ids = []
  lambda_execution_policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  permissions_boundary_arn = ""
  use_layers = false
}
