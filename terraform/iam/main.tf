# Action Handler IAM Role

resource "aws_iam_role_policy" "action_handler_lambda_policy" {
  name   = "ActionHandlerLambdaPolicy${var.stage_suffix}"
  role   = aws_iam_role.action_handler_lambda_role.id
  policy = data.template_file.action_handler_lambda_policy.rendered
}

resource "aws_iam_role" "action_handler_lambda_role" {
  name                 = "ActionHandlerLambdaRole${var.stage_suffix}"
  assume_role_policy   = data.template_file.assume_role.rendered
  permissions_boundary = var.permissions_boundary_arn
}

resource "aws_iam_role_policy_attachment" "action_handler_execution_role_attach" {
  role       = aws_iam_role.action_handler_lambda_role.id
  policy_arn = var.lambda_execution_policy_arn
}

# Dashboard IAM Role

resource "aws_iam_role_policy" "dashboard_lambda_policy" {
  name   = "DashboardLambdaPolicy${var.stage_suffix}"
  role   = aws_iam_role.dashboard_lambda_role.id
  policy = data.template_file.dashboard_lambda_policy.rendered
}

resource "aws_iam_role" "dashboard_lambda_role" {
  name                 = "DashboardLambdaRole${var.stage_suffix}"
  assume_role_policy   = data.template_file.assume_role.rendered
  permissions_boundary = var.permissions_boundary_arn
}

resource "aws_iam_role_policy_attachment" "dashboard_execution_role_attach" {
  role       = aws_iam_role.dashboard_lambda_role.id
  policy_arn = var.lambda_execution_policy_arn
}

# Information IAM Role

resource "aws_iam_role_policy" "information_lambda_policy" {
  name   = "InformationLambdaPolicy${var.stage_suffix}"
  role   = aws_iam_role.information_lambda_role.id
  policy = data.template_file.information_lambda_policy.rendered
}

resource "aws_iam_role" "information_lambda_role" {
  name                 = "InformationLambdaRole${var.stage_suffix}"
  assume_role_policy   = data.template_file.assume_role.rendered
  permissions_boundary = var.permissions_boundary_arn
}

resource "aws_iam_role_policy_attachment" "information_execution_role_attach" {
  role       = aws_iam_role.information_lambda_role.id
  policy_arn = var.lambda_execution_policy_arn
}

# Invoke IAM Role

resource "aws_iam_role_policy" "invoke_lambda_policy" {
  name   = "InvokeLambdaPolicy${var.stage_suffix}"
  role   = aws_iam_role.invoke_lambda_role.id
  policy = data.template_file.invoke_lambda_policy.rendered
}

resource "aws_iam_role" "invoke_lambda_role" {
  name                 = "InvokeLambdaRole${var.stage_suffix}"
  assume_role_policy   = data.template_file.assume_role.rendered
  permissions_boundary = var.permissions_boundary_arn
}

resource "aws_iam_role_policy_attachment" "invoke_execution_role_attach" {
  role       = aws_iam_role.invoke_lambda_role.id
  policy_arn = var.lambda_execution_policy_arn
}

# Metrics Handler IAM Role

resource "aws_iam_role_policy" "metrics_handler_lambda_policy" {
  name   = "MetricsHandlerLambdaPolicy${var.stage_suffix}"
  role   = aws_iam_role.metrics_handler_lambda_role.id
  policy = data.template_file.metrics_handler_lambda_policy.rendered
}

resource "aws_iam_role" "metrics_handler_lambda_role" {
  name                 = "MetricsHandlerLambdaRole${var.stage_suffix}"
  assume_role_policy   = data.template_file.assume_role.rendered
  permissions_boundary = var.permissions_boundary_arn
}

resource "aws_iam_role_policy_attachment" "metrics_handler_execution_role_attach" {
  role       = aws_iam_role.metrics_handler_lambda_role.id
  policy_arn = var.lambda_execution_policy_arn
}

# Notification Handler IAM Role

resource "aws_iam_role_policy" "notification_handler_lambda_policy" {
  name   = "NotificationHandlerLambdaPolicy${var.stage_suffix}"
  role   = aws_iam_role.notification_handler_lambda_role.id
  policy = data.template_file.notification_handler_lambda_policy.rendered
}

