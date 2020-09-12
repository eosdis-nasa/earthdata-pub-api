module "iam_roles" {
  source = "./iam"

  region = local.region
  account_id = local.account_id
  stage = local.stage
  stage_suffix = local.stage_suffix
  edpub_queue_arn = module.sqs_queues.edpub_queue_arn
  edpub_topic_arn = module.sns_topics.edpub_topic_arn
  edpub_email_topic_arn = module.sns_topics.edpub_email_topic_arn
  edpub_metrics_topic_arn = module.sns_topics.edpub_metrics_topic_arn
  lambda_execution_policy_arn = local.lambda_execution_policy_arn
  permissions_boundary_arn = local.permissions_boundary_arn
}

module "dynamodb_tables" {
  source = "./dynamodb"

  stage = local.stage
  stage_suffix = local.stage_suffix
}

module "lambda_functions" {
  source = "./lambda"

  region = local.region
  account_id = local.account_id
  stage = local.stage
  stage_suffix = local.stage_suffix
  subnet_ids = local.subnet_ids
  security_group_ids = local.security_group_ids
  information_lambda_role_arn = module.iam_roles.information_lambda_role_arn
  notify_lambda_role_arn = module.iam_roles.notify_lambda_role_arn
  subscription_lambda_role_arn = module.iam_roles.subscription_lambda_role_arn
  submission_lambda_role_arn = module.iam_roles.submission_lambda_role_arn
  register_lambda_role_arn = module.iam_roles.register_lambda_role_arn
  dashboard_lambda_role_arn = module.iam_roles.dashboard_lambda_role_arn
  notification_handler_lambda_role_arn = module.iam_roles.notification_handler_lambda_role_arn
  invoke_lambda_role_arn = module.iam_roles.invoke_lambda_role_arn
  action_handler_lambda_role_arn = module.iam_roles.action_handler_lambda_role_arn
  workflow_handler_lambda_role_arn = module.iam_roles.workflow_handler_lambda_role_arn
  metrics_handler_lambda_role_arn = module.iam_roles.metrics_handler_lambda_role_arn
  api_id = module.apigateway_endpoints.api_id
  use_layers = local.use_layers
  edpub_queue_arn = module.sqs_queues.edpub_queue_arn
  edpub_queue_url = module.sqs_queues.edpub_queue_url
  edpub_topic_arn = module.sns_topics.edpub_topic_arn
  edpub_email_topic_arn = module.sns_topics.edpub_email_topic_arn
  edpub_metrics_topic_arn = module.sns_topics.edpub_metrics_topic_arn
  edpub_action_bucket = module.s3_buckets.edpub_action_bucket
}

module "apigateway_endpoints" {
  source = "./apigateway"

  stage = local.stage
  stage_suffix = local.stage_suffix
  information_lambda_arn = module.lambda_functions.information_lambda_arn
  notify_lambda_arn = module.lambda_functions.notify_lambda_arn
  invoke_lambda_arn = module.lambda_functions.invoke_lambda_arn
  subscription_lambda_arn = module.lambda_functions.subscription_lambda_arn
  submission_lambda_arn = module.lambda_functions.submission_lambda_arn
  register_lambda_arn = module.lambda_functions.register_lambda_arn
  dashboard_lambda_arn = module.lambda_functions.dashboard_lambda_arn
}

module "sns_topics" {
  source = "./sns"

  region = local.region
  account_id = local.account_id
  stage = local.stage
  stage_suffix = local.stage_suffix
}

module "sqs_queues" {
  source = "./sqs"

  region = local.region
  account_id = local.account_id
  stage = local.stage
  stage_suffix = local.stage_suffix
}

module "s3_buckets" {
  source = "./s3"

  region = local.region
  account_id = local.account_id
  stage = local.stage
  stage_suffix = local.s3_stage_suffix
}
