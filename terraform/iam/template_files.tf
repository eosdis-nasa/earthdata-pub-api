data "template_file" "assume_role" {
  template = file("./iam/assume_role.json")
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
    edpub_event_sns_arn = var.edpub_event_sns_arn
    edpub_email_sns_arn = var.edpub_email_sns_arn
    edpub_metrics_sns_arn = var.edpub_metrics_sns_arn
    edpub_action_sqs_arn = var.edpub_action_sqs_arn
    edpub_action_s3_arn = var.edpub_action_s3_arn
  }
}
