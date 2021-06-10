# Auth Util Layer

resource "aws_lambda_layer_version" "auth_util" {
  filename            = "../artifacts/auth-util-layer.zip"
  layer_name          = "authUtilLayer"
  compatible_runtimes = ["nodejs12.x"]
  source_code_hash    = filesha256("../artifacts/auth-util-layer.zip")
}

# Database Util Layer

resource "aws_lambda_layer_version" "database_util" {
  filename            = "../artifacts/database-util-layer.zip"
  layer_name          = "databaseUtilLayer"
  compatible_runtimes = ["nodejs12.x"]
  source_code_hash    = filesha256("../artifacts/database-util-layer.zip")
}

# Kayako Util Layer

resource "aws_lambda_layer_version" "kayako_util" {
  filename            = "../artifacts/kayako-util-layer.zip"
  layer_name          = "kayakoUtilLayer"
  compatible_runtimes = ["nodejs12.x"]
  source_code_hash    = filesha256("../artifacts/kayako-util-layer.zip")
}

# Message Util Layer

resource "aws_lambda_layer_version" "message_util" {
  filename            = "../artifacts/message-util-layer.zip"
  layer_name          = "messageUtilLayer"
  compatible_runtimes = ["nodejs12.x"]
  source_code_hash    = filesha256("../artifacts/message-util-layer.zip")
}

# Schema Layer

