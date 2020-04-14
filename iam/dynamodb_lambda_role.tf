resource "aws_iam_role_policy" "dynamodb_lambda_policy" {
  name = "DynamoDBLambdaPolicy"
  role = aws_iam_role.dynamodb_lambda_role.id
  policy = data.template_file.dynamodb_lambda_policy.rendered
}

resource "aws_iam_role_policy_attachment" "ngap_vpc_lambda_attach" {
  role       = aws_iam_role.dynamodb_lambda_role.id
  policy_arn = "arn:aws:iam::${var.account_id}:policy/ngap/system/NGAPShLambdaInVpcBasePolicy"
}

resource "aws_iam_role" "dynamodb_lambda_role" {
  name = "DynamoDBLambdaRole"
  assume_role_policy = data.template_file.assume_role.rendered
  permissions_boundary = "arn:aws:iam::${var.account_id}:policy/NGAPShRoleBoundary"
}
