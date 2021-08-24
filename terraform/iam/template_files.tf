data "template_file" "edpub_lambda_assume_role" {
  template = file("./iam/edpub_lambda_assume_role.json")
  vars = {
    region = var.region
    account_id = var.account_id
  }
}

data "template_file" "edpub_lambda_policy" {
  template = file("./iam/edpub_lambda_policy.json")
  vars = {
    region = var.region
    account_id = var.account_id
    edpub_outbound_sns_arn = var.edpub_outbound_sns_arn
    edpub_event_sns_arn = var.edpub_event_sns_arn
    edpub_email_sns_arn = var.edpub_email_sns_arn
    edpub_metrics_sns_arn = var.edpub_metrics_sns_arn
    edpub_inbound_sqs_arn = var.edpub_inbound_sqs_arn
    edpub_action_sqs_arn = var.edpub_action_sqs_arn
    edpub_metrics_sqs_arn = var.edpub_metrics_sqs_arn
    edpub_notification_sqs_arn = var.edpub_notification_sqs_arn
    edpub_workflow_sqs_arn = var.edpub_workflow_sqs_arn
  }
}

data "template_file" "edpub_apigateway_s3_assume_role" {
  template = file("./iam/edpub_apigateway_s3_assume_role.json")
  vars = {
    region = var.region
    account_id = var.account_id
  }
}

data "template_file" "edpub_apigateway_s3_policy" {
  template = file("./iam/edpub_apigateway_s3_policy.json")
  vars = {
    region = var.region
    account_id = var.account_id
  }
}
