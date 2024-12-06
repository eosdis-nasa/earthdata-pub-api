# Auth Util Layer

resource "aws_lambda_layer_version" "auth_util" {
  filename            = "../artifacts/auth-util-layer.zip"
  layer_name          = "authUtilLayer"
  compatible_runtimes = ["nodejs18.x"]
  source_code_hash    = filesha256("../artifacts/auth-util-layer.zip")
}

# Database Util Layer

resource "aws_lambda_layer_version" "database_util" {
  filename            = "../artifacts/database-util-layer.zip"
  layer_name          = "databaseUtilLayer"
  compatible_runtimes = ["nodejs18.x"]
  source_code_hash    = filesha256("../artifacts/database-util-layer.zip")
}

# Message Util Layer

resource "aws_lambda_layer_version" "message_util" {
  filename            = "../artifacts/message-util-layer.zip"
  layer_name          = "messageUtilLayer"
  compatible_runtimes = ["nodejs18.x"]
  source_code_hash    = filesha256("../artifacts/message-util-layer.zip")
}

# Schema Layer

resource "aws_lambda_layer_version" "schema_util" {
  filename            = "../artifacts/schema-util-layer.zip"
  layer_name          = "schemaUtilLayer"
  compatible_runtimes = ["nodejs18.x"]
  source_code_hash    = filesha256("../artifacts/schema-util-layer.zip")
}

# Action Consumer Lambda

