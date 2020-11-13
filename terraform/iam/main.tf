# Lambda IAM Role

resource "aws_iam_role_policy" "edpub_lambda_policy" {
  name   = "EDPUBLambdaPolicy"
  role   = aws_iam_role.edpub_lambda_role.id
  policy = data.template_file.edpub_lambda_policy.rendered
}

resource "aws_iam_role" "edpub_lambda_role" {
  name                 = "EDPUBLambdaRole"
  assume_role_policy   = data.template_file.assume_role.rendered
  permissions_boundary = var.permissions_boundary_arn
}

resource "aws_iam_role_policy_attachment" "edpub_lambda_execution_role_attach" {
  role       = aws_iam_role.edpub_lambda_role.id
  policy_arn = var.lambda_execution_policy_arn
}
