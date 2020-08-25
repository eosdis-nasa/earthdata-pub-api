# Action Handler Lambda

resource "aws_lambda_function" "action_handler" {
  filename      = "../artifacts/action-handler-lambda.zip"
  function_name = "action_handler${var.stage_suffix}"
  role          = var.action_handler_lambda_role_arn
  handler       = "action-handler.handler"
  runtime       = "nodejs12.x"
  timeout       = 10
  environment {
    variables = {
      TABLE_SUFFIX  = var.stage_suffix
      REGION        = var.region
      ACTION_BUCKET = var.edpub_action_bucket
      SNS_TOPIC     = var.edpub_topic_arn
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
  source_arn    = var.edpub_queue_arn
}

resource "aws_lambda_event_source_mapping" "action_handler_sqs_event" {
  event_source_arn = var.edpub_queue_arn
  function_name    = aws_lambda_function.action_handler.function_name
}

# Dashboard Lambda

resource "aws_lambda_function" "dashboard" {
  filename      = "../artifacts/dashboard-lambda.zip"
  function_name = "dashboard${var.stage_suffix}"
  role          = var.dashboard_lambda_role_arn
  handler       = "dashboard.handler"
  runtime       = "nodejs12.x"
  timeout       = 10
  environment {
    variables = {
      TABLE_SUFFIX = var.stage_suffix
      REGION       = var.region
    }
  }
  vpc_config {
     subnet_ids         = var.subnet_ids
     security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "dashboard" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.dashboard.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/POST/dashboard"
}

# Information Lambda

resource "aws_lambda_function" "information" {
  filename      = "../artifacts/information-lambda.zip"
  function_name = "information${var.stage_suffix}"
  role          = var.information_lambda_role_arn
  handler       = "information.handler"
  runtime       = "nodejs12.x"
  timeout       = 10
  environment {
    variables = {
      TABLE_SUFFIX = var.stage_suffix
      REGION       = var.region
    }
  }
  vpc_config {
     subnet_ids         = var.subnet_ids
     security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "information" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.information.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/GET/*"
}

# Invoke Lambda

resource "aws_lambda_function" "invoke" {
  filename      = "../artifacts/invoke-lambda.zip"
  function_name = "invoke${var.stage_suffix}"
  role          = var.invoke_lambda_role_arn
  handler       = "invoke.handler"
  runtime       = "nodejs12.x"
  timeout       = 10
  environment {
    variables = {
      SQS_QUEUE = var.edpub_queue_url
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

# Notify Lambda

resource "aws_lambda_function" "notify" {
  filename      = "../artifacts/notify-lambda.zip"
  function_name = "notify${var.stage_suffix}"
  role          = var.notify_lambda_role_arn
  handler       = "notify.handler"
  runtime       = "nodejs12.x"
  timeout       = 10
  environment {
    variables = {
      SNS_TOPIC = var.edpub_topic_arn
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
  function_name = "notification_handler${var.stage_suffix}"
  role          = var.notification_handler_lambda_role_arn
  handler       = "notification-handler.handler"
  runtime       = "nodejs12.x"
  timeout       = 10
  environment {
    variables = {
      TABLE_SUFFIX = var.stage_suffix
      REGION       = var.region
      SNS_TOPIC    = var.edpub_email_topic_arn
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
  source_arn    = var.edpub_topic_arn
}

data "local_file" "notification_handler_filter" {
  filename = "./sns/notification_handler_filter.json"
}

resource "aws_sns_topic_subscription" "notification_handler_lambda" {
  topic_arn     = var.edpub_topic_arn
  protocol      = "lambda"
  endpoint      = aws_lambda_function.notification_handler.arn
  filter_policy = data.local_file.notification_handler_filter.content
}

# Register Lambda

resource "aws_lambda_function" "register" {
  filename      = "../artifacts/register-lambda.zip"
  function_name = "register${var.stage_suffix}"
  role          = var.register_lambda_role_arn
  handler       = "register.handler"
  runtime       = "nodejs12.x"
  timeout       = 10
  environment {
    variables = {
      TABLE_SUFFIX = var.stage_suffix
      REGION       = var.region
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
  function_name = "submission${var.stage_suffix}"
  role          = var.submission_lambda_role_arn
  handler       = "submission.handler"
  runtime       = "nodejs12.x"
  timeout       = 10
  environment {
    variables = {
      TABLE_SUFFIX = var.stage_suffix
      SNS_TOPIC    = var.edpub_topic_arn
      REGION       = var.region
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
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/*/submission"
}

# Subscription Lambda

resource "aws_lambda_function" "subscription" {
  filename      = "../artifacts/subscription-lambda.zip"
  function_name = "subscription${var.stage_suffix}"
  role          = var.subscription_lambda_role_arn
  handler       = "subscription.handler"
  runtime       = "nodejs12.x"
  timeout       = 10
  environment {
    variables = {
      TABLE_SUFFIX = var.stage_suffix
      REGION       = var.region
    }
  }
  vpc_config {
     subnet_ids         = var.subnet_ids
     security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_permission" "subscription" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.subscription.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/*/notification/subscription"
}

# Workflow Handler Lambda

resource "aws_lambda_function" "workflow_handler" {
  filename      = "../artifacts/workflow-handler-lambda.zip"
  function_name = "workflow_handler${var.stage_suffix}"
  role          = var.workflow_handler_lambda_role_arn
  handler       = "workflow-handler.handler"
  runtime       = "nodejs12.x"
  timeout       = 10
  environment {
    variables = {
      TABLE_SUFFIX = var.stage_suffix
      REGION       = var.region
      SQS_QUEUE    = var.edpub_queue_url
      SNS_TOPIC    = var.edpub_email_topic_arn
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
  source_arn    = var.edpub_topic_arn
}

data "local_file" "workflow_handler_filter" {
  filename = "./sns/workflow_handler_filter.json"
}

resource "aws_sns_topic_subscription" "workflow_handler" {
  topic_arn     = var.edpub_topic_arn
  protocol      = "lambda"
  endpoint      = aws_lambda_function.workflow_handler.arn
  filter_policy = data.local_file.workflow_handler_filter.content
}
