data "template_file" "dynamodb_lambda_policy" {
  template = file("./iam/dynamodb_lambda_policy.json")
  vars = {
    region = var.region
    account_id = var.account_id
  }
}

data "template_file" "assume_role" {
  template = file("./iam/assume_role.json")
  vars = {
    region = var.region
    account_id = var.account_id
  }
}