resource "aws_lambda_layer_version" "schema_util" {
  filename            = "../artifacts/schema-util-layer.zip"
  layer_name          = "schemaUtilLayer"
  compatible_runtimes = ["nodejs12.x"]
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
  runtime       = "nodejs12.x"
  source_code_hash    = filesha256("../artifacts/action-consumer-lambda.zip")
  timeout       = 10
  environment {
    variables = {
      REGION    = var.region
      EVENT_SNS = var.edpub_event_sns_arn
      METRICS_SNS = var.edpub_metrics_sns_arn
      PG_USER   = var.db_user
      PG_HOST   = var.db_host
      PG_DB     = var.db_database
      PG_PASS   = var.db_password
      PG_PORT   = var.db_port
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
  runtime       = "nodejs12.x"
  source_code_hash    = filesha256("../artifacts/data-lambda.zip")
  timeout       = 10
  environment {
    variables = {
      REGION    = var.region
      EVENT_SNS = var.edpub_event_sns_arn
      METRICS_SNS = var.edpub_metrics_sns_arn
      PG_USER   = var.db_user
      PG_HOST   = var.db_host
      PG_DB     = var.db_database
      PG_PASS   = var.db_password
      PG_PORT   = var.db_port
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
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/GET/*"
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
  runtime       = "nodejs12.x"
  source_code_hash    = filesha256("../artifacts/invoke-lambda.zip")
  timeout       = 10
  environment {
    variables = {
      REGION    = var.region
      EVENT_SNS = var.edpub_event_sns_arn
      METRICS_SNS = var.edpub_metrics_sns_arn
      PG_USER   = var.db_user
      PG_HOST   = var.db_host
      PG_DB     = var.db_database
      PG_PASS   = var.db_password
      PG_PORT   = var.db_port
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
  runtime       = "nodejs12.x"
  source_code_hash    = filesha256("../artifacts/metrics-lambda.zip")
  timeout       = 10
  environment {
    variables = {
      REGION    = var.region
      EVENT_SNS = var.edpub_event_sns_arn
      METRICS_SNS = var.edpub_metrics_sns_arn
      PG_USER   = var.db_user
      PG_HOST   = var.db_host
      PG_DB     = var.db_database
      PG_PASS   = var.db_password
      PG_PORT   = var.db_port
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
  runtime       = "nodejs12.x"
  source_code_hash    = filesha256("../artifacts/metrics-consumer-lambda.zip")
  timeout       = 10
  environment {
    variables = {
      REGION    = var.region
      EVENT_SNS = var.edpub_event_sns_arn
      METRICS_SNS = var.edpub_metrics_sns_arn
      PG_USER   = var.db_user
      PG_HOST   = var.db_host
      PG_DB     = var.db_database
      PG_PASS   = var.db_password
      PG_PORT   = var.db_port
    }
  }
  vpc_config {
     subnet_ids         = var.subnet_ids
     security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "metrics_consumer" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.metrics_consumer.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = var.edpub_event_sns_arn
}

data "local_file" "metrics_consumer_filter" {
  filename = "./sns/metrics_consumer_filter.json"
}

resource "aws_sns_topic_subscription" "metrics_consumer_lambda" {
  topic_arn     = var.edpub_event_sns_arn
  protocol      = "lambda"
  endpoint      = aws_lambda_function.metrics_consumer.arn
  filter_policy = data.local_file.metrics_consumer_filter.content
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
  runtime       = "nodejs12.x"
  source_code_hash    = filesha256("../artifacts/model-lambda.zip")
  timeout       = 10
  environment {
    variables = {
      REGION    = var.region
      EVENT_SNS = var.edpub_event_sns_arn
      PG_USER   = var.db_user
      PG_HOST   = var.db_host
      PG_DB     = var.db_database
      PG_PASS   = var.db_password
      PG_PORT   = var.db_port
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

# Notify Lambda

resource "aws_lambda_function" "notification" {
  filename      = "../artifacts/notification-lambda.zip"
  function_name = "notification"
  role          = var.edpub_lambda_role_arn
  handler       = "notification.handler"
  layers = [
    aws_lambda_layer_version.database_util.arn,
    aws_lambda_layer_version.kayako_util.arn,
    aws_lambda_layer_version.message_util.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
  runtime       = "nodejs12.x"
  source_code_hash    = filesha256("../artifacts/notification-lambda.zip")
  timeout       = 10
  environment {
    variables = {
      REGION    = var.region
      EVENT_SNS = var.edpub_event_sns_arn
      PG_USER   = var.db_user
      PG_HOST   = var.db_host
      PG_DB     = var.db_database
      PG_PASS   = var.db_password
      PG_PORT   = var.db_port
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
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/POST/notification/*"
}

# Notification Consumer Lambda

resource "aws_lambda_function" "notification_consumer" {
  filename      = "../artifacts/notification-consumer-lambda.zip"
  function_name = "notification_consumer"
  role          = var.edpub_lambda_role_arn
  handler       = "notification-consumer.handler"
  layers = [
    aws_lambda_layer_version.database_util.arn,
    aws_lambda_layer_version.kayako_util.arn,
    aws_lambda_layer_version.message_util.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
  runtime       = "nodejs12.x"
  source_code_hash    = filesha256("../artifacts/notification-consumer-lambda.zip")
  timeout       = 10
  environment {
    variables = {
      REGION    = var.region
      EVENT_SNS = var.edpub_event_sns_arn
      PG_USER   = var.db_user
      PG_HOST   = var.db_host
      PG_DB     = var.db_database
      PG_PASS   = var.db_password
      PG_PORT   = var.db_port
    }
  }
  vpc_config {
     subnet_ids         = var.subnet_ids
     security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "notification_consumer" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.notification_consumer.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = var.edpub_event_sns_arn
}

data "local_file" "notification_consumer_filter" {
  filename = "./sns/notification_consumer_filter.json"
}

resource "aws_sns_topic_subscription" "notification_consumer_lambda" {
  topic_arn     = var.edpub_event_sns_arn
  protocol      = "lambda"
  endpoint      = aws_lambda_function.notification_consumer.arn
  filter_policy = data.local_file.notification_consumer_filter.content
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
  runtime       = "nodejs12.x"
  source_code_hash    = filesha256("../artifacts/register-lambda.zip")
  timeout       = 10
  environment {
    variables = {
      REGION    = var.region
      EVENT_SNS = var.edpub_event_sns_arn
      PG_USER   = var.db_user
      PG_HOST   = var.db_host
      PG_DB     = var.db_database
      PG_PASS   = var.db_password
      PG_PORT   = var.db_port
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
  runtime       = "nodejs12.x"
  source_code_hash    = filesha256("../artifacts/submission-lambda.zip")
  timeout       = 10
  environment {
    variables = {
      REGION    = var.region
      EVENT_SNS = var.edpub_event_sns_arn
      PG_USER   = var.db_user
      PG_HOST   = var.db_host
      PG_DB     = var.db_database
      PG_PASS   = var.db_password
      PG_PORT   = var.db_port
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
  runtime       = "nodejs12.x"
  source_code_hash    = filesha256("../artifacts/subscribe-lambda.zip")
  timeout       = 10
  environment {
    variables = {
      REGION    = var.region
      EVENT_SNS = var.edpub_event_sns_arn
      PG_USER   = var.db_user
      PG_HOST   = var.db_host
      PG_DB     = var.db_database
      PG_PASS   = var.db_password
      PG_PORT   = var.db_port
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
  runtime       = "nodejs12.x"
  source_code_hash    = filesha256("../artifacts/workflow-consumer-lambda.zip")
  timeout       = 10
  environment {
    variables = {
      REGION    = var.region
      EVENT_SNS = var.edpub_event_sns_arn
      PG_USER   = var.db_user
      PG_HOST   = var.db_host
      PG_DB     = var.db_database
      PG_PASS   = var.db_password
      PG_PORT   = var.db_port
    }
  }
  vpc_config {
     subnet_ids         = var.subnet_ids
     security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "workflow_consumer" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.workflow_consumer.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = var.edpub_event_sns_arn
}

data "local_file" "workflow_consumer_filter" {
  filename = "./sns/workflow_consumer_filter.json"
}

resource "aws_sns_topic_subscription" "workflow_consumer" {
  topic_arn     = var.edpub_event_sns_arn
  protocol      = "lambda"
  endpoint      = aws_lambda_function.workflow_consumer.arn
  filter_policy = data.local_file.workflow_consumer_filter.content
}

# Auth Lambda

resource "aws_lambda_function" "auth" {
  filename      = "../artifacts/auth-lambda.zip"
  function_name = "auth"
  role          = var.edpub_lambda_role_arn
  handler       = "auth.handler"
  layers        = [
    aws_lambda_layer_version.auth_util.arn,
    aws_lambda_layer_version.database_util.arn
  ]
  runtime       = "nodejs12.x"
  source_code_hash    = filesha256("../artifacts/auth-lambda.zip")
  timeout       = 10
  environment {
    variables = {
      REGION              = var.region
      EVENT_SNS           = var.edpub_event_sns_arn
      PG_USER             = var.db_user
      PG_HOST             = var.db_host
      PG_DB               = var.db_database
      PG_PASS             = var.db_password
      PG_PORT             = var.db_port
      AUTH_PROVIDER_URL   = var.cognito_url
      AUTH_LOGOUT_PATH    = var.cognito_logout_path
      AUTH_LOGIN_PATH     = var.cognito_login_path
      AUTH_TOKEN_PATH     = var.cognito_token_path
      AUTH_USER_PATH      = var.cognito_user_path
      AUTH_CLIENT_ID      = var.cognito_client_id
      AUTH_CLIENT_SECRET  = var.cognito_client_secret
      AUTH_CLIENT_URL     = var.cognito_client_auth_url
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
  filename      = "../artifacts/version-lambda.zip"
  function_name = "version"
  role          = var.edpub_lambda_role_arn
  handler       = "version.handler"
  runtime       = "nodejs12.x"
  source_code_hash    = filesha256("../artifacts/version-lambda.zip")
  timeout       = 10
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
  filename      = "../artifacts/remap-statics-lambda.zip"
  function_name = "remap_statics"
  role          = var.edpub_lambda_role_arn
  handler       = "remap-statics.handler"
  layers        = []
  runtime       = "nodejs12.x"
  source_code_hash    = filesha256("../artifacts/remap-statics-lambda.zip")
  timeout       = 10
  environment {
    variables = {
      REGION              = var.region
      DASHBOARD_BUCKET    = var.edpub_dashboard_s3_bucket
      FORMS_BUCKET        = var.edpub_forms_s3_bucket
      OVERVIEW_BUCKET     = var.edpub_overview_s3_bucket
      API_ID              = var.api_id
    }
  }
  vpc_config {
     subnet_ids         = var.subnet_ids
     security_group_ids = var.security_group_ids
  }
}
