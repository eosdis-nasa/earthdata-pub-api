# Database Driver Layer

resource "aws_lambda_layer_version" "database_driver" {
  filename            = "../artifacts/database-driver-layer.zip"
  layer_name          = "databaseDriverLayer"
  compatible_runtimes = ["nodejs12.x"]
  source_code_hash    = filesha256("../artifacts/database-driver-layer.zip")
}

# Message Driver Layer

resource "aws_lambda_layer_version" "message_driver" {
  filename            = "../artifacts/message-driver-layer.zip"
  layer_name          = "messageDriverLayer"
  compatible_runtimes = ["nodejs12.x"]
  source_code_hash    = filesha256("../artifacts/message-driver-layer.zip")
}

# Schema Layer

resource "aws_lambda_layer_version" "schema_util" {
  filename            = "../artifacts/schema-util-layer.zip"
  layer_name          = "schemaUtilLayer"
  compatible_runtimes = ["nodejs12.x"]
  source_code_hash    = filesha256("../artifacts/schema-util-layer.zip")
}

# Action Handler Lambda

resource "aws_lambda_function" "action_handler" {
  filename      = "../artifacts/action-handler-lambda.zip"
  function_name = "action_handler"
  role          = var.edpub_lambda_role_arn
  handler       = "action-handler.handler"
  layers = [
    aws_lambda_layer_version.database_driver.arn,
    aws_lambda_layer_version.message_driver.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
  runtime       = "nodejs12.x"
  source_code_hash    = filesha256("../artifacts/action-handler-lambda.zip")
  timeout       = 10
  environment {
    variables = {
      ACTION_S3 = var.edpub_action_s3_id
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

resource "aws_lambda_permission" "action_handler" {
  statement_id  = "AllowExecutionFromSQS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.action_handler.function_name
  principal     = "sqs.amazonaws.com"
  source_arn    = var.edpub_action_sqs_arn
}

resource "aws_lambda_event_source_mapping" "action_handler_sqs_event" {
  event_source_arn = var.edpub_action_sqs_arn
  function_name    = aws_lambda_function.action_handler.function_name
}

# Data Lambda

resource "aws_lambda_function" "data" {
  filename      = "../artifacts/data-lambda.zip"
  function_name = "data"
  role          = var.edpub_lambda_role_arn
  handler       = "data.handler"
  layers = [
    aws_lambda_layer_version.database_driver.arn,
    aws_lambda_layer_version.message_driver.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
  runtime       = "nodejs12.x"
  source_code_hash    = filesha256("../artifacts/data-lambda.zip")
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
    aws_lambda_layer_version.database_driver.arn,
    aws_lambda_layer_version.message_driver.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
  runtime       = "nodejs12.x"
  source_code_hash    = filesha256("../artifacts/invoke-lambda.zip")
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
    aws_lambda_layer_version.database_driver.arn,
    aws_lambda_layer_version.message_driver.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
  runtime       = "nodejs12.x"
  source_code_hash    = filesha256("../artifacts/metrics-lambda.zip")
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

resource "aws_lambda_permission" "metrics" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.metrics.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/*/*"
}

# Metrics Handler Lambda

resource "aws_lambda_function" "metrics_handler" {
  filename      = "../artifacts/metrics-handler-lambda.zip"
  function_name = "metrics_handler"
  role          = var.edpub_lambda_role_arn
  handler       = "metrics-handler.handler"
  layers = [
    aws_lambda_layer_version.database_driver.arn,
    aws_lambda_layer_version.message_driver.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
  runtime       = "nodejs12.x"
  source_code_hash    = filesha256("../artifacts/metrics-handler-lambda.zip")
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

resource "aws_lambda_permission" "metrics_handler" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.metrics_handler.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = var.edpub_event_sns_arn
}

data "local_file" "metrics_handler_filter" {
  filename = "./sns/metrics_handler_filter.json"
}

resource "aws_sns_topic_subscription" "metrics_handler_lambda" {
  topic_arn     = var.edpub_event_sns_arn
  protocol      = "lambda"
  endpoint      = aws_lambda_function.metrics_handler.arn
  filter_policy = data.local_file.metrics_handler_filter.content
}

# Data Lambda

resource "aws_lambda_function" "model" {
  filename      = "../artifacts/model-lambda.zip"
  function_name = "model"
  role          = var.edpub_lambda_role_arn
  handler       = "model.handler"
  layers = [
    aws_lambda_layer_version.database_driver.arn,
    aws_lambda_layer_version.message_driver.arn,
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

resource "aws_lambda_function" "notify" {
  filename      = "../artifacts/notify-lambda.zip"
  function_name = "notify"
  role          = var.edpub_lambda_role_arn
  handler       = "notify.handler"
  layers = [
    aws_lambda_layer_version.database_driver.arn,
    aws_lambda_layer_version.message_driver.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
  runtime       = "nodejs12.x"
  source_code_hash    = filesha256("../artifacts/notify-lambda.zip")
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

resource "aws_lambda_permission" "notify" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.notify.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/POST/notification/notify"
}

# Notification Handler Lambda

resource "aws_lambda_function" "notification_handler" {
  filename      = "../artifacts/notification-handler-lambda.zip"
  function_name = "notification_handler"
  role          = var.edpub_lambda_role_arn
  handler       = "notification-handler.handler"
  layers = [
    aws_lambda_layer_version.database_driver.arn,
    aws_lambda_layer_version.message_driver.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
  runtime       = "nodejs12.x"
  source_code_hash    = filesha256("../artifacts/notification-handler-lambda.zip")
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

resource "aws_lambda_permission" "notification_handler" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.notification_handler.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = var.edpub_event_sns_arn
}

data "local_file" "notification_handler_filter" {
  filename = "./sns/notification_handler_filter.json"
}

resource "aws_sns_topic_subscription" "notification_handler_lambda" {
  topic_arn     = var.edpub_event_sns_arn
  protocol      = "lambda"
  endpoint      = aws_lambda_function.notification_handler.arn
  filter_policy = data.local_file.notification_handler_filter.content
}

# Register Lambda

resource "aws_lambda_function" "register" {
  filename      = "../artifacts/register-lambda.zip"
  function_name = "register"
  role          = var.edpub_lambda_role_arn
  handler       = "register.handler"
  layers = [
    aws_lambda_layer_version.database_driver.arn,
    aws_lambda_layer_version.message_driver.arn,
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
    aws_lambda_layer_version.database_driver.arn,
    aws_lambda_layer_version.message_driver.arn,
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
    aws_lambda_layer_version.database_driver.arn,
    aws_lambda_layer_version.message_driver.arn,
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

# Workflow Handler Lambda

resource "aws_lambda_function" "workflow_handler" {
  filename      = "../artifacts/workflow-handler-lambda.zip"
  function_name = "workflow_handler"
  role          = var.edpub_lambda_role_arn
  handler       = "workflow-handler.handler"
  layers = [
    aws_lambda_layer_version.database_driver.arn,
    aws_lambda_layer_version.message_driver.arn,
    aws_lambda_layer_version.schema_util.arn
  ]
  runtime       = "nodejs12.x"
  source_code_hash    = filesha256("../artifacts/workflow-handler-lambda.zip")
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

resource "aws_lambda_permission" "workflow_handler" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.workflow_handler.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = var.edpub_event_sns_arn
}

data "local_file" "workflow_handler_filter" {
  filename = "./sns/workflow_handler_filter.json"
}

resource "aws_sns_topic_subscription" "workflow_handler" {
  topic_arn     = var.edpub_event_sns_arn
  protocol      = "lambda"
  endpoint      = aws_lambda_function.workflow_handler.arn
  filter_policy = data.local_file.workflow_handler_filter.content
}
