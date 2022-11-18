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

module "lambda_functions" {
  source = "./lambda"

  region = var.region
  account_id = var.account_id
  stage = var.stage
  api_version = var.api_version
  subnet_ids = var.subnet_ids
  security_group_ids = var.security_group_ids
  edpub_lambda_role_arn = module.iam_roles.edpub_lambda_role_arn
  edpub_rds_backup_lambda_role_arn = module.iam_roles.edpub_rds_backup_lambda_role_arn
  api_id = module.apigateway_endpoints.api_id
  edpub_action_sqs_arn = module.sqs_queues.edpub_action_sqs_arn
  edpub_action_sqs_url = module.sqs_queues.edpub_action_sqs_url
  edpub_inbound_sqs_arn = module.sqs_queues.edpub_inbound_sqs_arn
  edpub_inbound_sqs_url = module.sqs_queues.edpub_inbound_sqs_url
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
  edpub_actions_s3_bucket = var.edpub_actions_s3_bucket
  db_host = module.rds.db_host
  db_port = module.rds.db_port
  db_database = module.rds.db_database
  db_user = module.rds.db_user
  db_password = var.db_password
  cognito_user_pool_id = var.cognito_user_pool_id
  client_root_url = var.client_root_url
  auth_provider_url = var.auth_provider_url
  auth_logout_path = var.auth_logout_path
  auth_login_path = var.auth_login_path
  auth_token_path = var.auth_token_path
  auth_user_path = var.auth_user_path
  auth_client_id = var.auth_client_id
  auth_client_secret = var.auth_client_secret
  auth_client_path = var.auth_client_path
  meditor_service_username = var.meditor_service_username
  meditor_service_password = var.meditor_service_password
}

module "apigateway_endpoints" {
  source = "./apigateway"

  stage = var.stage
  auth_lambda_arn = module.lambda_functions.auth_lambda_arn
  data_lambda_arn = module.lambda_functions.data_lambda_arn
  notification_lambda_arn = module.lambda_functions.notification_lambda_arn
  metrics_lambda_arn = module.lambda_functions.metrics_lambda_arn
  model_lambda_arn = module.lambda_functions.model_lambda_arn
  module_lambda_arn = module.lambda_functions.module_lambda_arn
  invoke_lambda_arn = module.lambda_functions.invoke_lambda_arn
  subscribe_lambda_arn = module.lambda_functions.subscribe_lambda_arn
  submission_lambda_arn = module.lambda_functions.submission_lambda_arn
  user_lambda_arn = module.lambda_functions.user_lambda_arn
  register_lambda_arn = module.lambda_functions.register_lambda_arn
  version_lambda_arn = module.lambda_functions.version_lambda_arn
  questions_lambda_arn = module.lambda_functions.questions_lambda_arn
  workflow_lambda_arn = module.lambda_functions.workflow_lambda_arn
  cognito_user_pool_arn = "arn:aws:cognito-idp:${var.region}:${var.account_id}:userpool/${var.cognito_user_pool_id}"
  edpub_apigateway_s3_role_arn = module.iam_roles.edpub_apigateway_s3_role_arn
  edpub_dashboard_s3_bucket = var.edpub_dashboard_s3_bucket
  edpub_forms_s3_bucket = var.edpub_forms_s3_bucket
  edpub_overview_s3_bucket = var.edpub_overview_s3_bucket
  edpub_metrics_s3_bucket = var.edpub_metrics_s3_bucket
  vpc_endpoint_id = var.vpc_endpoint_id
  region = var.region
  service_authorizer_lambda_arn = module.lambda_functions.service_authorizer_lambda_arn
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