resource "aws_lambda_function" "action_consumer" {
  filename      = "../artifacts/action-consumer-lambda.zip"
  function_name = "action_consumer"
  role          = var.edpub_lambda_role_arn
  handler       = "action-consumer.handler"
  layers = [
    aws_lambda_layer_version.database_util.arn,
    aws_lambda_layer_version.message_util.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
  runtime          = "nodejs18.x"
  source_code_hash = filesha256("../artifacts/action-consumer-lambda.zip")
  timeout          = 180
  environment {
    variables = {
      REGION         = var.region
      EVENT_SNS      = var.edpub_event_sns_arn
      EMAIL_SNS      = var.edpub_email_sns_arn
      METRICS_SNS    = var.edpub_metrics_sns_arn
      PG_USER        = var.db_user
      PG_HOST        = var.db_host
      PG_DB          = var.db_database
      PG_PASS        = var.db_password
      PG_PORT        = var.db_port
      ACTIONS_BUCKET = var.edpub_actions_s3_bucket
      MEDITOR_USER   = var.meditor_service_username
      MEDITOR_PASS   = var.meditor_service_password
      ROOT_URL       = var.client_root_url
      SOURCE_EMAIL   = var.ses_from_email
    }
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "action_consumer" {
  statement_id  = "AllowExecutionFromSQS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.action_consumer.function_name
  principal     = "sqs.amazonaws.com"
  source_arn    = var.edpub_action_sqs_arn
}

resource "aws_lambda_event_source_mapping" "action_consumer_sqs_event" {
  event_source_arn = var.edpub_action_sqs_arn
  function_name    = aws_lambda_function.action_consumer.function_name
}

# Data Lambda

resource "aws_lambda_function" "data" {
  filename      = "../artifacts/data-lambda.zip"
  function_name = "data"
  role          = var.edpub_lambda_role_arn
  handler       = "data.handler"
  layers = [
    aws_lambda_layer_version.database_util.arn,
    aws_lambda_layer_version.message_util.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
  runtime          = "nodejs18.x"
  source_code_hash = filesha256("../artifacts/data-lambda.zip")
  timeout          = 180
  environment {
    variables = {
      REGION          = var.region
      EVENT_SNS       = var.edpub_event_sns_arn
      METRICS_SNS     = var.edpub_metrics_sns_arn
      PG_USER         = var.db_user
      PG_HOST         = var.db_host
      PG_DB           = var.db_database
      PG_PASS         = var.db_password
      PG_PORT         = var.db_port
      SOURCE_EMAIL    = var.ses_from_email
    }
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "data" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.data.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/*/*"
}

# Form Lambda

resource "aws_lambda_function" "form" {
  filename      = "../artifacts/form-lambda.zip"
  function_name = "form"
  role          = var.edpub_lambda_role_arn
  handler       = "form.handler"
  layers = [
    aws_lambda_layer_version.database_util.arn,
    aws_lambda_layer_version.message_util.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
  runtime          = "nodejs18.x"
  source_code_hash = filesha256("../artifacts/form-lambda.zip")
  timeout          = 180
  environment {
    variables = {
      REGION          = var.region
      EVENT_SNS       = var.edpub_event_sns_arn
      METRICS_SNS     = var.edpub_metrics_sns_arn
      PG_USER         = var.db_user
      PG_HOST         = var.db_host
      PG_DB           = var.db_database
      PG_PASS         = var.db_password
      PG_PORT         = var.db_port
    }
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "form" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.form.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/*/*"
}

# Inbound Consumer Lambda

resource "aws_lambda_function" "inbound_consumer" {
  filename      = "../artifacts/inbound-consumer-lambda.zip"
  function_name = "inbound_consumer"
  role          = var.edpub_lambda_role_arn
  handler       = "inbound-consumer.handler"
  layers = [
    aws_lambda_layer_version.database_util.arn,
    aws_lambda_layer_version.message_util.arn
  ]
  runtime          = "nodejs18.x"
  source_code_hash = filesha256("../artifacts/inbound-consumer-lambda.zip")
  timeout          = 180
  environment {
    variables = {
      REGION        = var.region
      EVENT_SNS     = var.edpub_event_sns_arn
      PG_USER       = var.db_user
      PG_HOST       = var.db_host
      PG_DB         = var.db_database
      PG_PASS       = var.db_password
      PG_PORT       = var.db_port
      SOURCE_EMAIL  = var.ses_from_email
    }
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "inbound_consumer" {
  statement_id  = "AllowExecutionFromSQS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.inbound_consumer.function_name
  principal     = "sqs.amazonaws.com"
  source_arn    = var.edpub_inbound_sqs_arn
}

resource "aws_lambda_event_source_mapping" "inbound_consumer_sqs_event" {
  event_source_arn = var.edpub_inbound_sqs_arn
  function_name    = aws_lambda_function.inbound_consumer.function_name
}

# Invoke Lambda

resource "aws_lambda_function" "invoke" {
  filename      = "../artifacts/invoke-lambda.zip"
  function_name = "invoke"
  role          = var.edpub_lambda_role_arn
  handler       = "invoke.handler"
  layers = [
    aws_lambda_layer_version.database_util.arn,
    aws_lambda_layer_version.message_util.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
  runtime          = "nodejs18.x"
  source_code_hash = filesha256("../artifacts/invoke-lambda.zip")
  timeout          = 180
  environment {
    variables = {
      REGION         = var.region
      EVENT_SNS      = var.edpub_event_sns_arn
      METRICS_SNS    = var.edpub_metrics_sns_arn
      PG_USER        = var.db_user
      PG_HOST        = var.db_host
      PG_DB          = var.db_database
      PG_PASS        = var.db_password
      PG_PORT        = var.db_port
      SOURCE_EMAIL   = var.ses_from_email
    }
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "invoke" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.invoke.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/POST/action/invoke"
}

# Metrics Lambda

resource "aws_lambda_function" "metrics" {
  filename      = "../artifacts/metrics-lambda.zip"
  function_name = "metrics"
  role          = var.edpub_lambda_role_arn
  handler       = "metrics.handler"
  layers = [
    aws_lambda_layer_version.database_util.arn,
    aws_lambda_layer_version.message_util.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
  runtime          = "nodejs18.x"
  source_code_hash = filesha256("../artifacts/metrics-lambda.zip")
  timeout          = 180
  environment {
    variables = {
      REGION         = var.region
      EVENT_SNS      = var.edpub_event_sns_arn
      METRICS_SNS    = var.edpub_metrics_sns_arn
      METRICS_S3     = var.edpub_metrics_s3_bucket
      PG_USER        = var.db_user
      PG_HOST        = var.db_host
      PG_DB          = var.db_database
      PG_PASS        = var.db_password
      PG_PORT        = var.db_port
      SOURCE_EMAIL   = var.ses_from_email
    }
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "metrics" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.metrics.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/*/*"
}

# Metrics Consumer Lambda

resource "aws_lambda_function" "metrics_consumer" {
  filename      = "../artifacts/metrics-consumer-lambda.zip"
  function_name = "metrics_consumer"
  role          = var.edpub_lambda_role_arn
  handler       = "metrics-consumer.handler"
  layers = [
    aws_lambda_layer_version.database_util.arn,
    aws_lambda_layer_version.message_util.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
  runtime          = "nodejs18.x"
  source_code_hash = filesha256("../artifacts/metrics-consumer-lambda.zip")
  timeout          = 180
  environment {
    variables = {
      REGION         = var.region
      EVENT_SNS      = var.edpub_event_sns_arn
      METRICS_SNS    = var.edpub_metrics_sns_arn
      PG_USER        = var.db_user
      PG_HOST        = var.db_host
      PG_DB          = var.db_database
      PG_PASS        = var.db_password
      PG_PORT        = var.db_port
      SOURCE_EMAIL   = var.ses_from_email
    }
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "metrics_consumer" {
  statement_id  = "AllowExecutionFromSQS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.metrics_consumer.function_name
  principal     = "sqs.amazonaws.com"
  source_arn    = var.edpub_metrics_sqs_arn
}

resource "aws_lambda_event_source_mapping" "metrics_consumer_sqs_event" {
  event_source_arn = var.edpub_metrics_sqs_arn
  function_name    = aws_lambda_function.metrics_consumer.function_name
}

# Model Lambda

resource "aws_lambda_function" "model" {
  filename      = "../artifacts/model-lambda.zip"
  function_name = "model"
  role          = var.edpub_lambda_role_arn
  handler       = "model.handler"
  layers = [
    aws_lambda_layer_version.database_util.arn,
    aws_lambda_layer_version.message_util.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
  runtime          = "nodejs18.x"
  source_code_hash = filesha256("../artifacts/model-lambda.zip")
  timeout          = 180
  environment {
    variables = {
      REGION         = var.region
      EVENT_SNS      = var.edpub_event_sns_arn
      PG_USER        = var.db_user
      PG_HOST        = var.db_host
      PG_DB          = var.db_database
      PG_PASS        = var.db_password
      PG_PORT        = var.db_port
      SOURCE_EMAIL   = var.ses_from_email
    }
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "model" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.model.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/GET/*"
}

# Module Lambda

resource "aws_lambda_function" "module" {
  filename      = "../artifacts/module-lambda.zip"
  function_name = "module"
  role          = var.edpub_lambda_role_arn
  handler       = "module.handler"
  layers = [
    aws_lambda_layer_version.database_util.arn
  ]
  runtime          = "nodejs18.x"
  source_code_hash = filesha256("../artifacts/module-lambda.zip")
  timeout          = 180
  environment {
    variables = {
      REGION  = var.region
      PG_USER = var.db_user
      PG_HOST = var.db_host
      PG_DB   = var.db_database
      PG_PASS = var.db_password
      PG_PORT = var.db_port
    }
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "module" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.module.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/*/*"
}

# Notify Lambda

resource "aws_lambda_function" "notification" {
  filename      = "../artifacts/notification-lambda.zip"
  function_name = "notification"
  role          = var.edpub_lambda_role_arn
  handler       = "notification.handler"
  layers = [
    aws_lambda_layer_version.database_util.arn,
    aws_lambda_layer_version.message_util.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
  runtime          = "nodejs18.x"
  source_code_hash = filesha256("../artifacts/notification-lambda.zip")
  timeout          = 180
  environment {
    variables = {
      REGION         = var.region
      EVENT_SNS      = var.edpub_event_sns_arn
      PG_USER        = var.db_user
      PG_HOST        = var.db_host
      PG_DB          = var.db_database
      PG_PASS        = var.db_password
      PG_PORT        = var.db_port
      SOURCE_EMAIL   = var.ses_from_email
    }
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "notification" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.notification.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/*/notification/*"
}

# Notification Consumer Lambda

resource "aws_lambda_function" "notification_consumer" {
  filename      = "../artifacts/notification-consumer-lambda.zip"
  function_name = "notification_consumer"
  role          = var.edpub_lambda_role_arn
  handler       = "notification-consumer.handler"
  layers = [
    aws_lambda_layer_version.database_util.arn,
    aws_lambda_layer_version.message_util.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
  runtime          = "nodejs18.x"
  source_code_hash = filesha256("../artifacts/notification-consumer-lambda.zip")
  timeout          = 180
  environment {
    variables = {
      REGION                = var.region
      INGEST_BUCKET         = var.edpub_upload_s3_bucket
      EMAIL_SNS             = var.edpub_email_sns_arn
      EVENT_SNS             = var.edpub_event_sns_arn
      METRICS_SNS           = var.edpub_metrics_sns_arn
      PG_USER               = var.db_user
      PG_HOST               = var.db_host
      PG_DB                 = var.db_database
      PG_PASS               = var.db_password
      PG_PORT               = var.db_port
      SOURCE_EMAIL          = var.ses_from_email
      ROOT_URL              = var.client_root_url
    }
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "notification_consumer" {
  statement_id  = "AllowExecutionFromSQS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.notification_consumer.function_name
  principal     = "sqs.amazonaws.com"
  source_arn    = var.edpub_notification_sqs_arn
}

resource "aws_lambda_event_source_mapping" "notification_consumer_sqs_event" {
  event_source_arn = var.edpub_notification_sqs_arn
  function_name    = aws_lambda_function.notification_consumer.function_name
}

# RDS Backup Lambda

resource "aws_lambda_function" "rds_backup" {
  filename         = "../artifacts/rds-backup-lambda.zip"
  function_name    = "rds_backup"
  role             = var.edpub_rds_backup_lambda_role_arn
  handler          = "rds-backup.handler"
  runtime          = "nodejs18.x"
  source_code_hash = filesha256("../artifacts/rds-backup-lambda.zip")
  timeout          = 180
  environment {
    variables = {
      REGION = var.region
    }
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_cloudwatch_event_rule" "rds_backup_daily_cron" {
  name                = "rds-backup-daily-cron"
  description         = "Cloudwatch event to trigger rds_backup lambda to initiate rds backup process daily at 11PM UTC. (Must be after backup window for all environments)"
  schedule_expression = "cron(0 23 * * ? *)"
}

resource "aws_cloudwatch_event_target" "check_rds_trigger_daily" {
  rule      = "${aws_cloudwatch_event_rule.rds_backup_daily_cron.name}"
  target_id = "lambda"
  arn       = "${aws_lambda_function.rds_backup.arn}"
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_rds_backup" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.rds_backup.function_name
  principal     = "events.amazonaws.com"
  source_arn    = "${aws_cloudwatch_event_rule.rds_backup_daily_cron.arn}"
}

# Step clean Lambda

resource "aws_lambda_function" "step_cleanup" {
  filename         = "../artifacts/step-cleanup-lambda.zip"
  function_name    = "step_cleanup"
  role             = var.edpub_lambda_role_arn
  layers = [
    aws_lambda_layer_version.database_util.arn
  ]
  handler          = "step-cleanup.handler"
  runtime          = "nodejs18.x"
  source_code_hash = filesha256("../artifacts/step-cleanup-lambda.zip")
  timeout          = 180
  environment {
    variables = {
      REGION = var.region
      PG_USER        = var.db_user
      PG_HOST        = var.db_host
      PG_DB          = var.db_database
      PG_PASS        = var.db_password
      PG_PORT        = var.db_port
    }
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_cloudwatch_event_rule" "step_cleanup_monthly_cron" {
  name                = "step-cleanup-monthly-cron"
  description         = "Cloudwatch event to trigger step_cleanup lambda to remove unused stesp monthly at 11PM UTC."
  schedule_expression = "cron(0 23 1 * ? *)"
}

resource "aws_cloudwatch_event_target" "check_step_cleanup_trigger_monthly" {
  rule      = "${aws_cloudwatch_event_rule.step_cleanup_monthly_cron.name}"
  target_id = "lambda"
  arn       = "${aws_lambda_function.step_cleanup.arn}"
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_step_cleanup" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.step_cleanup.function_name
  principal     = "events.amazonaws.com"
  source_arn    = "${aws_cloudwatch_event_rule.step_cleanup_monthly_cron.arn}"
}

# Register Lambda

resource "aws_lambda_function" "register" {
  filename      = "../artifacts/register-lambda.zip"
  function_name = "register"
  role          = var.edpub_lambda_role_arn
  handler       = "register.handler"
  layers = [
    aws_lambda_layer_version.database_util.arn,
    aws_lambda_layer_version.message_util.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
  runtime          = "nodejs18.x"
  source_code_hash = filesha256("../artifacts/register-lambda.zip")
  timeout          = 180
  environment {
    variables = {
      REGION         = var.region
      EVENT_SNS      = var.edpub_event_sns_arn
      PG_USER        = var.db_user
      PG_HOST        = var.db_host
      PG_DB          = var.db_database
      PG_PASS        = var.db_password
      PG_PORT        = var.db_port
      SOURCE_EMAIL   = var.ses_from_email
    }
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "register" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.register.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/POST/action/register"
}

# Service Authorizer Lambda

resource "aws_lambda_function" "service_authorizer" {
  filename      = "../artifacts/service-authorizer-lambda.zip"
  function_name = "service_authorizer"
  role          = var.edpub_lambda_role_arn
  handler       = "service-authorizer.handler"
  layers = [
    aws_lambda_layer_version.database_util.arn,
    aws_lambda_layer_version.message_util.arn
  ]
  runtime          = "nodejs18.x"
  source_code_hash = filesha256("../artifacts/service-authorizer-lambda.zip")
  timeout          = 180
  environment {
    variables = {
      REGION         = var.region
      EVENT_SNS      = var.edpub_event_sns_arn
      PG_USER        = var.db_user
      PG_HOST        = var.db_host
      PG_DB          = var.db_database
      PG_PASS        = var.db_password
      PG_PORT        = var.db_port
      SOURCE_EMAIL   = var.ses_from_email
    }
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "service_authorizer" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.service_authorizer.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/*/service_authorizer/*"
}

# Submission Lambda

resource "aws_lambda_function" "submission" {
  filename      = "../artifacts/submission-lambda.zip"
  function_name = "submission"
  role          = var.edpub_lambda_role_arn
  handler       = "submission.handler"
  layers = [
    aws_lambda_layer_version.database_util.arn,
    aws_lambda_layer_version.message_util.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
  runtime          = "nodejs18.x"
  source_code_hash = filesha256("../artifacts/submission-lambda.zip")
  timeout          = 180
  environment {
    variables = {
      REGION         = var.region
      EVENT_SNS      = var.edpub_event_sns_arn
      PG_USER        = var.db_user
      PG_HOST        = var.db_host
      PG_DB          = var.db_database
      PG_PASS        = var.db_password
      PG_PORT        = var.db_port
      SOURCE_EMAIL   = var.ses_from_email
    }
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "submission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.submission.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/*/submission/*"
}


# Subscribe Lambda

resource "aws_lambda_function" "subscribe" {
  filename      = "../artifacts/subscribe-lambda.zip"
  function_name = "subscribe"
  role          = var.edpub_lambda_role_arn
  handler       = "subscribe.handler"
  layers = [
    aws_lambda_layer_version.database_util.arn,
    aws_lambda_layer_version.message_util.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
  runtime          = "nodejs18.x"
  source_code_hash = filesha256("../artifacts/subscribe-lambda.zip")
  timeout          = 180
  environment {
    variables = {
      REGION         = var.region
      EVENT_SNS      = var.edpub_event_sns_arn
      PG_USER        = var.db_user
      PG_HOST        = var.db_host
      PG_DB          = var.db_database
      PG_PASS        = var.db_password
      PG_PORT        = var.db_port
      SOURCE_EMAIL   = var.ses_from_email
    }
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "subscribe" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.subscribe.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/*/notification/subscribe"
}

# User Lambda

resource "aws_lambda_function" "user" {
  filename      = "../artifacts/user-lambda.zip"
  function_name = "user"
  role          = var.edpub_lambda_role_arn
  handler       = "user.handler"
  layers = [
    aws_lambda_layer_version.database_util.arn,
    aws_lambda_layer_version.message_util.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
  runtime          = "nodejs18.x"
  source_code_hash = filesha256("../artifacts/user-lambda.zip")
  timeout          = 180
  environment {
    variables = {
      REGION         = var.region
      CUP_ID         = var.cognito_user_pool_id
      EVENT_SNS      = var.edpub_event_sns_arn
      EMAIL_SNS      = var.edpub_email_sns_arn
      PG_USER        = var.db_user
      PG_HOST        = var.db_host
      PG_DB          = var.db_database
      PG_PASS        = var.db_password
      PG_PORT        = var.db_port
      SOURCE_EMAIL   = var.ses_from_email
    }
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "user" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.user.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/*/user/*"
}

# Workflow Consumer Lambda

resource "aws_lambda_function" "workflow_consumer" {
  filename      = "../artifacts/workflow-consumer-lambda.zip"
  function_name = "workflow_consumer"
  role          = var.edpub_lambda_role_arn
  handler       = "workflow-consumer.handler"
  layers = [
    aws_lambda_layer_version.database_util.arn,
    aws_lambda_layer_version.message_util.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
  runtime          = "nodejs18.x"
  source_code_hash = filesha256("../artifacts/workflow-consumer-lambda.zip")
  timeout          = 180
  environment {
    variables = {
      REGION         = var.region
      EVENT_SNS      = var.edpub_event_sns_arn
      PG_USER        = var.db_user
      PG_HOST        = var.db_host
      PG_DB          = var.db_database
      PG_PASS        = var.db_password
      PG_PORT        = var.db_port
      SOURCE_EMAIL   = var.ses_from_email
    }
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "workflow_consumer" {
  statement_id  = "AllowExecutionFromSQS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.workflow_consumer.function_name
  principal     = "sqs.amazonaws.com"
  source_arn    = var.edpub_workflow_sqs_arn
}

resource "aws_lambda_event_source_mapping" "workflow_consumer_sqs_event" {
  event_source_arn = var.edpub_workflow_sqs_arn
  function_name    = aws_lambda_function.workflow_consumer.function_name
}

# Edit Workflow Lambda

resource "aws_lambda_function" "workflow" {
  filename      = "../artifacts/workflow-lambda.zip"
  function_name = "workflow"
  role          = var.edpub_lambda_role_arn
  handler       = "workflow.handler"
  layers = [
    aws_lambda_layer_version.database_util.arn,
    aws_lambda_layer_version.message_util.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
  runtime          = "nodejs18.x"
  source_code_hash = filesha256("../artifacts/workflow-lambda.zip")
  timeout          = 180
  environment {
    variables = {
      REGION         = var.region
      EVENT_SNS      = var.edpub_event_sns_arn
      PG_USER        = var.db_user
      PG_HOST        = var.db_host
      PG_DB          = var.db_database
      PG_PASS        = var.db_password
      PG_PORT        = var.db_port
      SOURCE_EMAIL   = var.ses_from_email
    }
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "workflow" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.workflow.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/POST/api/data/workflow/*"
}

# Auth Lambda

resource "aws_lambda_function" "auth" {
  filename      = "../artifacts/auth-lambda.zip"
  function_name = "auth"
  role          = var.edpub_lambda_role_arn
  handler       = "auth.handler"
  layers = [
    aws_lambda_layer_version.auth_util.arn,
    aws_lambda_layer_version.database_util.arn
  ]
  runtime          = "nodejs18.x"
  source_code_hash = filesha256("../artifacts/auth-lambda.zip")
  timeout          = 180
  environment {
    variables = {
      REGION             = var.region
      EVENT_SNS          = var.edpub_event_sns_arn
      PG_USER            = var.db_user
      PG_HOST            = var.db_host
      PG_DB              = var.db_database
      PG_PASS            = var.db_password
      PG_PORT            = var.db_port
      CLIENT_ROOT_URL    = var.client_root_url
      AUTH_PROVIDER_URL  = var.auth_provider_url
      AUTH_LOGOUT_PATH   = var.auth_logout_path
      AUTH_LOGIN_PATH    = var.auth_login_path
      AUTH_TOKEN_PATH    = var.auth_token_path
      AUTH_USER_PATH     = var.auth_user_path
      AUTH_CLIENT_ID     = var.auth_client_id
      AUTH_CLIENT_SECRET = var.auth_client_secret
      AUTH_CLIENT_PATH   = var.auth_client_path
    }
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "auth" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.auth.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/GET/*"
}

# Version Lambda

resource "aws_lambda_function" "version" {
  filename         = "../artifacts/version-lambda.zip"
  function_name    = "version"
  role             = var.edpub_lambda_role_arn
  handler          = "version.handler"
  runtime          = "nodejs18.x"
  source_code_hash = filesha256("../artifacts/version-lambda.zip")
  timeout          = 180
  environment {
    variables = {
      API_VERSION = var.api_version
    }
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "version" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.version.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/GET/*"
}

# RemapStatics Lambda

resource "aws_lambda_function" "remap_statics" {
  filename         = "../artifacts/remap-statics-lambda.zip"
  function_name    = "remap_statics"
  role             = var.edpub_lambda_role_arn
  handler          = "remap-statics.handler"
  layers           = []
  runtime          = "nodejs18.x"
  source_code_hash = filesha256("../artifacts/remap-statics-lambda.zip")
  timeout          = 180
  environment {
    variables = {
      REGION           = var.region
      STAGE            = var.stage
      DASHBOARD_BUCKET = var.edpub_dashboard_s3_bucket
      FORMS_BUCKET     = var.edpub_forms_s3_bucket
      OVERVIEW_BUCKET  = var.edpub_overview_s3_bucket
      API_ID           = var.api_id
    }
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

# APIProxy Lambda

resource "aws_lambda_function" "api_proxy" {
  filename         = "../artifacts/api-proxy-lambda.zip"
  function_name    = "api_proxy"
  role             = var.edpub_lambda_role_arn
  handler          = "api-proxy.handler"
  layers           = []
  runtime          = "nodejs18.x"
  source_code_hash = filesha256("../artifacts/api-proxy-lambda.zip")
  timeout          = 180
  environment {
    variables = {
      REGION = var.region
      STAGE  = var.stage
      API_ID = var.api_id
    }
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

# Questions Lambda

resource "aws_lambda_function" "questions" {
  filename      = "../artifacts/questions-lambda.zip"
  function_name = "questions"
  role          = var.edpub_lambda_role_arn
  handler       = "questions.handler"
  layers = [
    aws_lambda_layer_version.database_util.arn,
    aws_lambda_layer_version.message_util.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
  runtime          = "nodejs18.x"
  source_code_hash = filesha256("../artifacts/questions-lambda.zip")
  timeout          = 180
  environment {
    variables = {
      REGION         = var.region
      EVENT_SNS      = var.edpub_event_sns_arn
      METRICS_SNS    = var.edpub_metrics_sns_arn
      PG_USER        = var.db_user
      PG_HOST        = var.db_host
      PG_DB          = var.db_database
      PG_PASS        = var.db_password
      PG_PORT        = var.db_port
      SOURCE_EMAIL   = var.ses_from_email
    }
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "questions" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.questions.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/*/*"
}

resource "aws_lambda_function" "file_upload" {
  filename      = "../artifacts/file-upload-lambda.zip"
  function_name = "file_upload"
  role          = var.edpub_lambda_role_arn
  handler       = "file-upload.handler"
  runtime          = "nodejs18.x"
  source_code_hash = filesha256("../artifacts/file-upload-lambda.zip")
  timeout          = 180
  layers = [
    aws_lambda_layer_version.database_util.arn,
  ]
  environment {
    variables = {
      REGION          = var.region
      INGEST_BUCKET   = var.edpub_upload_s3_bucket
      PG_USER        = var.db_user
      PG_HOST        = var.db_host
      PG_DB          = var.db_database
      PG_PASS        = var.db_password
      PG_PORT        = var.db_port
    }
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "file_upload" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.file_upload.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/*/upload/*"
}

# MFA Auth Lambda

resource "aws_lambda_function" "mfa_auth" {
  filename      = "../artifacts/mfa-auth-lambda.zip"
  function_name = "mfa_auth"
  role          = var.edpub_lambda_role_arn
  handler       = "mfa-auth.handler"
  runtime          = "nodejs18.x"
  source_code_hash = filesha256("../artifacts/mfa-auth-lambda.zip")
  timeout          = 180
  layers = [
    aws_lambda_layer_version.database_util.arn,
  ]
  environment {
    variables = {
      REGION          = var.region
      PG_USER        = var.db_user
      PG_HOST        = var.db_host
      PG_DB          = var.db_database
      PG_PASS        = var.db_password
      PG_PORT        = var.db_port
      CUP_ID         = var.cognito_user_pool_id
    }
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "mfa_auth" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.mfa_auth.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/*/mfa/*"
}