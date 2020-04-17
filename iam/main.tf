resource "aws_iam_role_policy" "dynamodb_lambda_policy" {
  name   = "DynamoDBLambdaPolicy${var.stage_suffix}"
  role   = aws_iam_role.dynamodb_lambda_role.id
  policy = data.template_file.dynamodb_lambda_policy.rendered
}

resource "aws_iam_role_policy_attachment" "ngap_vpc_lambda_attach" {
  role       = aws_iam_role.dynamodb_lambda_role.id
  policy_arn = var.lambda_execution_policy_arn
}

resource "aws_iam_role" "dynamodb_lambda_role" {
  name                 = "DynamoDBLambdaRole${var.stage_suffix}"
  assume_role_policy   = data.template_file.assume_role.rendered
  permissions_boundary = var.permissions_boundary_arn
}