resource "aws_iam_role" "notification_handler_lambda_role" {
  name                 = "NotificationHandlerLambdaRole${var.stage_suffix}"
  assume_role_policy   = data.template_file.assume_role.rendered
  permissions_boundary = var.permissions_boundary_arn
}

resource "aws_iam_role_policy_attachment" "notification_handler_execution_role_attach" {
  role       = aws_iam_role.notification_handler_lambda_role.id
  policy_arn = var.lambda_execution_policy_arn
}

# Notify IAM Role

resource "aws_iam_role_policy" "notify_lambda_policy" {
  name   = "NotifyLambdaPolicy${var.stage_suffix}"
  role   = aws_iam_role.notify_lambda_role.id
  policy = data.template_file.notify_lambda_policy.rendered
}

resource "aws_iam_role" "notify_lambda_role" {
  name                 = "NotifyLambdaRole${var.stage_suffix}"
  assume_role_policy   = data.template_file.assume_role.rendered
  permissions_boundary = var.permissions_boundary_arn
}

resource "aws_iam_role_policy_attachment" "notify_execution_role_attach" {
  role       = aws_iam_role.notify_lambda_role.id
  policy_arn = var.lambda_execution_policy_arn
}

# Register IAM Role

resource "aws_iam_role_policy" "register_lambda_policy" {
  name   = "RegisterLambdaPolicy${var.stage_suffix}"
  role   = aws_iam_role.register_lambda_role.id
  policy = data.template_file.register_lambda_policy.rendered
}

resource "aws_iam_role" "register_lambda_role" {
  name                 = "RegisterLambdaRole${var.stage_suffix}"
  assume_role_policy   = data.template_file.assume_role.rendered
  permissions_boundary = var.permissions_boundary_arn
}

resource "aws_iam_role_policy_attachment" "register_execution_role_attach" {
  role       = aws_iam_role.register_lambda_role.id
  policy_arn = var.lambda_execution_policy_arn
}

# Submission IAM Role

resource "aws_iam_role_policy" "submission_lambda_policy" {
  name   = "SubmissionLambdaPolicy${var.stage_suffix}"
  role   = aws_iam_role.submission_lambda_role.id
  policy = data.template_file.submission_lambda_policy.rendered
}

resource "aws_iam_role" "submission_lambda_role" {
  name                 = "SubmissionLambdaRole${var.stage_suffix}"
  assume_role_policy   = data.template_file.assume_role.rendered
  permissions_boundary = var.permissions_boundary_arn
}

resource "aws_iam_role_policy_attachment" "submission_execution_role_attach" {
  role       = aws_iam_role.submission_lambda_role.id
  policy_arn = var.lambda_execution_policy_arn
}

# Subscription IAM Role

resource "aws_iam_role_policy" "subscription_lambda_policy" {
  name   = "SubscriptionLambdaPolicy${var.stage_suffix}"
  role   = aws_iam_role.subscription_lambda_role.id
  policy = data.template_file.subscription_lambda_policy.rendered
}

resource "aws_iam_role" "subscription_lambda_role" {
  name                 = "SubscriptionLambdaRole${var.stage_suffix}"
  assume_role_policy   = data.template_file.assume_role.rendered
  permissions_boundary = var.permissions_boundary_arn
}

resource "aws_iam_role_policy_attachment" "subscription_execution_role_attach" {
  role       = aws_iam_role.subscription_lambda_role.id
  policy_arn = var.lambda_execution_policy_arn
}

# Workflow Handler IAM Role

resource "aws_iam_role_policy" "workflow_handler_lambda_policy" {
  name   = "WorkflowHandlerLambdaPolicy${var.stage_suffix}"
  role   = aws_iam_role.workflow_handler_lambda_role.id
  policy = data.template_file.workflow_handler_lambda_policy.rendered
}

resource "aws_iam_role" "workflow_handler_lambda_role" {
  name                 = "WorkflowHandlerLambdaRole${var.stage_suffix}"
  assume_role_policy   = data.template_file.assume_role.rendered
  permissions_boundary = var.permissions_boundary_arn
}

resource "aws_iam_role_policy_attachment" "workflow_handler_execution_role_attach" {
  role       = aws_iam_role.workflow_handler_lambda_role.id
  policy_arn = var.lambda_execution_policy_arn
}
