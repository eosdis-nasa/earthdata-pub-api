resource "aws_iam_role_policy" "dynamodb_lambda_policy" {
  name = "DynamoDBLambdaPolicy"
  role = aws_iam_role.dynamodb_lambda_role.id
  policy = file("./iam/dynamodb_lambda_policy.json")
}

resource "aws_iam_role_policy_attachment" "test-attach" {
  role       = aws_iam_role.dynamodb_lambda_role.id
  policy_arn = "arn:aws:iam::252549204803:policy/ngap/system/NGAPShLambdaInVpcBasePolicy"
}

resource "aws_iam_role" "dynamodb_lambda_role" {
  name = "DynamoDBLambdaRole"
  assume_role_policy = file("./iam/dynamodb_lambda_role.json")
  permissions_boundary = "arn:aws:iam::252549204803:policy/NGAPShRoleBoundary"
}
