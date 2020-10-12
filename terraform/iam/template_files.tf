data "template_file" "assume_role" {
  template = file("./iam/assume_role.json")
  vars = {
    region = var.region
    account_id = var.account_id
  }
}

data "template_file" "action_handler_lambda_policy" {
  template = file("./iam/action_handler_lambda_policy.json")
  vars = {
    region = var.region
    account_id = var.account_id
    edpub_topic_arn = var.edpub_topic_arn
    edpub_queue_arn = var.edpub_queue_arn
  }
}

data "template_file" "dashboard_lambda_policy" {
  template = file("./iam/dashboard_lambda_policy.json")
  vars = {
    region = var.region
    account_id = var.account_id
  }
}

data "template_file" "data_lambda_policy" {
  template = file("./iam/data_lambda_policy.json")
  vars = {
    region = var.region
    account_id = var.account_id
  }
}

data "template_file" "invoke_lambda_policy" {
  template = file("./iam/invoke_lambda_policy.json")
  vars = {
    region = var.region
    account_id = var.account_id
    edpub_queue_arn = var.edpub_queue_arn
  }
}

data "template_file" "metrics_handler_lambda_policy" {
  template = file("./iam/metrics_handler_lambda_policy.json")
  vars = {
    region = var.region
    account_id = var.account_id
    edpub_metrics_topic_arn = var.edpub_metrics_topic_arn
    edpub_topic_arn = var.edpub_topic_arn
  }
}

data "template_file" "notification_handler_lambda_policy" {
  template = file("./iam/notification_handler_lambda_policy.json")
  vars = {
    region = var.region
    account_id = var.account_id
    edpub_email_topic_arn = var.edpub_email_topic_arn
    edpub_topic_arn = var.edpub_topic_arn
  }
}

data "template_file" "register_lambda_policy" {
  template = file("./iam/register_lambda_policy.json")
  vars = {
    region = var.region
    account_id = var.account_id
  }
}

data "template_file" "submission_lambda_policy" {
  template = file("./iam/submission_lambda_policy.json")
  vars = {
    region = var.region
    account_id = var.account_id
  }
}

data "template_file" "subscription_lambda_policy" {
  template = file("./iam/subscription_lambda_policy.json")
  vars = {
    region = var.region
    account_id = var.account_id
  }
}

data "template_file" "notify_lambda_policy" {
  template = file("./iam/notify_lambda_policy.json")
  vars = {
    region = var.region
    account_id = var.account_id
    edpub_topic_arn = var.edpub_topic_arn
  }
}

data "template_file" "workflow_handler_lambda_policy" {
  template = file("./iam/workflow_handler_lambda_policy.json")
  vars = {
    region = var.region
    account_id = var.account_id
    edpub_topic_arn = var.edpub_topic_arn
    edpub_queue_arn = var.edpub_queue_arn
  }
}
