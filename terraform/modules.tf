module "iam_roles" {
  source = "./iam"

  region = var.region
  account_id = var.account_id
  stage = var.stage
  edpub_inbound_sqs_arn = module.sqs_queues.edpub_inbound_sqs_arn
  edpub_action_sqs_arn = module.sqs_queues.edpub_action_sqs_arn
  edpub_metrics_sqs_arn = module.sqs_queues.edpub_metrics_sqs_arn
  edpub_notification_sqs_arn = module.sqs_queues.edpub_notification_sqs_arn
  edpub_workflow_sqs_arn = module.sqs_queues.edpub_workflow_sqs_arn
  edpub_outbound_sns_arn = module.sns_topics.edpub_outbound_sns_arn
  edpub_event_sns_arn = module.sns_topics.edpub_event_sns_arn
  edpub_email_sns_arn = module.sns_topics.edpub_email_sns_arn
  edpub_metrics_sns_arn = module.sns_topics.edpub_metrics_sns_arn
  lambda_execution_policy_arn = var.lambda_execution_policy_arn
  permissions_boundary_arn = var.permissions_boundary_arn
}

module "cognito" {
  source = "./cognito"

  region = var.region
  stage = var.stage
  cognito_user_pool_id = var.cognito_user_pool_id
  client_auth_url = var.client_auth_url
}

module "lambda_functions" {
  source = "./lambda"

  region = var.region
  account_id = var.account_id
  stage = var.stage
  api_version = var.api_version
  subnet_ids = var.subnet_ids
  security_group_ids = var.security_group_ids
  edpub_lambda_role_arn = module.iam_roles.edpub_lambda_role_arn
  api_id = module.apigateway_endpoints.api_id
  edpub_action_sqs_arn = module.sqs_queues.edpub_action_sqs_arn
  edpub_action_sqs_url = module.sqs_queues.edpub_action_sqs_url
  edpub_metrics_sqs_arn = module.sqs_queues.edpub_metrics_sqs_arn
  edpub_metrics_sqs_url = module.sqs_queues.edpub_metrics_sqs_url
  edpub_notification_sqs_arn = module.sqs_queues.edpub_notification_sqs_arn
  edpub_notification_sqs_url = module.sqs_queues.edpub_notification_sqs_url
  edpub_workflow_sqs_arn = module.sqs_queues.edpub_workflow_sqs_arn
  edpub_workflow_sqs_url = module.sqs_queues.edpub_workflow_sqs_url
  edpub_event_sns_arn = module.sns_topics.edpub_event_sns_arn
  edpub_email_sns_arn = module.sns_topics.edpub_email_sns_arn
  edpub_metrics_sns_arn = module.sns_topics.edpub_metrics_sns_arn
  edpub_metrics_s3_bucket = var.edpub_metrics_s3_bucket
  edpub_dashboard_s3_bucket = var.edpub_dashboard_s3_bucket
  edpub_forms_s3_bucket = var.edpub_forms_s3_bucket
  edpub_overview_s3_bucket = var.edpub_overview_s3_bucket
  db_host = module.rds.db_host
  db_port = module.rds.db_port
  db_database = module.rds.db_database
  db_user = module.rds.db_user
  db_password = var.db_password
  cognito_url = var.cognito_domain_url
  cognito_logout_path = module.cognito.cognito_logout_path
  cognito_login_path = module.cognito.cognito_login_path
  cognito_token_path = module.cognito.cognito_token_path
  cognito_user_path = module.cognito.cognito_user_path
  cognito_client_id = module.cognito.cognito_client_id
  cognito_client_secret = module.cognito.cognito_client_secret
  cognito_client_auth_url = var.client_auth_url
}

module "apigateway_endpoints" {
  source = "./apigateway"

  stage = var.stage
  auth_lambda_arn = module.lambda_functions.auth_lambda_arn
  data_lambda_arn = module.lambda_functions.data_lambda_arn
  notification_lambda_arn = module.lambda_functions.notification_lambda_arn
  metrics_lambda_arn = module.lambda_functions.metrics_lambda_arn
  model_lambda_arn = module.lambda_functions.model_lambda_arn
  invoke_lambda_arn = module.lambda_functions.invoke_lambda_arn
  subscribe_lambda_arn = module.lambda_functions.subscribe_lambda_arn
  submission_lambda_arn = module.lambda_functions.submission_lambda_arn
  register_lambda_arn = module.lambda_functions.register_lambda_arn
  version_lambda_arn = module.lambda_functions.version_lambda_arn
  cognito_user_pool_arn = "arn:aws:cognito-idp:${var.region}:${var.account_id}:userpool/${var.cognito_user_pool_id}"
  edpub_apigateway_s3_role_arn = module.iam_roles.edpub_apigateway_s3_role_arn
  edpub_dashboard_s3_bucket = var.edpub_dashboard_s3_bucket
  edpub_forms_s3_bucket = var.edpub_forms_s3_bucket
  edpub_overview_s3_bucket = var.edpub_overview_s3_bucket
  edpub_metrics_s3_bucket = var.edpub_metrics_s3_bucket
  vpc_endpoint_id = var.vpc_endpoint_id
}

module "rds" {
  source = "./rds"

  rds_cluster_identifier = var.rds_cluster_identifier
}

module "sns_topics" {
  source = "./sns"

  region = var.region
  account_id = var.account_id
  stage = var.stage
}

module "sqs_queues" {
  source = "./sqs"

  region = var.region
  account_id = var.account_id
  stage = var.stage
  edpub_event_sns_arn = module.sns_topics.edpub_event_sns_arn
}
